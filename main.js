import { Builder, By, until } from 'selenium-webdriver';
let driver = await new Builder().forBrowser('chrome').build();


async function login(driver, user, password) {
    const loginUrl = 'https://pje.tjba.jus.br/pje/login.seam';
    await driver.get(loginUrl);

    // Espera até que o frame esteja disponível e mude para ele
    await driver.wait(until.ableToSwitchToFrame(By.id('ssoFrame')), 10000);

    // Localiza os elementos de entrada de usuário e senha
    const usernameInput = await driver.wait(until.elementLocated(By.id('username')), 10000);
    const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 10000);
    const loginButton = await driver.wait(until.elementLocated(By.id('kc-login')), 10000);

    // Envia as credenciais
    await usernameInput.sendKeys(user);
    await passwordInput.sendKeys(password);

    // Clica no botão de login
    await loginButton.click();

    // Volta para o conteúdo padrão
    await driver.switchTo().defaultContent();
}



// Exemplo de uso
(async function main() {
    try {
        await login(driver, '04494330566', '@449433a');
        //await skipToken(driver);
    } finally {
        await driver.quit();
    }
})();