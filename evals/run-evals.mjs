#!/usr/bin/env node
// Orchestrator for the marketing-dashboard-defects DETECTION eval.
//
// Runs the `claude` CLI headlessly (a Claude subscription, authenticated via
// `claude setup-token` / CLAUDE_CODE_OAUTH_TOKEN) once per (model, variant,
// mode) job, in two modes:
//   - skill:   the reviewer is told to follow skills/ux-review/SKILL.md
//   - control: the reviewer gets a vague "give me feedback" ask, the same app
//              access, but no skill files and no style-inventory tool —
//              measures how much of the score is the skill vs. the model.
// Then grades each mode/model's reports against the ground-truth answer key
// with a `claude -p --model sonnet` call, and writes a summary matrix.
//
// Usage:
//   node evals/run-evals.mjs [--models haiku,sonnet,opus] [--variants all|v1,v2,...]
//                             [--control] [--skill] [--concurrency 2]
//                             [--out evals-out] [--dry-run]
//   node evals/run-evals.mjs --summarize-only <dir>   # re-render <dir>/summary.md
//                                                       # from <dir>/grades/*.json
//
// Defaults: models=haiku,sonnet,opus; variants=all (v1..v7); both skill and
// control modes run unless one of --skill/--control is passed alone; out dir
// defaults to evals-out/<UTC timestamp>.
//
// No dependencies beyond what's already in package.json (playwright-core,
// used transitively by the reviewers' tools, not by this script). Plain node.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, appendFileSync, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const ALL_VARIANTS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'];
const DEFAULT_MODELS = ['haiku', 'sonnet', 'opus'];
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_TIMEOUT_MINUTES = 25;
const GRADING_TIMEOUT_MINUTES = 10;
const GRADING_MODEL = 'sonnet';
const SERVER_URL = 'http://localhost:4010/marketing-dashboard/index.html';
const APPS_DIR = path.join(REPO_ROOT, 'evals', 'apps');
const GROUND_TRUTH_PATH = path.join(REPO_ROOT, 'evals', 'defects', 'marketing-dashboard-ground-truth.md');
const CONTROL_PROMPT_PATH = path.join(REPO_ROOT, 'evals', 'control-prompt.md');

const SKILL_PROMPT_TEMPLATE = `You are a senior UX reviewer. Perform a full UX review by following the skill at skills/ux-review/SKILL.md exactly, including its companion files (checklists.md, precedents.md, examples.md, tools/style-inventory.mjs). Read SKILL.md first, then the brief, then work the stages in order.
Review target:
- App under review: http://localhost:4010/marketing-dashboard-defects/<V>/index.html
- Brief: evals/apps/marketing-dashboard-defects/<V>/brief.md
- Happy-path scenarios: evals/apps/marketing-dashboard-defects/<V>/scenarios/*.json
- Screenshot helper: node evals/shoot.mjs <scenario.json> <outDir>
- Style inventory: node skills/ux-review/tools/style-inventory.mjs <url-or-scenario.json> [out.md]
- Output directory (write raw.md, findings.md, report.md here): <OUTDIR>
- View the screenshots you capture — actually look at them.
Adaptations: run all stages inline yourself, sequentially. For fresh-eyes probes, if you cannot spawn context-free subagents, write "probes unavailable" in raw.md and continue. Single pass, no prior report.
STRICT BLINDNESS: do NOT read anything under evals/defects/; do NOT open any app directory other than your assigned one; you MAY read your own app's source.
When done, ensure report.md exists in the output directory.
`;

// ---------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------
function parseArgs(argv) {
  const args = {
    models: null,
    variants: null,
    control: false,
    skill: false,
    concurrency: DEFAULT_CONCURRENCY,
    out: null,
    dryRun: false,
    timeoutMinutes: DEFAULT_TIMEOUT_MINUTES,
    summarizeOnly: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    const takeValue = () => {
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) return null;
      i++;
      return v;
    };
    switch (tok) {
      case '--models':
        args.models = takeValue();
        break;
      case '--variants':
        args.variants = takeValue();
        break;
      case '--control':
        args.control = true;
        break;
      case '--skill':
        args.skill = true;
        break;
      case '--concurrency': {
        const v = takeValue();
        if (v) args.concurrency = parseInt(v, 10);
        break;
      }
      case '--out':
        args.out = takeValue();
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--timeout-minutes': {
        const v = takeValue();
        if (v) args.timeoutMinutes = parseInt(v, 10);
        break;
      }
      case '--summarize-only':
        args.summarizeOnly = takeValue();
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
      default:
        console.error(`Unknown argument: ${tok}`);
        process.exit(1);
    }
  }
  return args;
}

function utcStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function resolveVariants(variantsArg) {
  if (!variantsArg || variantsArg === 'all') return [...ALL_VARIANTS];
  const list = variantsArg.split(',').map((s) => s.trim()).filter(Boolean);
  for (const v of list) {
    if (!ALL_VARIANTS.includes(v)) {
      console.error(`Unknown variant "${v}" — must be one of ${ALL_VARIANTS.join(', ')} or "all".`);
      process.exit(1);
    }
  }
  return list;
}

function resolveModels(modelsArg) {
  if (!modelsArg) return [...DEFAULT_MODELS];
  return modelsArg.split(',').map((s) => s.trim()).filter(Boolean);
}

function resolveModes(args) {
  if (!args.skill && !args.control) return ['skill', 'control'];
  const modes = [];
  if (args.skill) modes.push('skill');
  if (args.control) modes.push('control');
  return modes;
}

// ---------------------------------------------------------------------
// Static server bootstrap
// ---------------------------------------------------------------------
function checkServerUp(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServer(dryRun) {
  const up = await checkServerUp(SERVER_URL);
  if (up) {
    console.log(`[server] already up at ${SERVER_URL}`);
    return null;
  }
  if (dryRun) {
    console.log(`[dry-run] server not up at ${SERVER_URL}; would run: python3 -m http.server 4010 -d ${path.relative(REPO_ROOT, APPS_DIR)}`);
    return null;
  }
  console.log(`[server] not up; starting: python3 -m http.server 4010 -d ${path.relative(REPO_ROOT, APPS_DIR)}`);
  const child = spawn('python3', ['-m', 'http.server', '4010', '-d', APPS_DIR], {
    cwd: REPO_ROOT,
    stdio: 'ignore',
    detached: true,
  });
  child.unref();
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    // eslint-disable-next-line no-await-in-loop
    if (await checkServerUp(SERVER_URL)) {
      console.log('[server] up');
      return child;
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 400));
  }
  console.error('[server] did not come up within 15s — jobs may fail to reach the app');
  return child;
}

// ---------------------------------------------------------------------
// Prompt building
// ---------------------------------------------------------------------
function substitute(template, variant, outDir) {
  return template.split('<V>').join(variant).split('<OUTDIR>').join(outDir);
}

function buildSkillPrompt(variant, outDir) {
  return substitute(SKILL_PROMPT_TEMPLATE, variant, outDir);
}

function buildControlPrompt(variant, outDir) {
  const template = readFileSync(CONTROL_PROMPT_PATH, 'utf8');
  return substitute(template, variant, outDir);
}

// ---------------------------------------------------------------------
// Command execution
// ---------------------------------------------------------------------
function quoteForDisplay(arg) {
  if (/^[A-Za-z0-9_\-./:]+$/.test(arg)) return arg;
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

function commandLineForDisplay(args) {
  return ['claude', ...args.map(quoteForDisplay)].join(' ');
}

// Runs `claude -p <prompt> --model <model> --dangerously-skip-permissions`,
// streaming stdout/stderr to logFile, with a hard kill timeout. Returns a
// status object; never throws (failures are recorded, not fatal).
function runClaude({ prompt, model, cwd, logFile, timeoutMs, dryRun }) {
  const claudeArgs = ['-p', prompt, '--model', model, '--dangerously-skip-permissions'];
  const display = commandLineForDisplay(claudeArgs);

  if (dryRun) {
    console.log(`[dry-run] cwd=${cwd}`);
    console.log(`[dry-run] ${display}`);
    writeFileSync(
      logFile,
      `[dry-run] would run:\n${display}\n\n--- prompt ---\n${prompt}\n`
    );
    return Promise.resolve({ status: 'dry-run', code: null, timedOut: false, durationMs: 0, command: display });
  }

  return new Promise((resolve) => {
    const start = Date.now();
    let child;
    try {
      child = spawn('claude', claudeArgs, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      writeFileSync(logFile, `failed to spawn claude: ${err.message}\n`);
      resolve({ status: 'error', code: null, timedOut: false, durationMs: 0, command: display, error: err.message });
      return;
    }

    const logStream = createWriteStream(logFile, { flags: 'a' });
    logStream.write(`--- command ---\n${display}\n--- output ---\n`);
    child.stdout.pipe(logStream, { end: false });
    child.stderr.pipe(logStream, { end: false });

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      logStream.write(`\nchild process error: ${err.message}\n`);
      logStream.end();
      resolve({ status: 'error', code: null, timedOut: false, durationMs: Date.now() - start, command: display, error: err.message });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      logStream.end(() => {
        resolve({
          status: timedOut ? 'timeout' : code === 0 ? 'ok' : 'error',
          code,
          timedOut,
          durationMs: Date.now() - start,
          command: display,
        });
      });
    });
  });
}

// Same as runClaude but buffers stdout into a string instead of a log file —
// used for the grading pass, where we need to parse the response.
function runClaudeCapture({ prompt, model, cwd, timeoutMs, dryRun }) {
  const claudeArgs = ['-p', prompt, '--model', model, '--dangerously-skip-permissions'];
  const display = commandLineForDisplay(claudeArgs);

  if (dryRun) {
    console.log(`[dry-run] ${display}`);
    return Promise.resolve({ status: 'dry-run', stdout: '', stderr: '', code: null, timedOut: false, command: display });
  }

  return new Promise((resolve) => {
    let child;
    try {
      child = spawn('claude', claudeArgs, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      resolve({ status: 'error', stdout: '', stderr: err.message, code: null, timedOut: false, command: display });
      return;
    }
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ status: 'error', stdout, stderr: stderr + err.message, code: null, timedOut: false, command: display });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        status: timedOut ? 'timeout' : code === 0 ? 'ok' : 'error',
        stdout,
        stderr,
        code,
        timedOut,
        command: display,
      });
    });
  });
}

// ---------------------------------------------------------------------
// Concurrency pool
// ---------------------------------------------------------------------
async function runPool(items, concurrency, worker) {
  let idx = 0;
  const results = new Array(items.length);
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  }
  const n = Math.max(1, Math.min(concurrency, items.length || 1));
  await Promise.all(Array.from({ length: n }, next));
  return results;
}

// ---------------------------------------------------------------------
// Ground truth parsing (read-only — never write under evals/defects/)
// ---------------------------------------------------------------------
function parseGroundTruthSeverities(gtText) {
  const map = new Map(); // defect id -> severity
  const byVariant = new Map(); // variant -> [defect ids in order]
  for (const line of gtText.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    const idCell = cells[1];
    if (!idCell || !/^v\d+-d\d+$/.test(idCell)) continue;
    const sevCell = (cells[cells.length - 2] || '').toLowerCase();
    if (sevCell === 'high' || sevCell === 'medium' || sevCell === 'low') {
      map.set(idCell, sevCell);
      const variant = idCell.split('-')[0];
      if (!byVariant.has(variant)) byVariant.set(variant, []);
      byVariant.get(variant).push(idCell);
    }
  }
  return { severities: map, byVariant };
}

// ---------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------
function extractJsonBlock(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function parseGradeJson(raw) {
  const candidates = [raw.trim()];
  const block = extractJsonBlock(raw);
  if (block) candidates.push(block);
  for (const c of candidates) {
    try {
      return JSON.parse(c);
    } catch {
      // try next candidate
    }
  }
  return null;
}

function buildGradingPrompt({ gtText, variantReports, byVariant }) {
  let prompt = `You are grading UX review reports against a known answer key. Be strict and literal.\n\n`;
  prompt += `## Ground truth (answer key)\n\n${gtText}\n\n---\n\n`;
  prompt += `## Reports to grade\n\n`;
  for (const { variant, content, missing } of variantReports) {
    prompt += `### Variant ${variant}\n\n`;
    prompt += missing ? `(no report.md was produced for this variant — treat every defect below as not detected)\n\n` : `${content}\n\n`;
  }
  prompt += `---\n\n## Task\n\n`;
  prompt += `For each variant listed above, score exactly these defect ids:\n`;
  for (const { variant } of variantReports) {
    const ids = byVariant.get(variant) || [];
    prompt += `- ${variant}: ${ids.join(', ')}\n`;
  }
  prompt += `\nA defect counts as detected if the report names the element and the problem (the exact principle label need not match). `;
  prompt += `For each defect, also record the severity the report assigned it (severity_reported: "high"|"medium"|"low"|"none" if not detected), and a one-line evidence quote/paraphrase from the report (or "" if not detected).\n\n`;
  prompt += `Also list any spurious findings per variant — findings in the report that do not correspond to any seeded defect (an empty array if none).\n\n`;
  prompt += `Output ONLY a single JSON object, no markdown code fences, no prose before or after, matching exactly this shape:\n\n`;
  prompt += `{\n  "variants": {\n    "<variant>": {\n      "<defect-id>": { "detected": true|false, "severity_reported": "high"|"medium"|"low"|"none", "evidence": "..." }\n    }\n  },\n  "spurious": {\n    "<variant>": ["..."]\n  }\n}\n`;
  return prompt;
}

async function gradeModeModel({ mode, model, variants, outRoot, dryRun }) {
  const gtText = readFileSync(GROUND_TRUTH_PATH, 'utf8');
  const { byVariant } = parseGroundTruthSeverities(gtText);
  const CAP = 12000;

  const variantReports = variants.map((variant) => {
    const reportPath = path.join(outRoot, mode, model, variant, 'report.md');
    if (!existsSync(reportPath)) return { variant, content: '', missing: true };
    let content = readFileSync(reportPath, 'utf8');
    if (content.length > CAP) content = content.slice(0, CAP) + '\n\n[...truncated for grading...]';
    return { variant, content, missing: false };
  });

  const prompt = buildGradingPrompt({ gtText, variantReports, byVariant });
  const timeoutMs = GRADING_TIMEOUT_MINUTES * 60 * 1000;

  if (dryRun) {
    console.log(`[dry-run] grading ${mode}/${model}:`);
    const display = commandLineForDisplay(['-p', prompt, '--model', GRADING_MODEL, '--dangerously-skip-permissions']);
    console.log(`[dry-run] ${display}`);
    return null; // no grade file written in dry-run
  }

  let result = await runClaudeCapture({ prompt, model: GRADING_MODEL, cwd: REPO_ROOT, timeoutMs, dryRun });
  let parsed = result.status === 'ok' ? parseGradeJson(result.stdout) : null;

  if (!parsed) {
    // Retry once with a stricter reminder.
    const retryPrompt = prompt + `\n\nREMINDER: your previous response (if any) was not valid JSON. Output ONLY the JSON object described above — no markdown fences, no commentary.`;
    result = await runClaudeCapture({ prompt: retryPrompt, model: GRADING_MODEL, cwd: REPO_ROOT, timeoutMs, dryRun });
    parsed = result.status === 'ok' ? parseGradeJson(result.stdout) : null;
  }

  const gradeDir = path.join(outRoot, 'grades');
  mkdirSync(gradeDir, { recursive: true });
  const gradeFile = path.join(gradeDir, `${mode}-${model}.json`);

  if (!parsed) {
    const failure = {
      mode,
      model,
      error: 'failed to parse grading JSON after retry',
      status: result.status,
      rawStdout: result.stdout?.slice(0, 4000) || '',
      rawStderr: result.stderr?.slice(0, 2000) || '',
    };
    writeFileSync(gradeFile, JSON.stringify(failure, null, 2));
    console.error(`[grade] ${mode}/${model}: FAILED to parse grading JSON`);
    return failure;
  }

  const record = { mode, model, gradedAt: new Date().toISOString(), ...parsed };
  writeFileSync(gradeFile, JSON.stringify(record, null, 2));
  console.log(`[grade] ${mode}/${model}: wrote ${path.relative(REPO_ROOT, gradeFile)}`);
  return record;
}

// ---------------------------------------------------------------------
// Summary rendering
// ---------------------------------------------------------------------
function computeCounts(grade, severities) {
  const bands = { high: { detected: 0, total: 0 }, medium: { detected: 0, total: 0 }, low: { detected: 0, total: 0 } };
  let detected = 0;
  let total = 0;
  const perVariant = {};
  const variantsObj = grade?.variants || {};
  for (const [variant, defects] of Object.entries(variantsObj)) {
    let vDetected = 0;
    let vTotal = 0;
    for (const [defectId, info] of Object.entries(defects)) {
      const sev = severities.get(defectId);
      if (!sev) continue; // unknown id, ignore
      vTotal++;
      total++;
      bands[sev].total++;
      if (info && info.detected === true) {
        vDetected++;
        detected++;
        bands[sev].detected++;
      }
    }
    perVariant[variant] = { detected: vDetected, total: vTotal };
  }
  return { bands, detected, total, perVariant };
}

function renderSummary(outRoot) {
  const gradesDir = path.join(outRoot, 'grades');
  const gtPath = GROUND_TRUTH_PATH;
  let severities = new Map();
  if (existsSync(gtPath)) {
    severities = parseGroundTruthSeverities(readFileSync(gtPath, 'utf8')).severities;
  }

  let files = [];
  if (existsSync(gradesDir)) {
    files = readdirSync(gradesDir).filter((f) => f.endsWith('.json')).sort();
  }

  let md = `# UX detection eval — summary\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;

  if (files.length === 0) {
    md += `_No grade files found in \`${path.relative(REPO_ROOT, gradesDir)}\` yet._ `;
    md += `This is expected for a \`--dry-run\` (no \`claude\` calls are made) or if grading hasn't completed.\n`;
    writeFileSync(path.join(outRoot, 'summary.md'), md);
    return md;
  }

  md += `## Matrix (detected / total, by severity band)\n\n`;
  md += `| mode / model | high | medium | low | overall |\n|---|---|---|---|---|\n`;

  const rows = [];
  for (const file of files) {
    let grade;
    try {
      grade = JSON.parse(readFileSync(path.join(gradesDir, file), 'utf8'));
    } catch {
      continue;
    }
    if (grade.error) {
      md += `| ${grade.mode}/${grade.model} | — | — | — | grading failed: ${grade.error} |\n`;
      continue;
    }
    const counts = computeCounts(grade, severities);
    rows.push({ mode: grade.mode, model: grade.model, counts });
    md += `| ${grade.mode}/${grade.model} | ${counts.bands.high.detected}/${counts.bands.high.total} | ${counts.bands.medium.detected}/${counts.bands.medium.total} | ${counts.bands.low.detected}/${counts.bands.low.total} | ${counts.detected}/${counts.total} |\n`;
  }

  md += `\n## Per-variant breakdown\n\n`;
  for (const row of rows) {
    md += `### ${row.mode}/${row.model}\n\n`;
    md += `| variant | detected / total |\n|---|---|\n`;
    for (const [variant, v] of Object.entries(row.counts.perVariant)) {
      md += `| ${variant} | ${v.detected}/${v.total} |\n`;
    }
    md += `\n`;
  }

  writeFileSync(path.join(outRoot, 'summary.md'), md);

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  }

  return md;
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------
function printHelp() {
  console.log(`Usage: node evals/run-evals.mjs [options]

  --models <list>         comma-separated model aliases (default: haiku,sonnet,opus)
  --variants all|<list>   comma-separated variant ids v1..v7 (default: all)
  --control               run only control mode
  --skill                 run only skill mode
                          (default: run both skill and control)
  --concurrency <n>       parallel job slots (default: ${DEFAULT_CONCURRENCY})
  --out <dir>             output directory (default: evals-out/<UTC timestamp>)
  --timeout-minutes <n>   per-job hard timeout (default: ${DEFAULT_TIMEOUT_MINUTES})
  --dry-run               print every command + prompt, do nothing else
  --summarize-only <dir>  re-render <dir>/summary.md from <dir>/grades/*.json
  -h, --help              show this help
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (args.summarizeOnly) {
    const outRoot = path.resolve(args.summarizeOnly);
    const md = renderSummary(outRoot);
    console.log(md);
    return;
  }

  const models = resolveModels(args.models);
  const variants = resolveVariants(args.variants);
  const modes = resolveModes(args);
  const concurrency = Number.isFinite(args.concurrency) && args.concurrency > 0 ? args.concurrency : DEFAULT_CONCURRENCY;
  const outRoot = path.resolve(REPO_ROOT, args.out || path.join('evals-out', utcStamp()));
  const timeoutMs = args.timeoutMinutes * 60 * 1000;

  console.log(`[config] models=${models.join(',')} variants=${variants.join(',')} modes=${modes.join(',')} concurrency=${concurrency} out=${path.relative(REPO_ROOT, outRoot)} dryRun=${args.dryRun}`);

  mkdirSync(outRoot, { recursive: true });

  await ensureServer(args.dryRun);

  // Build job list.
  const jobs = [];
  for (const mode of modes) {
    for (const model of models) {
      for (const variant of variants) {
        const jobOutDir = path.join(outRoot, mode, model, variant);
        jobs.push({ mode, model, variant, outDir: jobOutDir });
      }
    }
  }

  console.log(`[jobs] ${jobs.length} review job(s) to run`);

  const jobResults = await runPool(jobs, concurrency, async (job) => {
    mkdirSync(job.outDir, { recursive: true });
    const prompt = job.mode === 'skill' ? buildSkillPrompt(job.variant, job.outDir) : buildControlPrompt(job.variant, job.outDir);
    const logFile = path.join(job.outDir, 'run.log');
    const label = `${job.mode}/${job.model}/${job.variant}`;
    console.log(`[job] start ${label}`);
    const result = await runClaude({
      prompt,
      model: job.model,
      cwd: REPO_ROOT,
      logFile,
      timeoutMs,
      dryRun: args.dryRun,
    });
    console.log(`[job] done  ${label} -> ${result.status} (${(result.durationMs / 1000).toFixed(1)}s)`);
    return { ...job, ...result };
  });

  writeFileSync(path.join(outRoot, 'jobs.json'), JSON.stringify(jobResults, null, 2));

  // Grading pass: one call per (mode, model) that actually ran.
  if (args.dryRun) {
    console.log(`[dry-run] would grade ${modes.length * models.length} mode/model pair(s):`);
    for (const mode of modes) {
      for (const model of models) {
        // eslint-disable-next-line no-await-in-loop
        await gradeModeModel({ mode, model, variants, outRoot, dryRun: true });
      }
    }
  } else {
    for (const mode of modes) {
      for (const model of models) {
        // eslint-disable-next-line no-await-in-loop
        await gradeModeModel({ mode, model, variants, outRoot, dryRun: false });
      }
    }
  }

  const summary = renderSummary(outRoot);
  console.log('\n' + summary);
  console.log(`\nDone. Output: ${outRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
