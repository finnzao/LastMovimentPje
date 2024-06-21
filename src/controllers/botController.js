import { initializeDriver, login, skipToken, selectProfile, searchProcess, collectProcessNumbers } from '../services/botService.js';
import { saveToExcel } from '../services/excelService.js';
import { searchOptions } from '../config/config.js';

async function main() {
    const { driver, wait } = await initializeDriver();
    const user = process.env.USER;
    const password = process.env.PASSWORD;
    const profile = process.env.PROFILE;

    try {
        await login(driver, wait, user, password);
        //await skipToken(driver, wait);
        await selectProfile(driver, wait, profile);
        await searchProcess(driver, wait, searchOptions.classeJudicial, searchOptions.nomeParte);
        // const processNumbers = await collectProcessNumbers(driver, wait);
        // await saveToExcel(processNumbers);
    } catch (error) {
        console.error('Error in main function:', error);
    } finally {
        await driver.quit();
    }
}

export { main };