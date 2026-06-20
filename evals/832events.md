# 832events — running the frontend

[832.events](https://github.com/crowecawcaw/832events) is the first app the UX
review tool is evaluated against. It's a React/Vite SPA that browses Houston
event calendars. The app lives in the `832events/` git submodule next to this
file.

## First-time checkout

The submodule isn't cloned automatically. From the repo root:

```sh
git submodule update --init evals/832events
```

## Start the frontend

All commands run from inside the submodule:

```sh
cd evals/832events

npm install              # root deps; postinstall also installs web/ deps
npm run generate-calendars   # builds event data into output/ (see below)
npm run web:dev          # Vite dev server at http://localhost:5173
```

Open http://localhost:5173.

## Notes on data

- The SPA reads its data (`index.json`, `events-index.json`, `venues.json`, the
  `.ics`/`.rss` calendars) from the `output/` directory. `npm run web:dev`
  serves `output/` as static files, so it must be populated first.
- `npm run generate-calendars` works **offline**: it builds from the committed
  `fetch-cache.json`, producing ~7,900 events across ~84 calendars with no
  network access or API keys. Some sources resolve to 0 events without live
  fetches — that's expected and fine for review.
- Without running `generate-calendars`, the dev server still boots but the app
  has no data to show.
