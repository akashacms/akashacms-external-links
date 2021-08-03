---
layout: plugin-documentation.html.ejs
title: AskashaCMS external-links plugin documentation
publicationDate: July 4, 2017
---

The `akashacms-external-links` plugin provides tools to improve the presentation of external links.  It can control which external links receive `rel=nofollow` and add icons, such as the FAVICON of the target site, next to the link.


# Installation

With an AkashaCMS website setup, add the following to `package.json`

```
  "dependencies": {
    ...
    "akashacms-external-links": ">0.6.2",
    ...
  }
```

Once added to `package.json` run: `npm install`

# Configuration

In `config.js` for the website:

```
config.use(require('akashacms-external-links'));
```

There are several configuration settings to go over.

## Use `target=_blank` on external links

Often we want our visitors who click on a link to have it open in a new tab, so that they don't exit our site.  

```
config.plugin("akashacms-external-links")
    .setTargetBlank(config, true)
```

## Show favicon for the destination site

The _favicon_ is that icon displayed in the browser location bar or elsewhere.  It's a little image that adds significantly to the users ability to recognize the link points to an external site, and what that site is.  For example:  https://cnn.com

```
config.plugin("akashacms-external-links")
    .setShowFavicons(config, "after|before|never")
```

Leave this off, or set to _never_, if you do not want favicons to display.  Otherwise _after_ means the favicon is shown after the link, and _before_ means it is shown before.

## Show a simple icon next to destination site

The simple icon is a simple marker that can display next to a link.  Specifically, this icon: <img class="akashacms-external-links-icon" src="/img/extlink.png" style="display: inline-block; padding-right: 2px;" alt="(external link)"/>

```
config.plugin("akashacms-external-links")
    .setShowIcon(config, "after|before|never")
```

Leave this off, or set to _never_, if you do not want the simple icon to display.  Otherwise _after_ means the simple icon is shown after the link, and _before_ means it is shown before.

## Suppress the favicon and external link images for specific links

Sometimes the layout of a given link dictates that you cannot use these images with those links.  To suppress the images, simply add the class `akashacms-external-links-suppress-icons` like so:

```
<a href="URL" class="... akashacms-external-links-suppress-icons ...">TEXT</a>
```

## Control whether `rel=nofollow` is added

The `rel=nofollow` tag is very important for at least two reasons:

1. Controlling which sites receive a search engine boost
1. Avoiding being dinged by search engines for linking to questionable sites
1. Avoiding being dinged by search engines for linking to sites that pay you money --- it's now required that links to sites from which you earn revenue have the `nofollow` attribute

For this feature we have three settings:

```
config.plugin("akashacms-external-links")
    .setPreferNofollow(config, true|false)
```

This flag controls the default `rel=nofollow` behavior.  If `true` your outbound links will always have `rel=nofollow` except for sites added to the _whitelist_.  Likewise, `false` means outbound links will not have `rel=nofollow` except for sites added to the _blacklist_.

Whitelist?  Blacklist?

```
config
    .addBlacklistEntry(config, 'google.com')
    .addBlacklistEntry(config, 'docs.google.com')
    .addBlacklistEntry(config, 'cnn.com')
    .addBlacklistEntry(config, 'bbc.co.uk')
    .addBlacklistEntry(config, 'amazon.com')
    .addBlacklistEntry(config, 'ebay.com')
    .addWhitelistEntry(config, '7gen.com')
    .addWhitelistEntry(config, 'visforvoltage.org')
    .addWhitelistEntry(config, 'thereikipage.com');
```

The sites on _whitelist_ will not receive `rel=nofollow`, and those on _blacklist_ will.

NOTE: These entries are treated as regular expressions, meaning you can do this:

```
config.plugin("akashacms-external-links")
    .setTargetBlank(config, true)
    .setShowFavicons(config, "before")
    .addBlacklistEntry(config, /wikipedia.org$/i)
    .addBlacklistEntry(config, /cnn.com$/i)
    .addBlacklistEntry(config, /nytimes.com$/i)
    .addBlacklistEntry(config, /amazon.com$/i)
    .addBlacklistEntry(config, /ebay.com$/i);
```
