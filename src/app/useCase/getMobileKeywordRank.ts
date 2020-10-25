import webdriver, {WebDriver} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import {ApplicationError, ApplicationErrorKind} from "Error/ApplicationError";
import fs from 'fs';
import {sleep} from "utils/time";

const By = webdriver.By;

type GetRankConfig = {
    maxPage: number,
}
export const getMobileKeywordRank = (config: GetRankConfig) => (website: string) => async (term: string) => {

    let builder = new webdriver.Builder()
        .withCapabilities({
            browserName: 'chrome',
            'goog:chromeOptions': {
                mobileEmulation: {
                    deviceName: 'iPhone 6 Plus'
                }
            }
        });

    if (process.env.SELENIUM_HUB_HOST) {
        builder = builder.usingServer(`http://${process.env.SELENIUM_HUB_HOST}:4444/wd/hub`)
    }

    const driver = builder.build();

    let page = 0;
    await driver.get(`https://www.google.com/search?q=${encodeURI(term.replace(/ /g, '+'))}`);

    try {
        while (page < config.maxPage) {
            const elements = await driver.findElements(By.xpath("//div[contains(@class, 'xpd')]"))

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];
                const anchors = await elem.findElements(By.xpath(`.//a[contains(@href, '${website}')]`));
                if (anchors.length > 0) {
                    // await driver.executeScript("arguments[0].setAttribute('style', 'font-weight:bold; background-color:#a8ffff')", elem)
                    await driver.quit();
                    return (i + 1);
                }
            }

            const nextPageButton = await driver.findElement(By.xpath("//div[contains(@class, 'GNJvt ipz2Oe')]"));
            if (!nextPageButton) {
                throw new ApplicationError({
                    kind: ApplicationErrorKind.NextPageElemNotFound,
                })
            }
            await nextPageButton.click();
            await sleep(2);

            page++;
        }

        await driver.quit();
    } catch (e) {
        await takeScreenshotAndQuit(driver);
        throw e;
    }
};

const takeScreenshotAndQuit = async (driver: WebDriver) => {
    const base64Screenshot = await driver.takeScreenshot();
    fs.writeFile("out.png", base64Screenshot, 'base64', function (err) {
        console.log(err);
    });
    await driver.quit();
};