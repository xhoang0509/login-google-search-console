const { chromium } = require("playwright");
const config = require("../config");
const { sleep } = require("../helpers");

exports.GoogleAccount = class {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.isLogged = false;
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

    async login() {
        try {
            await this.page.goto("https://accounts.google.com/");
            const url = this.page.url();

            // đã login nhưng bị logout ra rồi.
            if (url.includes("https://accounts.google.com/InteractiveLogin")) {
                // Get all cookies
                const cookies = await this.page.context().cookies();

                // Iterate through cookies and delete them
                for (const cookie of cookies) {
                    await this.page.context().clearCookies(cookie);
                    console.log(`Deleted cookie: ${cookie.name}`);
                }
                await this.page.reload();
            }

            // step 1: input email
            const inputEmailField = await this.page.$("#identifierId");
            if (inputEmailField) {
                await this.page.locator("#identifierId").fill(this.email);
            }
            // step 2: click btn email next
            let btnEmailNext = await this.page.$("#identifierNext");
            if (btnEmailNext) {
                await btnEmailNext.click();
            }

            // step 3: input password
            const inputPasswordField = await this.page.$("input[type='password']");
            if (inputPasswordField) {
                await this.page.locator("input[type='password']").fill(this.password);
            }

            // step 4: click btn password next
            const btnPasswordNext = await this.page.$("#passwordNext");
            if (btnPasswordNext) {
                await btnPasswordNext.click();
            }
            return true;
        } catch (e) {

            return false;
        }
    }
};
