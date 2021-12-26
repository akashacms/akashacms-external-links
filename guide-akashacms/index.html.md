---
layout: plugin-documentation.html.ejs
title: AskashaCMS external-links plugin documentation
publicationDate: December 26, 2021
---

The `@akashacms/plugins-external-links` plugin provides tools to improve the presentation of external links.  It can control which external links receive `rel=nofollow` and add icons, such as the FAVICON of the target site, next to the link.

# Installation

With an AkashaCMS website setup, add the following to `package.json`

```json
"dependencies": {
    ...
    "@akashacms/plugins-external-links": ">0.8.x",
    ...
}
```

Once added to `package.json` run: `npm install`

# Configuration

In the `config.js` for the website:

```js
config.use(require('@akashacms/plugins-external-links'), {
    // options
});
```

TODO FIX REFERENCE The options argument is covered in the documentation of the `@mahabhuta/external-affiliate-link-processor` package.