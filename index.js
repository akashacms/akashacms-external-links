/**
 *
 * Copyright 2015 David Herron
 * 
 * This file is part of AkashaCMS-external-links (http://akashacms.com/).
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

var util     = require('util');
var url      = require('url');
var async    = require('async');

/*
 * TODO
 *
 * 1. Pull in rel=nofollow from wherever it currently resides
 * 2. Support marker icon - before/after
 * 3. Support favicon - before/after
 * 4. Manipulate Amazon links to add affiliate tag
 * 5. Manipulate eBay links to add affiliate tag
 * 6. Manipulate Linkshare links with affiliate coding
 * 7. Ensure all affiliate links get rel=nofollow
 * 8. Support adding rel=noskim
 *
 */


var logger;
var akasha;
var config;

/**
 * Add ourselves to the config data.
 **/
module.exports.config = function(_akasha, _config) {
	akasha = _akasha;
	config = _config;
	logger = akasha.getLogger("external-links");
    // config.root_partials.push(path.join(__dirname, 'partials'));
    // config.root_assets.unshift(path.join(__dirname, 'assets'));
    
    if (config.externalLinks) {
        // TODO
    }

	return module.exports;
};
