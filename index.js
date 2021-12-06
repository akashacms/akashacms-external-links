
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

const url      = require('url');
const path     = require('path');
const util     = require('util');
const akasha   = require('akasharender');
const elp_funcs = require('./mahafuncs');

const pluginName = "@akashacms/plugin-external-links";

const _plugin_options = Symbol('options');

module.exports = class ExternalLinksPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        config.addAssetsDir(path.join(__dirname, 'assets'));
        this[_plugin_options] = options;
        if (!this.options.blacklist) this.options.blacklist = [];
        if (!this.options.whitelist) this.options.whitelist = [];
        if (!this.options.preferNofollow) this.options.preferNofollow = false;
        if (!this.options.targetBlank) this.options.targetBlank = false;
        if (!this.array.options.showFavicons) this.array.options.showFavicons = "nowhere";
        if (!this.array.options.showIcon) this.array.options.showIcon = "nowhere";
        config.addMahabhuta(elp_funcs.mahabhutaArray(this[_plugin_options]));
        return this;
    }

    get options() { return this[_plugin_options]; }

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
