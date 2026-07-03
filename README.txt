ESMERALDA CONSULTANCY - DEPLOY NOTES
====================================

Files (all 7 go at the ROOT of the repo, not inside a folder):
  index.html  edd.html  crd.html  start.html  faq.html  styles.css  app.js

Before launch, edit app.js, lines 4-5:
  CONTACT_EMAIL = "you@yourdomain.com"
  CONTACT_PHONE = "(209) 555-0134"   (or leave "" to hide phone rows)

Deploy:
  1. New public repo (e.g. Esmeralda-Consultancy). If you use a different
     name, update the canonical/og URLs in each page's <head>.
  2. Upload all 7 files to the repo root, commit.
  3. Settings -> Pages -> Deploy from a branch -> main / (root) -> Save.
  4. Live in ~2 min at davidamaya.github.io/Esmeralda-Consultancy/

Updating an existing repo:
  Upload the 7 files themselves, not the folder. Delete any leftover
  services.html, contact.html, or deadlines.html from the repo root;
  those pages no longer exist.

After launch:
  - Submit the review form once. FormSubmit emails you a confirmation
    link. Click it and the form is armed.

Note: opening a single page inside a chat preview won't load styles.css
or app.js. Unzip and open index.html locally (double-click works) or
deploy. Everything is wired through relative paths.

