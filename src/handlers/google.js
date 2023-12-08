exports.login = async ({ page }) => {
    await page.goto("https://accounts.google.com/");
    await page.locator(`input[type="email"]`).fill("hoangnx1@bsscommerce.com");
    let buttonsNext = await page.$$(`button[jscontroller][jsaction][jsname][data-idom-class] > span[jsname]`);
    if (buttonsNext && buttonsNext.length) {
        for (const button of buttonsNext) {
            const contentBtn = await button.innerText();
            if (contentBtn.length > 0) {
                await button.click();
            }
        }
    }
    await page.locator(`input[type="password"]`).fill("Xuanhoang0509");
    buttonsNext = await page.$$(`button[jscontroller][jsaction][jsname][data-idom-class] > span[jsname]`);
    if (buttonsNext && buttonsNext.length) {
        for (const button of buttonsNext) {
            const contentBtn = await button.innerText();
            if (contentBtn.length > 0) {
                await button.click();
            }
        }
    }
};

exports.checkLogged = async ({ page }) => {};
