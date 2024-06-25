import { Builder, By, until } from 'selenium-webdriver';

async function login(driver, wait, user, password) {
    const loginUrl = 'https://pje.tjba.jus.br/pje/login.seam';
    await driver.get(loginUrl);
    
    // Espera até que o frame esteja disponível e muda para ele
    await wait.until(until.ableToSwitchToFrame(By.id('ssoFrame')));
    
    // Localiza os elementos de login dentro do frame
    const usernameInput = await wait.until(until.elementLocated(By.id('username')));
    const passwordInput = await wait.until(until.elementLocated(By.id('password')));
    const loginButton = await wait.until(until.elementLocated(By.id('kc-login')));
    
    // Preenche os campos de login e clica no botão de login
    await usernameInput.sendKeys(user);
    await passwordInput.sendKeys(password);
    await loginButton.click();
    
    // Volta para o frame original da página
    await driver.switchTo().defaultContent();
}

// Exemplo de uso
(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();
    let wait = driver.wait.bind(driver);
    try {
        await login(driver, '04494330566', '@449433a');
        //await skipToken(driver);
    } finally {
        await driver.quit();
    }
})();