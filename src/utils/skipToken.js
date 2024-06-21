async function skipToken(driver) {
    try {
        const proceedButton = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'Prosseguir sem o Token')]")),
            10000 
        );

        await driver.wait(until.elementIsVisible(proceedButton), 10000);

        await proceedButton.click();
    } catch (error) {
        console.error('Error while trying to skip token:', error);
    }
}


export default {
    skipToken
}