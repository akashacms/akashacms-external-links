
/**
 *
 * Copyright 2017 David Herron
 *
 * This file is part of AkashaCMS-extlinks (http://akashacms.com/).
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use strict';

const url      = require('url');
const path     = require('path');
const util     = require('util');
const co       = require('co');
const akasha   = require('akasharender');
const mahabhuta = require('mahabhuta');

const log   = require('debug')('akasha:extlinks-plugin');
const error = require('debug')('akasha:error-extlinks-plugin');

const pluginName = "akashacms-external-links";

module.exports = class ExternalLinksPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config) {
        // this._config = config;
        config.addAssetsDir(path.join(__dirname, 'assets'));
        config.addMahabhuta(module.exports.mahabhuta);

        config.pluginData(pluginName).blacklist = [];
        config.pluginData(pluginName).whitelist = [];
        config.pluginData(pluginName).preferNofollow = true;
        config.pluginData(pluginName).targetBlank = false;
        return this;
    }

    setPreferNofollow(config, nofollow) {
        config.pluginData(pluginName).preferNofollow = nofollow;
        return this;
    }

    addBlacklistEntry(config, entry) {
        config.pluginData(pluginName).blacklist.push(entry);
        return this;
    }

    addWhitelistEntry(config, entry) {
        config.pluginData(pluginName).whitelist.push(entry);
        return this;
    }

    setTargetBlank(config, blank) {
        config.pluginData(pluginName).targetBlank = blank;
        return this;
    }
};

/*
 * TODO
 *
 * 1. Pull in rel=nofollow from wherever it currently resides
 * 2. Support marker icon - before/after
 * 3. Support favicon - before/after
 *
 * These go into akashacms-affiliates:
 *
 * 4. Manipulate Amazon links to add affiliate tag
 * 5. Manipulate eBay links to add affiliate tag
 * 6. Manipulate Linkshare links with affiliate coding
 * 7. Ensure all affiliate links get rel=nofollow
 * 8. Support adding rel=noskim
 *
 */

module.exports.mahabhuta = new mahabhuta.MahafuncArray("akashacms-extlinks", {});

class ExternalLinkMunger extends mahabhuta.Munger {
    get selector() { return "html body a"; }

    process($, $link, metadata, dirty, done) {
        var href     = $link.attr('href');
        var rel      = $link.attr('rel');

        if (!href) return Promise.resolve("");

        // We only act on the link if it is external -- has a PROTOCOL and HOST
        const urlP = url.parse(href, true, true);
        if (urlP.protocol || urlP.host) {

            var donofollow = metadata.config.pluginData(pluginName).preferNofollow;

            metadata.config.pluginData(pluginName).blacklist.forEach(function(re) {
                if (urlP.hostname.match(re)) {
                    donofollow = true;
                }
            });
            metadata.config.pluginData(pluginName).whitelist.forEach(function(re) {
                if (urlP.hostname.match(re)) {
                    donofollow = false;
                }
            });

            if (donofollow) {
                let linkrel = $link.attr('rel');
                let rels = linkrel ? linkrel.split(' ') : [];
                let hasnofollow = false;
                for (let rel of rels) {
                    if (rel === 'nofollow') {
                        hasnofollow = true;
                    }
                }
                if (!hasnofollow) {
                    if (linkrel && linkrel.length > 0) {
                        linkrel = "nofollow "+linkrel;
                    } else {
                        linkrel = "nofollow";
                    }
                    $link.attr('rel', linkrel);
                }
                // console.log(`akashacms-external-links link ${href} now has rel=${$link.attr('rel')}`);
            }

            if (metadata.config.pluginData(pluginName).targetBlank) {
                $link.attr('target', '_blank');
            }


// TODO  2. Check if an extlink icon is present, if not insert it (if textual link)

        }

        return Promise.resolve("");
    }
}
module.exports.mahabhuta.addMahafunc(new ExternalLinkMunger());


/* TODO
if (! metadata.config.builtin.suppress.extlink
 && $(link).find("img.ak-extlink-icon").length <= 0) {
    $(link).append('<img class="ak-extlink-icon" src="/img/extlink.png"/>');
} */
