---
layout: plugin-documentation.html.ejs
title: Mahabhuta @akashacms/plugin-external-links plugin documentation
publicationDate: December 26, 2021
---

The `@akashacms/plugins-external-links` plugin provides tools to improve the presentation of external links (a.k.a. outbound links).  It can control which external links receive `rel=nofollow` and add icons, such as the FAVICON of the target site, next to the link, and also automate adding affiliate tags to the link.

While this package is part of AkashaCMS, the Mahafuncs can be used on their own outside of AkashaCMS.  The documentation in this file describes how to use these functions on their own.

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

# Usage

To use this package stand-alone:

```js
const processor = require('@akashacms/plugins-external-links/mahafuncs');

async function doOutboundLinksProcessing(html, metadata) {
    return await processor.process(html, metadata, {
        // options
    });
}
```

In this case you're providing HTML to the processing function, along with an options object.  Once processing is finished, it returns HTML.  This is useful if your only goal is processing outbound links.

It's also possible to use this package along with other MahabhutaArray's in a more comprehensive application.


```js
const mahabhuta = require('mahabhuta');
const processor = require('@akashacms/plugins-external-links/mahafuncs');
const partial = require('mahabhuta/maha/partial');
...

const array = new mahabhuta.MahafuncArray("master", { });
array.addMahafunc(partial, {
    // options
});
array.addMahafunc(processor, {
    // options
});
...

async function doHTMLProcessing(html, metadata) {
    return await mahabhuta.processAsync(html, metadata, {
        // options
    });
}
```

The difference between the two is in this case you program uses multiple MahafuncArray's full of Mahafunc's.

# Configuration

Configuration is provided through the _options_ object mentioned earlier.

### Controlling `rel=nofollow` in outbound links

Correctly using `rel=nofollow` is critical to whether the search engines think your site is a scummy spam site, or a legitimate source of information and recommendations of other sites.  Further it is required to use `rel=nofollow` when linking to a resource that earns you revenue.  The configuration options available in this package offer quite a lot of flexibility and control.

The `rel=nofollow` attribute is a signal to search engines to not flow "link juice" through the link to the remote site.  We don't have room here for a full treatise on correct use of `rel=nofollow`.

The field `preferNofollow` says whether to start with the default of applying `rel=nofollow`, or the default of not applying it.  Some sites prefer to put `rel=nofollow` on all but a few outbound links, while others prefer to be selective in its use.

The field `whitelist` is useful when `preferNoFollow` is `true`, and specifies a list of sites where `rel=nofollow` will not be set.  For example

```js
const config_no_follow_all_whitelist_good = {
    preferNofollow: true,
    whitelist: [
        /somewhere.good$/i
    ]
};
```

This combination means every site other than ones whose domain name ends with `somewhere.good` will have `rel=nofollow`.

Contrarily the field `blacklist` is useful when `preferNoFollow` is `false`, and this specifies a list of sites where `rel=nofollow` is to be set.  For example:

```js
const config_no_follow_none_blacklist_bad = {
    preferNofollow: false,
    blacklist: [
        /somewhere.bad$/i
    ]
};
```

This means the only links to have `rel=nofollow` have a domain name ending in `somewhere.bad`.

Between those three settings we have quite a lot of flexibility in controlling which sites do or do not get `rel=nofollow`.  Notice that these are regular expressions on the domain name in the `hostname` field of the URL.

### Controlling target=_blank

Another option controls setting `target=_blank` on external links.  This is a blanket setting, whether to always use that behavior or not.  In any options object add this field:

```js
targetBlank: true
```

### Showing _favicons_ next to a link

Another option controls displaying the _favicon_ of the target site next to outbound links.  The _favicon_ is that little icon appearing in the URL location bar.  It is useful to add this as an indicator of an external link, and to help your viewer know where that link heads to.  In any options object add this field:

```js
showFavicons: "before",
```

The value can be _before_ or _after_ controlling whether the _favicon_ appears before the link or afterward.

Under the covers a little-known Google service is used to retrieve the _favicon_.

### Showing small image next to the link

Another option also informs the user that it is an external link, by showing a little blip of an image next to the link.  Like for the _showFavicons_ setting, it takes a value of _before_ or _after_.  In any options object add this field:

```js
showIcon: "after",
```

### Suppressing _favicons_ and external link image for specific links

Sometimes you want to suppress favicons and the external link image on specific links.  The layout of a given link may not work properly with these images, for example.



### Adding affiliate tags to outbound links

There are somewhere around a zillion websites offering affiliate programs.  We are offering here a software module to automatically add affiliate links, and obviously we cannot have covered all the zillion affiliate programs that are available.  Instead the package currently supports three programs, but it is easy to add others as desired.  Pull requests are gladly accepted.

In the options object we specify an array of objects in the `affiliateDomains` field.

```js
const config_amazon_com = {
    preferNofollow: false,
    targetBlank: true,
    showFavicons: "before",
    showIcon: "after",
    affiliateDomains: [
        {
            domain: "amazon.com",
            type: "AMAZON",
            trackingCode: "foobar-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.ca",
            type: "AMAZON",
            trackingCode: "foobar-ca-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.co.uk",
            type: "AMAZON",
            trackingCode: "foobar-co-uk-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.fr",
            type: "AMAZON",
            trackingCode: "foobar-fr-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.de",
            type: "AMAZON",
            trackingCode: "foobar-de-20",
            nofollow: true,
            noskim: true,
            novig: false
        }
    ]
};
```

This is an example covering several Amazon sites.  Each Amazon operation in each country has traditionally had a separate affiliate program.

In each of these objects are several common fields:

* `domain` is a string to match against the `hostname` field of the URL.  It is an `endsWith` match, and therefore will match any hostname ending with the value in `domain`
* `type` specifies which kind of affiliate program it is.  We use this under the covers to apply specific transformations to the URL for the specific destination.  In this case `AMAZON` clearly means an Amazon affiliate program.
* `trackingCode` is the code assigned to your account by the affiliate program.
* `nofollow` specifies whether to set `rel=nofollow` on the link
* `noskim` and `novig` specify whether to set `rel=` values to inform Skimlinks or Viglinks to not rewrite the URL for their system


Zazzle is a marketplace allowing folks to design custom-made products by uploading images that Zazzle prints on to the product.  The Zazzle options object looks the same as the Amazon object, except that you put `zazzle.com` as the `domain`, and `ZAZZLE` as the `type`.

Rakuten operates a large network of affiliate programs where many thousands of merchants use Rakuten's services to manage their affiliate program.  Therefore we have a long list of potential affiliate partners available through site, and more importantly they all use the same rewriting strategy.  Their affiliate object looks a little different:

```js
{
    domain: "rakuten.foo",
    type: "RAKUTEN",
    trackingCode: "rakutenTrackingFoo",
    mid: "rakutenMIDfoo",
    nofollow: true,
    noskim: true,
    novig: true
}
```

Most of this is the same, other than `RAKUTEN` for the `type` and that new field labeled `mid`.  It is a value you get from Rakuten along with your `trackingCode`.
