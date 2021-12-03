
const processor = require('../mahafuncs');
const { assert } = require('chai');
const cheerio = require('cheerio');

const config_no_follow_all = {
    preferNofollow: true
};

const config_no_follow_all_whitelist_good = {
    preferNofollow: true,
    whitelist: [
        /somewhere.good$/i
    ]
};

const config_no_follow_none_blacklist_bad = {
    preferNofollow: false,
    blacklist: [
        /somewhere.bad$/i
    ]
};

const config_no_follow_none_blacklist_bad_target_blank = {
    preferNofollow: false,
    blacklist: [
        /somewhere.bad$/i
    ],
    targetBlank: true
};

const config_no_follow_none_blacklist_bad_target_blank_favicon_before_icon_after = {
    preferNofollow: false,
    blacklist: [
        /somewhere.bad$/i
    ],
    targetBlank: true,
    showFavicons: "before",
    showIcon: "after"
};

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
        }
    ]
};

const config_amazon_com_ca_co_uk_fr_de = {
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


const config_rakuten = {
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
            domain: "rakuten.foo",
            type: "RAKUTEN",
            trackingCode: "rakutenTrackingFoo",
            mid: "rakutenMIDfoo",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "rakuten.walmart.com",
            type: "RAKUTEN",
            trackingCode: "rakutenTrackingWalmart",
            mid: "rakutenMIDwalmart",
            nofollow: true,
            noskim: true,
            novig: true
        }
    ]
};

const config_zazzle = {
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
            domain: "zazzle.com",
            type: "ZAZZLE",
            trackingCode: "zazzleCode",
            nofollow: true,
            noskim: true,
            novig: true
        }
    ]
};


const html_good_bad = `
<html>
<body>
    <a id="bad" href="http://somewhere.bad">Some bad text</a>
    <a id="good" href="http://somewhere.good">Some good text</a>
</body>
</html>
`;

const html_affiliates = `
<html>
<body>
    <p><a id="amazon_com" href="http://amazon.com/to/some/product">product name</a></p>
    <p><a id="amazon_ca" href="http://amazon.ca/to/some/product">product name</a></p>
    <p><a id="amazon_co_uk" href="http://amazon.co.uk/to/some/product">product name</a></p>
    <p><a id="amazon_fr" href="http://amazon.fr/to/some/product">product name</a></p>
    <p><a id="amazon_de" href="http://amazon.de/to/some/product">product name</a></p>
    <p>
    <a id="rakuten_foo" href="http://rakuten.foo/some/where">product name</a>
    </p>
    <p>
    <a id="rakuten_walmart" href="http://rakuten.walmart.com/some/where">product name</a>
    </p>
    <p>
    <a id="zazzle" href="http://zazzle.com/some/where">product name</a>
    </p>
</body>
</html>
`;

describe("External Links test", function() {
    describe("check no follow", function() {
        it("should set nofollow on all links", async function() {
            let result = await processor.process(html_good_bad, {}, config_no_follow_all);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');
            assert.exists($('#good').attr('rel'), 'good rel exists');
            assert.isString($('#good').attr('rel'), 'good rel isString');
            assert.include($('#good').attr('rel'), 'nofollow', 'good rel has nofollow');
        });
        it("should set nofollow all links except good ones", async function() {
            let result = await processor.process(html_good_bad, {}, config_no_follow_all_whitelist_good);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');
            assert.notExists($('#good').attr('rel'), 'good rel exists');
            assert.isNotString($('#good').attr('rel'), 'good rel isString');
        });
        it("should set nofollow only bad links", async function() {
            let result = await processor.process(html_good_bad, {}, config_no_follow_none_blacklist_bad);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');
            assert.notExists($('#good').attr('rel'), 'good rel exists');
            assert.isNotString($('#good').attr('rel'), 'good rel isString');
        });
    });
    describe('check target blank', function() {
        it("should set target=_blank", async function() {
            let result = await processor.process(html_good_bad, {}, 
                        config_no_follow_none_blacklist_bad_target_blank);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');

            assert.exists($('#bad').attr('target'), 'bad target exists');
            assert.isString($('#bad').attr('target'), 'bad target isString');
            assert.include($('#bad').attr('target'), '_blank', 'bad target has _blank');

            assert.notExists($('#good').attr('rel'), 'good rel exists');
            assert.isNotString($('#good').attr('rel'), 'good rel isString');

            assert.exists($('#good').attr('target'), 'bad target exists');
            assert.isString($('#good').attr('target'), 'bad target isString');
            assert.include($('#good').attr('target'), '_blank', 'bad target has _blank');
        });
    });
    describe('check favicons and image', function() {
        it("should not show favicons nor image", async function() {
            let result = await processor.process(html_good_bad, {}, 
                        config_no_follow_none_blacklist_bad_target_blank);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');

            assert.exists($('#bad').attr('target'), 'bad target exists');
            assert.isString($('#bad').attr('target'), 'bad target isString');
            assert.include($('#bad').attr('target'), '_blank', 'bad target has _blank');

            assert.notExists($('#good').attr('rel'), 'good rel exists');
            assert.isNotString($('#good').attr('rel'), 'good rel isString');

            assert.exists($('#good').attr('target'), 'bad target exists');
            assert.isString($('#good').attr('target'), 'bad target isString');
            assert.include($('#good').attr('target'), '_blank', 'bad target has _blank');
        });
        it("should not show favicons before, image after", async function() {
            let result = await processor.process(html_good_bad, {}, 
                config_no_follow_none_blacklist_bad_target_blank_favicon_before_icon_after);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#bad').attr('rel'), 'bad rel exists');
            assert.isString($('#bad').attr('rel'), 'bad rel isString');
            assert.include($('#bad').attr('rel'), 'nofollow', 'bad rel has nofollow');

            assert.exists($('#bad').attr('target'), 'bad target exists');
            assert.isString($('#bad').attr('target'), 'bad target isString');
            assert.include($('#bad').attr('target'), '_blank', 'bad target has _blank');

            assert.notExists($('#good').attr('rel'), 'good rel exists');
            assert.isNotString($('#good').attr('rel'), 'good rel isString');

            assert.exists($('#good').attr('target'), 'good target exists');
            assert.isString($('#good').attr('target'), 'good target isString');
            assert.include($('#good').attr('target'), '_blank', 'good target has _blank');
        });
    });
    describe('check amazon affiliate links', function() {
        it("should set amazon.com affiliate code", async function() {
            let result = await processor.process(html_affiliates, {}, 
                config_amazon_com);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
            assert.exists($('#amazon_com').attr('href'), 'amazon_com href exists');
            assert.include($('#amazon_com').attr('href'), 'tag=foobar-20', 'amazon_com href has tag=foobar-20');

            assert.exists($('#amazon_com').attr('target'), 'amazon_com target exists');
            assert.include($('#amazon_com').attr('target'), '_blank', 'amazon_com target has _blank');

            assert.exists($('#amazon_com').attr('rel'), 'amazon_com rel exists');
            assert.isString($('#amazon_com').attr('rel'), 'amazon_com rel isString');
            assert.include($('#amazon_com').attr('rel'), 'nofollow', 'amazon_com rel has nofollow');
            assert.include($('#amazon_com').attr('rel'), 'noskim', 'amazon_com rel has noskim');
            assert.include($('#amazon_com').attr('rel'), 'norewrite', 'amazon_com rel has norewrite');

            assert.exists($('#amazon_ca').attr('href'), 'amazon_ca href exists');
            assert.notInclude($('#amazon_ca').attr('href'), 'tag=foobar-20', 'amazon_ca href has tag=foobar-20');

            assert.exists($('#amazon_ca').attr('target'), 'amazon_ca target exists');
            assert.include($('#amazon_ca').attr('target'), '_blank', 'amazon_ca target has _blank');

            assert.notExists($('#amazon_ca').attr('rel'), 'amazon_ca rel exists');

            assert.exists($('#amazon_co_uk').attr('href'), 'amazon_co_uk href exists');
            assert.notInclude($('#amazon_co_uk').attr('href'), 'tag=foobar-20', 'amazon_co_uk href has tag=foobar-20');

            assert.exists($('#amazon_co_uk').attr('target'), 'amazon_co_uk target exists');
            assert.include($('#amazon_co_uk').attr('target'), '_blank', 'amazon_co_uk target has _blank');

            assert.notExists($('#amazon_co_uk').attr('rel'), 'amazon_co_uk rel exists');

            assert.exists($('#amazon_fr').attr('href'), 'amazon_fr href exists');
            assert.notInclude($('#amazon_fr').attr('href'), 'tag=foobar-20', 'amazon_fr href has tag=foobar-20');

            assert.exists($('#amazon_fr').attr('target'), 'amazon_fr target exists');
            assert.include($('#amazon_fr').attr('target'), '_blank', 'amazon_fr target has _blank');

            assert.notExists($('#amazon_fr').attr('rel'), 'amazon_fr rel exists');

            assert.exists($('#amazon_de').attr('href'), 'amazon_de href exists');
            assert.notInclude($('#amazon_de').attr('href'), 'tag=foobar-20', 'amazon_de href has tag=foobar-20');

            assert.exists($('#amazon_de').attr('target'), 'amazon_de target exists');
            assert.include($('#amazon_de').attr('target'), '_blank', 'amazon_de target has _blank');

            assert.notExists($('#amazon_de').attr('rel'), 'amazon_de rel exists');
        });
        it("should set amazon.com/ca/co.uk/fr/de affiliate code", async function() {
            let result = await processor.process(html_affiliates, {}, 
                config_amazon_com_ca_co_uk_fr_de);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
        });
        it("should set rakuten affiliate code", async function() {
            let result = await processor.process(html_affiliates, {}, 
                config_rakuten);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
        });
        it("should set Zazzle affiliate code", async function() {
            let result = await processor.process(html_affiliates, {}, 
                config_zazzle);
            // console.log(result);
            assert.exists(result, 'result exists');
            assert.isString(result, 'result isString');
            let $ = cheerio.load(result);
        });
    });
});