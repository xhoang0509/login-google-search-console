const fs = require("fs");
const { chromium } = require("playwright");
const config = require("../config");

exports.GoogleSearchConsole = class {
    constructor(domain) {
        this.domain = decodeURIComponent(domain);
    }

    async init() {
        const browser = await chromium.launchPersistentContext(config.chromium.path, {
            channel: "chrome",
            headless: false,
        });
        this.browser = browser;
        this.page = await browser.newPage();
    }

    async close() {
        await this.browser.close();
    }

    async openDashboard() {
        await this.page.goto(`https://search.google.com/search-console?resource_id=${this.domain}`);
    }

    async openSiteMap() {
        await this.page.goto(`https://search.google.com/search-console/sitemaps?resource_id=${this.domain}`);
        const url = this.page.url();
        if (url.includes(`https://accounts.google.com/v3/signin/confirmidentifier`)) {
        }

        console.log(url);
    }

    async submitSiteMap() {
        await this.openSiteMap();
        await this.page
            .locator(
                `input[type="text"][jsname][autocomplete="off"][tabindex="0"][autocorrect="off"][autocapitalize="off"][spellcheck="false"]`
            )
            .fill("sitemap.xml");

        const buttonSend = await this.page.$(
            `[data-node-index='2;0'] div[role='button'][jsaction] > span[jsslot] > span[class]`
        );
        if (buttonSend) {
            await buttonSend.click();
        }
    }

    async addNewStore() {
        const writeStream = fs.createWriteStream("src/logger/auth-meta-tag.jsonl", {
            flags: "a",
        });
        // 1 open dashboard
        await this.page.goto(`https://search.google.com/search-console`);
        const popup = await this.page.$(`[id="resource-selector-container"]`);

        // 2 click popup
        if (popup) {
            await popup.click();

            // 3 click button add new resource
            const buttonAddStore = await this.page.$(
                `div[class][role='option'][jsaction^="click:"][data-site-verification][aria-selected]`
            );

            if (buttonAddStore) {
                await buttonAddStore.click();

                await this.page.evaluate(async (domainVal) => {
                    const input = document.querySelector(
                        `input[type='text'][autocomplete="off"][aria-label="https://www.example.com"]`
                    );
                    input.setAttribute("data-initial-value", domainVal);
                    input.value = domainVal;
                    input.focus();
                }, this.domain);

                // click element to active button submit
                await this.page.$(".ziL9ec.C6efae").then(async (element) => {
                    await element.click();
                });

                const buttonSubmit = await this.page.$(`.O8Dkfe .C6efae .CwaK9`);
                if (buttonSubmit) buttonSubmit.click();

                const metaTagEle = await this.page.waitForSelector(`[jscontroller="gZjhIf"]`);
                const val = await metaTagEle.getAttribute("data-initial-value");
                const log = JSON.stringify({
                    domain: this.domain,
                    metaTag: val,
                    time: new Date(),
                });
                writeStream.write(`${log}\n`);
                writeStream.end();
            }
        }
    }

    async authStoreAfterPublishHead() {
        const domain = `https://dev-xuan-d-ng-store.myshopify.com/`;
        await this.page.goto(`https://search.google.com/search-console`);
        // 1 open dashboard
        const popup = await this.page.$(`[id="resource-selector-container"]`);

        // 2 click popup
        if (popup) {
            await popup.click();
        }

        const allStoreElements = await this.page.$$(".MkjOTb.oKubKe.zpVKtf");
        for (const ele of allStoreElements) {
            const storeDomain = await ele.textContent();
            if (storeDomain === domain) {
                await ele.click();
            }
        }

        const buttonSubmit = await this.page.locator("#TZk80d");
        await buttonSubmit.waitFor({ state: "visible" });
        await buttonSubmit.click();
    }

    async removeUrlCache() {
        const url = `https://search.google.com/search-console/removals?resource_id=${encodeURIComponent(this.domain)}`;
        await this.page.goto(url);

        let buttonNewRequest = await this.page.$$(`[jscontroller="AkIrf"] > [jsname="Hf7sUe"]`);
        buttonNewRequest = buttonNewRequest[buttonNewRequest.length - 1];
        if (buttonNewRequest) await buttonNewRequest.click();

        let buttonTabRemoveInCache = await this.page.$$(`[jsname="I0Fcpe"] > [jsname="AznF2e"]`);
        buttonTabRemoveInCache = buttonTabRemoveInCache[buttonTabRemoveInCache.length - 1];
        if (buttonTabRemoveInCache) await buttonTabRemoveInCache.click();

        await this.page.locator("#c6").fill(`${this.domain}/products/`);

        const buttonYes = await this.page.$(`#riss7c > div.mpJeQc > span > label:nth-child(2)`);
        if (buttonYes) await buttonYes.click();
        await new Promise((res) => setTimeout(res, 1000));
        const buttonContinue = await this.page.$(
            `#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.E3hMrf.Up8vH.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.tWntE.M9Bg4d`
        );
        if (buttonContinue) await buttonContinue.click();

        await new Promise((res) => setTimeout(res, 1000));
        const confirmSubmit = await this.page.$(
            `#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.Ka0n7d.Up8vH.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div:nth-child(2)`
        );
        if (confirmSubmit) await confirmSubmit.click();
    }
};
