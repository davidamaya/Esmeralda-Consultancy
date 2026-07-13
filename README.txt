ESMERALDA CONSULTANCY - DEPLOY NOTES
====================================

Files go at the ROOT of the repo, not inside a folder:
  index.html  edd.html  crd.html  start.html  notices.html  faq.html
  404.html  styles.css  app.js  og-image.png  robots.txt  sitemap.xml

Before launch, edit app.js, lines 4-5:
  CONTACT_EMAIL = "you@yourdomain.com"
  CONTACT_PHONE = "(209) 555-0134"   (or leave "" to hide phone rows)

Deploy:
  1. Upload the files above to the repo root and commit.
  2. Settings -> Pages -> Deploy from a branch -> main / (root) -> Save.
  3. Live in ~2 min at davidamaya.github.io/Esmeralda-Consultancy/

If you use a custom domain:
  - Update the canonical URLs, og:url values, sitemap.xml, robots.txt,
    and og:image URLs to the final domain.
  - Keep og-image.png in the repo root unless you change those paths.

Updating an existing repo:
  Upload the files themselves, not the folder. Delete any leftover
  services.html, contact.html, or deadlines.html from the repo root;
  those pages no longer exist.

After launch:
  - Submit the review form once. FormSubmit emails you a confirmation
    link. Click it and the form is armed.

Notes:
  - Opening a single page inside a chat preview may not load styles.css
    or app.js. Unzip and open index.html locally, or deploy.
  - The home notice search fetches notices.html, so it works best from
    GitHub Pages or a local server.
  - The review form attaches the selected photo when the visitor presses
    Send. It does not read or upload the photo before submission.


Holiday-aware deadline calculator:
- The Start page rolls deadlines past weekends and observed California state-office holidays generated in app.js.
- Keep the disclaimer: the notice, agency rules, and filing method control.
