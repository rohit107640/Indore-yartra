# Your own photos go here

The site currently uses free photos from Wikimedia Commons (listed in `assets/js/data/photos.js` and credited on `credits.html`). Photos of your own cars, drivers and trips will look more authentic and convert better.

| Folder | What to put in it | Suggested size |
|---|---|---|
| `cars/` | Your actual Dzire, Amaze, Ertiga, Innova, Force Traveller | 1600 × 1000 px, landscape |
| `places/` | Trips you've run: Ujjain, Omkareshwar, Mandu, Hanuwantiya… | 2400 px wide or more (for the Home slideshow) |
| `team/` | You, your drivers, happy customers (with permission) | 1200 × 1200 px |

## How to use a photo

1. Save it here, e.g. `assets/images/cars/my-ertiga.jpg` (use lowercase names with dashes, and compress it at squoosh.app or tinypng.com first).
2. Point the site at it. For example, in `assets/js/data/cabs.js`:
   ```js
   { id: "ertiga", name: "Maruti Ertiga", image: "assets/images/cars/my-ertiga.jpg", ... }
   ```
   The same works for `image:` in `assets/js/data/packages.js` and in the gallery list in `assets/js/gallery.js`.
3. If you replace every Wikimedia photo, you can remove `credits.html` and its footer link.
