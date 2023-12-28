const { chromium } = require("playwright");
const config = require("../config");
const { sleep } = require("../helpers");

const { googleAccount } = config;

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
        await this.page.goto("https://accounts.google.com/");
        const url = this.page.url();

        // đã login nhưng cần xác minh lại
        if (url.includes("https://accounts.google.com/v3/signin/confirmidentifier")) {
            const btnNext = await this.page.$("#identifierNext");
            if (btnNext) await btnNext.click();

            await sleep(2000);
            // input password
            const inputPasswordField = await this.page.$("#password input");
            if (inputPasswordField) {
                await this.page.locator("#password input").fill(googleAccount.password);

                const btnNext = await this.page.$("#passwordNext > div > button");
                if (btnNext) await btnNext.click();

                if (this.page.url().includes("myaccount.google.com")) {
                    this.isLogged = true;
                }
            }
        }

        await this.close();
    }
};
