const { chromium } = require("playwright");
const { sleep, convertShopifyDomainToSiteUrl } = require("../helpers");
const { googleAccount } = require("../config/index");
const { error, info } = require("../logger");
const userDataDir = `${process.cwd()}/ltap-chrome`;
let browserGlobal = null;

let isLogged = false;
exports.GoogleAutomation = class {
    constructor({ domain, headless = true }) {
        this.domain = decodeURIComponent(domain);
        this.siteUrl = convertShopifyDomainToSiteUrl(domain);
        this.headless = headless || true;
        this.email = googleAccount.email;
        this.password = googleAccount.password;
    }

    async init() {
        try {
            const browser = await chromium.launchPersistentContext(userDataDir, {
                channel: "chrome",
                headless: false,
            });
            this.browser = browser;
            browserGlobal = browser;
            this.page = await browser.newPage();
        } catch (e) {
            error(__filename, "[APP]", e?.stack);
            if (browserGlobal) {
                this.browser = browserGlobal;
                this.page = await browserGlobal.newPage();
            }
        }
    }

    async close() {
        await this.browser.close();
    }

    // GOOGLE ACCOUNT
    async login() {
        try {
            await this.page.goto("https://accounts.google.com/");
            const url = this.page.url();

            // đã login nhưng bị logout ra.
            if (url.includes("https://accounts.google.com/InteractiveLogin")) {
                // Get all cookies
                const cookies = await this.page.context().cookies();

                // Iterate through cookies and delete them
                for (const cookie of cookies) {
                    await this.page.context().clearCookies(cookie);
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
                await this.page.waitForLoadState();
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
                await this.page.waitForLoadState();
            }
            await sleep(1500);
            const pageTitle = await this.page.title();
            if (pageTitle === "Google Account") {
                console.log("===> LOGIN GOOGLE ACCOUNT SUCCESS!");
                info(__filename, this?.domain, "LOGIN GOOGLE ACCOUNT SUCCESS!")
                isLogged = true;
                return true;
            } else {
                console.log("===> LOGIN GOOGLE ACCOUNT FAILED!");
                error(__filename, this?.domain, "LOGIN GOOGLE ACCOUNT FAILED!")
                return false;
            }
        } catch (e) {
            isLogged = false;
            return false;
        }
    }

    async checkLogin() {
        try {
            await this.page.goto("https://accounts.google.com/");
            const pageTitle = await this.page.title();
            if (pageTitle === "Google Account") {
                isLogged = true;
                return true;
            }
        } catch (e) {
            console.log("Check login error: ", e);
        }
        isLogged = false;
        return false;
    }

    // GOOGLE SEARCH CONSOLE
    async removeUrlCache() {
        const url = `https://search.google.com/search-console/removals?resource_id=${encodeURIComponent(
            this.siteUrl,
        )}`;
        await this.page.goto(url);
        await this.page.waitForURL("", {
            waitUntil: "domcontentloaded",
        });

        if (isLogged === false) {
            await this.login();
            await this.page.goto(url);
            await this.page.waitForURL("", {
                waitUntil: "domcontentloaded",
            });
        }

        let buttonNewRequest = await this.page.$$(`[jscontroller="AkIrf"] > [jsname="Hf7sUe"]`);
        buttonNewRequest = buttonNewRequest[buttonNewRequest.length - 1];
        if (buttonNewRequest) {
            await buttonNewRequest.click();
            await this.page.waitForLoadState("load");
        }

        let buttonTabRemoveInCache = await this.page.$$(`[jsname="I0Fcpe"] > [jsname="AznF2e"]`);
        buttonTabRemoveInCache = buttonTabRemoveInCache[buttonTabRemoveInCache.length - 1];
        if (buttonTabRemoveInCache) {
            await buttonTabRemoveInCache.click();
            await this.page.waitForLoadState("load");
        }

        await this.page.locator("#c6").fill(`https://${this.domain}/products/`);

        const buttonYes = await this.page.$(`#riss7c > div.mpJeQc > span > label:nth-child(2)`);
        if (buttonYes) {
            await buttonYes.click();
            await this.page.waitForLoadState("load");
        }
        await sleep(1500);
        const buttonContinue = await this.page.$(
            `#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.E3hMrf.Up8vH.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.tWntE.M9Bg4d`,
        );
        if (buttonContinue) {
            await buttonContinue.click();
            await this.page.waitForLoadState("load");
        }

        await sleep(1500);
        const confirmSubmit = await this.page.$(
            `#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.Ka0n7d.Up8vH.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div:nth-child(2)`,
        );
        if (confirmSubmit) {
            await confirmSubmit.click();
            await this.page.waitForLoadState("load");
            await sleep(1500);
            info(__filename, this?.domain, "REMOVE URL CACHE SUCCESS")
        }
    }

    async getMetaTag() {
        let metaTag = "";
        try {
            if (isLogged === false) {
                await this.login();
            }
            // 1 open dashboard
            await this.page.goto(`https://search.google.com/search-console/welcome`);
            await sleep(1000);
            const popup = await this.page.$(
                `path[d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"]`,
            );

            // 2 click popup
            if (popup) {
                await popup.click();
                await this.page.waitForLoadState("load");

                // 3 click button add new resource
                const buttonAddStore = await this.page.$(`#resource-selector-container`);

                if (buttonAddStore) {
                    await buttonAddStore.click();

                    await this.page.evaluate(async (siteUrl) => {
                        const input = document.querySelector(
                            `input[type='text'][autocomplete="off"][aria-label="https://www.example.com"]`,
                        );
                        input.setAttribute("data-initial-value", siteUrl);
                        input.value = siteUrl;
                        input.focus();
                    }, this.siteUrl);

                    // click element to active button submit
                    await this.page.$(".ziL9ec.C6efae").then(async (element) => {
                        await element.click();
                        await this.page.waitForLoadState("load");
                    });

                    const buttonSubmit = await this.page.$(`.O8Dkfe .C6efae .CwaK9`);
                    if (buttonSubmit) {
                        await buttonSubmit.click();
                        await this.page.waitForLoadState("load");
                    }

                    const metaTagEle = await this.page.waitForSelector(`[jscontroller="gZjhIf"]`);
                    const val = await metaTagEle.getAttribute("data-initial-value");
                    metaTag = val;
                }
            }
        } catch (e) {
            error(__filename, this?.domain, "ERROR: " + e?.stack);
        }
        if (metaTag) {
            info(__filename, this?.domain, "Get meta tag success!");
        } else {
            error(__filename, this?.domain, "Get meta tag error!");
        }

        return metaTag;
    }

    async verifyMetaTag() {
        try {
            if (isLogged === false) {
                await this.login();
            }
            // 1. open dashboard
            await this.page.goto(`https://search.google.com/search-console`);
            await sleep(1000);
            const popup = await this.page.$(`[id="resource-selector-container"]`);

            // 2 click popup
            if (popup) {
                await popup.click();
                await this.page.waitForLoadState("load");
                await sleep(1500);
                const selectedSite = await this.page.$(
                    `div[role="option"][aria-label="${this.domain}"]`,
                );
                if (selectedSite) {
                    selectedSite.click();
                    await this.page.waitForLoadState("load");
                    await sleep(3500);

                    const selectedMetaTagOption = await this.page.$(
                        `#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.zop9tc.ccA8Dd.Up8vH.J9Nfi.iWO5td > span > c-wiz > div > div:nth-child(4) > div:nth-child(1)`,
                    );

                    if (selectedMetaTagOption) {
                        selectedMetaTagOption.click();
                        await this.page.waitForLoadState("load");
                        await sleep(300);

                        const btnConfirm = await this.page.$(`#C06PK`);
                        if (btnConfirm) {
                            await btnConfirm.click();
                            await this.page.waitForLoadState("load");
                            console.log("verify metatag success");
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
};
