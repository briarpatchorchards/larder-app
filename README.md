# Larder — beta 0.1

Meal planning for a house that cooks in bulk. This folder is the whole app: a static
site that installs to an iPhone home screen and runs offline. No App Store, no
TestFlight, no developer account.

```
index.html              the entire app in one file (5 MB, everything inlined)
manifest.webmanifest    name, colours and icons iOS reads when installing
sw.js                   service worker — offline caching and updates
icons/                  home-screen icons
```

## Publishing it (once)

1. Upload everything in this folder to the root of the `larder-app` repository —
   drag the files into GitHub's web uploader if that's easiest.
2. Repository **Settings → Pages**. Under *Build and deployment*, set Source to
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. Wait a minute or two. The site appears at:
   `https://briarpatchorchards.github.io/larder-app/`

That URL is permanent and free. It is public — anyone with the link can open it, so
treat it as unlisted rather than private.

## Installing it (each tester, once)

Open the link **in Safari** on the iPhone — not Chrome, not an in-app browser like
the one inside Messages or Instagram. Then:

Share button (the square with the arrow, bottom centre) → scroll → **Add to Home
Screen** → Add.

An icon appears on the home screen. Opening it from there launches Larder full
screen with no address bar, and it keeps everything you enter.

**This step matters.** Used as an ordinary Safari tab the app still works, but Safari
clears storage for sites you haven't visited in a while, and a tester could lose two
weeks of planning. The app shows an install reminder on first open for exactly this
reason.

## Updating mid-test

1. Change `Larder.dc.html` in the design project and re-bundle to `beta/index.html`.
2. Bump `CACHE` in `sw.js` (`larder-0.1` → `larder-0.2`) and `APP_VERSION` in the app.
3. Re-upload `index.html` and `sw.js`.

Testers get it on their next open — no reinstall, no re-adding to the home screen.
**Their data survives.** Everything they enter lives in the phone's own storage,
which the service worker cannot see and never clears. The app shows a small
"Updated to 0.2" note the first time it runs a new build.

## What's local, and what isn't

Every plan, rating, prep session, photo and setting is stored **on that phone only**.
There is no account and no server. Consequences worth knowing before the test:

- Two phones do not share a plan. The partner-pairing screen is still a mockup.
- Deleting the home-screen icon deletes the data with it.
- There's no backup. If a tester's plan matters, screenshot it.

The one thing that does leave the phone is the feedback form: *menu → Report a
problem* posts the message, the screen they were on and the build number to
Formspree. Nothing else.

## Known limits in 0.1

- 59 component recipes and one treat carry tags and timings but no method yet —
  their sheets say so rather than showing an empty card.
- The shopping list groups by pantry vs fresh, not yet by store or aisle.
- Calorie totals aren't tracked against a target.
