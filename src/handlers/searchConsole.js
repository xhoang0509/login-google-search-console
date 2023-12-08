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
        await this.page.goto(`https://search.google.com/search-console`);
        
    }
};
