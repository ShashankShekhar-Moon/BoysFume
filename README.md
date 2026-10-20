# BOYS FUME — a study in presence

A responsive, multi-file static storefront for BOYS FUME: a fictional, tongue-in-cheek luxury fragrance concept.

## What is included

- `index.html` — semantic page structure and content
- `styles.css` — responsive visual system, layouts, drawer, product and checkout styling
- `app.js` — product rendering, shopping bag, quantities, wishlist, mobile navigation and checkout reveal
- `assets/` — locally stored SVG artwork for the hero, products, editorial still lifes and favicon

## Run locally

No build step or package manager is required.

1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For a local server (optional), run `python -m http.server 8000` from this directory and visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload **all files and the `assets` folder**, preserving the folder structure.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

You can also import the repository into Vercel as a static site. No framework or build command is needed.

## Notes

- The shopping bag and wishlist are front-end interactions only; nothing is charged and no order is sent.
- The checkout dialog intentionally reveals the concept's joke. There is no payment integration.
- Fonts are loaded from Google Fonts when online. The local SVG artwork is included in this repository; no external image service is needed for the product visuals.
- This is a fictional concept brand, not affiliated with any existing fragrance house.
