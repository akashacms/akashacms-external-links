
/* TODO - Use this MahafuncArray in one of two ways
        1- "process" that takes Text, processes, then returns Text
        2- MahafuncArray
TODO - for both modes supply the same options object

HURM - MahafuncArray constructor can receive a config object that is 
        currently unused.  What if the there was a method to inject that 
        config into the Mahafunc object? */

import url, { URL } from 'node:url';
import akasha from 'akasharender';
const mahabhuta = akasha.mahabhuta;

const __dirname = import.meta.dirname;

const pluginName = "@akashacms/plugins-external-links";

export async function process(text, metadata, options) {
    let funcs = mahabhutaArray(options);
    return await mahabhuta.processAsync(text, metadata, funcs);
};

export function mahabhutaArray(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new ExternalLinkMunger());
    return ret;
};

/*
 * TODO
 *
 * These go into akashacms-affiliates:
 *
 * 5. Manipulate eBay links to add affiliate tag
 * 6. Manipulate Linkshare links with affiliate coding
 *
 */


/* Config required:

preferNofollow

blacklist

whitelist

targetBlank

showFavicons

showIcon

externalLinkIcon */

/**
 * Manipulate the rel= attributes on a link returned from Mahabhuta.
 *
 * @params {$link} The link to manipulate
 * @params {attr} The attribute name
 * @params {doattr} Boolean flag whether to set (true) or remove (false) the attribute
 *
 */
 function linkRelSetAttr($link, attr, doattr) {
    let linkrel = $link.attr('rel');
    let rels = linkrel ? linkrel.split(' ') : [];
    let hasattr = rels.indexOf(attr) >= 0;
    if (!hasattr && doattr) {
        rels.unshift(attr);
        $link.attr('rel', rels.join(' '));
    } else if (hasattr && !doattr) {
        rels.splice(rels.indexOf(attr));
        $link.attr('rel', rels.join(' '));
    }
};

class ExternalLinkMunger extends mahabhuta.Munger {
    get selector() { return "html body a"; }

    async process($, $link, metadata, dirty) {
        var href     = $link.attr('href');
        var rel      = $link.attr('rel');

        // console.log(`ExternalLinkMunger href=${href}`)

        if (!href) return "";

        // We only act on the link if it is external -- has a PROTOCOL and HOST
        const urlP = url.parse(href, true, true);
        if (urlP.protocol || urlP.host) {

            var donofollow = this.array.options.preferNofollow;

            if (this.array.options.blacklist) this.array.options.blacklist.forEach(function(re) {
                if (urlP.hostname.match(re)) {
                    donofollow = true;
                }
            });
            if (this.array.options.whitelist) this.array.options.whitelist.forEach(function(re) {
                if (urlP.hostname.match(re)) {
                    donofollow = false;
                }
            });

            linkRelSetAttr($link, 'nofollow', donofollow);

            if (this.array.options.targetBlank) {
                $link.attr('target', '_blank');
            }

            // It's ugly to put the icons next to image links
            let hasImages = $link.find('img').get(0);

            if (! $link.hasClass('akashacms-external-links-suppress-icons')) {
                if (!hasImages && typeof this.array.options.showFavicons !== 'undefined') {
                    this.showFavicons($link, urlP);
                }

                if (!hasImages && typeof this.array.options.showIcon !== 'undefined') {
                    this.showExternalLinkIcon($link);
                }
            }

            if (typeof this.array.options.affiliateDomains !== 'undefined') {
                this.handleAffiliateCodes($link, urlP);
            }

        }

        return "";
    }

    showFavicons($link, urlP) {

        if (this.array.options.showFavicons === "before"
         || this.array.options.showFavicons === "after") {
           let $previous = $link.prev();
           let $prevprev = $previous.prev();
           let $next = $link.next();
           let $nextnext = $next.next();
           if (
               ($previous && $previous.hasClass('akashacms-external-links-favicon'))
            || ($prevprev && $prevprev.hasClass('akashacms-external-links-favicon'))
            || ($next && $next.hasClass('akashacms-external-links-favicon'))
            || ($nextnext && $nextnext.hasClass('akashacms-external-links-favicon'))
           ) {
               // skip
           } else { 
               let imghtml = `
               <img class="akashacms-external-links-favicon opengraph-no-promote"
                    src="https://www.google.com/s2/favicons?domain=${urlP.hostname}"
                    style="display: inline-block; padding-right: 2px;"
                    alt="(${urlP.hostname})"/>
               `;
               if (this.array.options.showFavicons === "before") {
                   $link.before(imghtml);
               } else {
                   $link.after(imghtml);
               }
           }
        }
    }

    showExternalLinkIcon($link) {

        if (this.array.options.showIcon === "before"
         || this.array.options.showIcon === "after") {
            let $previous = $link.prev();
            let $prevprev = $previous.prev();
            let $next = $link.next();
            let $nextnext = $next.next();
            if (
                ($previous && $previous.hasClass('akashacms-external-links-icon'))
                || ($prevprev && $prevprev.hasClass('akashacms-external-links-icon'))
                || ($next && $next.hasClass('akashacms-external-links-icon'))
                || ($nextnext && $nextnext.hasClass('akashacms-external-links-icon'))
            ) {
                // skip
            } else {
                // TODO where to store this icon?  Maybe force it to be set.
                let iconurl =
                    this.array.options.externalLinkIcon
                    ? this.array.options.externalLinkIcon
                    : '/img/extlink.png';
                let imghtml = `
                <img class="akashacms-external-links-icon opengraph-no-promote"
                        src="${iconurl}"
                        style="display: inline-block; padding-right: 2px;"
                        alt="(external link)"/>
                `;
                if (this.array.options.showIcon === "before") {
                    $link.before(imghtml);
                } else {
                    $link.after(imghtml);
                }
            }
        }
    }

    handleAffiliateCodes($link, urlP) {
        for (let aff of this.array.options.affiliateDomains) {
            if (aff.domain
             && urlP.hostname
             && urlP.hostname.toLowerCase().endsWith(aff.domain)) {
                if (aff.type && aff.type === "AMAZON") {
                    this.handleAmazonAffiliateCode($link, aff, urlP);
                }
                if (aff.type && aff.type === "RAKUTEN") {
                    // TODO rakuten
                }
                if (aff.type && aff.type === "ZAZZLE") {
                    this.handleZazzleAffiliateCode($link, aff);
                }
                if (typeof aff.nofollow !== 'undefined') {
                    linkRelSetAttr($link, 'nofollow', aff.nofollow === true);
                }
                // Tell skimlinks.com to not rewrite links
                if (typeof aff.noskim !== 'undefined') {
                    linkRelSetAttr($link, 'noskim', aff.noskim === true);
                }
                // Tell viglinks.com to not rewrite links
                if (typeof aff.novig !== 'undefined') {
                    linkRelSetAttr($link, 'norewrite', aff.novig === true);
                }
            }
        }
    }

    handleAmazonAffiliateCode($link, aff, urlP) {
        let href = $link.attr('href');
        const theurl = new URL(href);
        theurl.searchParams.set('tag', aff.trackingCode);
        $link.attr('href', theurl.toString());
    }

    handleRakutenAffiliateCode($link, aff) {
        let href = $link.attr('href');
        const theurl = new URL(href);
        let afflinkbase;
        if (theurl.hostname.toLowerCase().endsWith('walmart.com')) {
            afflinkbase = "https://linksynergy.walmart.com/deeplink";
        } else {
            afflinkbase = "https://click.linksynergy.com/deeplink";
        }
        let urlenc = encodeURI(href);
        const ret = new URL(afflinkbase);
        ret.searchParams.set('id', aff.trackingCode);
        ret.searchParams.set('mid', aff.mid);
        ret.searchParams.set('murl', urlenc);
        $link.attr('href', ret.toString());
    }

    handleZazzleAffiliateCode($link, aff) {
        let href = $link.attr('href');
        const theurl = new URL(href);
        theurl.searchParams.set('rf', aff.trackingCode);
        $link.attr('href', theurl.toString());
    }
}

