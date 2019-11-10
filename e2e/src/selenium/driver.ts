import { Builder, ThenableWebDriver, WebDriver } from 'selenium-webdriver';
import { Page } from './page';

/** The actual web driver */
let driver: ThenableWebDriver | undefined;

/**
 * Create a new Web Driver to talk to our application
 *
 * @export
 */
export async function newDriver() {
    await quit();

    driver = new Builder()
        .forBrowser('chrome')
        .build();
}

/**
 * Take a screenshot of the current web page
 *
 * @export
 * @returns the screenshot, as a Base64 encoded PNG
 */
export async function takeScreenshot() {
    if (driver) {
        return await driver.takeScreenshot();
    }
}

/**
 * Shut down the web driver
 *
 * @export
 */
export async function quit() {
    if (driver) {
        await driver.quit();
        driver = undefined;
    }
}

/**
 * Create a page model for the current browser state
 *
 * @export
 * @template T the type of page model to create
 * @param {(driver: WebDriver) => T} constructor the constructor function to use
 * @returns {T} the page model
 */
export async function createPage<T extends Page>(constructor: (driver: WebDriver) => T): Promise<T> {
    if (driver === undefined) {
        throw new Error('No WebDriver available');
    }

    const page = constructor(driver);
    await page.verifyPage();

    return page;
}
