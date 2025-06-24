
/**
 *
 * Copyright 2017, 2018, 2019 David Herron
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

import path from 'node:path';
import util from 'node:util';
import akasha from 'akasharender';
import * as elp_funcs from './mahafuncs.mjs';

const __dirname = import.meta.dirname;

const pluginName = "@akashacms/plugins-external-links";

export class ExternalLinksPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    #config;

    configure(config, options) {
        config.addAssetsDir(path.join(__dirname, 'assets'));
        this.#config = config;
        // this.config = config;
        this.akasha = config.akasha;
        this.options = options ? options : {};
        this.options.config = config;
        if (!this.options.blacklist) this.options.blacklist = [];
        if (!this.options.whitelist) this.options.whitelist = [];
        if (!this.options.preferNofollow) this.options.preferNofollow = false;
        if (!this.options.targetBlank) this.options.targetBlank = false;
        if (!this.options.showFavicons) this.options.showFavicons = "nowhere";
        if (!this.options.showIcon) this.options.showIcon = "nowhere";
        config.addMahabhuta(elp_funcs.mahabhutaArray(this.options, this.config, this.akasha, this));
        return this;
    }

    get config() { return this.#config; }

    setPreferNofollow(config, nofollow) {
        this.options.preferNofollow = nofollow;
        return this;
    }

    addBlacklistEntry(config, entry) {
        this.options.blacklist.push(entry);
        return this;
    }

    addWhitelistEntry(config, entry) {
        this.options.whitelist.push(entry);
        return this;
    }

    setTargetBlank(config, blank) {
        this.options.targetBlank = blank;
        return this;
    }

    setShowFavicons(config, showspec) {
        this.options.showFavicons = showspec;
        return this;
    }

    setShowIcon(config, showspec) {
        this.options.showIcon = showspec;
        return this;
    }

    setExternalLinkIcon(config, iconurl) {
        this.options.externalLinkIcon = iconurl;
        return this;
    }

};
