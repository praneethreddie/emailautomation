const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({
        headless: false,
        args: ["--disable-gpu"]
    });

    const context = await browser.newContext({
        storageState: "gmail_state.json"
    });

    const page = await context.newPage();

    // Open Gmail
    await page.goto("https://mail.google.com");
    await page.waitForTimeout(6000);

    // --- SPAM EMAILS ---
    await page.goto("https://mail.google.com/mail/u/0/#spam");
    await page.waitForTimeout(5000);

    let spam = await page.$$("tr.zA");
    for (let i = 0; i < spam.length; i++) {
        await spam[i].click();
        await page.waitForTimeout(7000);

        const notSpam = page.locator("text=Not spam");
        if (await notSpam.count() > 0) {
            await notSpam.first().click();
            await page.waitForTimeout(4000);
        }

        await page.goto("https://mail.google.com/mail/u/0/#spam");
        await page.waitForTimeout(4000);
        spam = await page.$$("tr.zA");
    }

    // --- PROMOTION EMAILS ---
    await page.goto("https://mail.google.com/mail/u/0/#category/promotions");
    await page.waitForTimeout(5000);

    let promo = await page.$$("tr.zA");
    for (let i = 0; i < promo.length; i++) {
        await promo[i].click();
        await page.waitForTimeout(7000);

        // Move to Primary
        await page.keyboard.press("v");
        await page.waitForTimeout(800);
        await page.keyboard.type("Primary");
        await page.waitForTimeout(800);
        await page.keyboard.press("Enter");

        await page.waitForTimeout(4000);
        await page.goto("https://mail.google.com/mail/u/0/#category/promotions");
        await page.waitForTimeout(4000);

        promo = await page.$$("tr.zA");
    }

    await context.storageState({ path: "gmail_state.json" });
    await browser.close();
})();
