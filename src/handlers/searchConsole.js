const fs = require("fs");
exports.GoogleSearchConsole = class {
    constructor(domain, page) {
        this.domain = decodeURIComponent(domain);
        this.page = page;
    }

    async openDashboard() {
        await this.page.goto(`https://search.google.com/search-console?resource_id=${this.domain}`);
    }

    async openSiteMap() {
        await this.page.goto(`https://search.google.com/search-console/sitemaps?resource_id=${this.domain}`);
    }

    async submitSiteMap() {
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

                await this.page.evaluate(async () => {
                    const input = document.querySelector(
                        `input[type='text'][autocomplete="off"][aria-label="https://www.example.com"]`
                    );
                    input.setAttribute("data-initial-value", `https://dev-hoang-nx-2.myshopify.com`);
                    input.value = `https://dev-hoang-nx-2.myshopify.com`;
                    input.focus();
                });

                // click element to active button submit
                await this.page.$(".ziL9ec.C6efae").then(async (element) => {
                    await element.click();
                });

                const buttonSubmit = await this.page.$(`.O8Dkfe .C6efae .CwaK9`);
                if (buttonSubmit) buttonSubmit.click();

                const metaTagEle = await this.page.waitForSelector(`[jscontroller="gZjhIf"]`);
                const val = await metaTagEle.getAttribute("data-initial-value");
                const log = JSON.stringify({
                    domain: `https://dev-hoang-nx-2.myshopify.com`,
                    metaTag: val,
                    time: new Date(),
                });
                writeStream.write(`${log}\n`);
                writeStream.end();
            }
        }
    }
};
