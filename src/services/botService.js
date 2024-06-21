import pkg from 'selenium-webdriver';
const { Builder, By, until, Select } = pkg;

async function initializeDriver() {
    const driver = await new Builder().forBrowser('chrome').build();
    return { driver, wait: driver.wait.bind(driver) };
}

async function login(driver, wait, user, password) {
    const loginUrl = 'https://pje.tjba.jus.br/pje/login.seam';
    await driver.get(loginUrl);
    await wait(until.ableToSwitchToFrame(By.id('ssoFrame')));
    const usernameInput = await wait(until.elementLocated(By.id('username')));
    const passwordInput = await wait(until.elementLocated(By.id('password')));
    const loginButton = await wait(until.elementLocated(By.id('kc-login')));
    await usernameInput.sendKeys(user);
    await passwordInput.sendKeys(password);
    await loginButton.click();
    await driver.switchTo().defaultContent();
}

async function skipToken(driver, wait) {
    const proceedButton = await wait(until.elementLocated(By.className('dropdown-toggle')));
    await proceedButton.click();
}

async function selectProfile(driver, wait, profile) {
    const dropdown = await wait(until.elementLocated(By.className('dropdown-toggle')));
    await dropdown.click();
    // Localiza todos os links dentro da tabela de perfis
    const profileLinks = await driver.findElements(By.css('#papeisUsuarioForm\\:dtPerfil\\:tb a'));

    // Itera sobre todos os links encontrados
    for (let link of profileLinks) {
        const linkText = await link.getText();

        // Verifica se o texto do link contém o texto do perfil desejado
        if (linkText.includes(profile)) {
            await link.click();
        }
    }
}

async function searchProcess(driver, wait, classeJudicial = '', nomeParte = '', numOrgaoJustica = '0216', numeroOAB = '', estadoOAB = '') {
    await wait(until.ableToSwitchToFrame(By.id('ngFrame')));

    const iconSearchButton = await wait(until.elementLocated(By.css('li#liConsultaProcessual i.fas')));
    await iconSearchButton.click();

    await wait(until.ableToSwitchToFrame(By.id('frameConsultaProcessual')));

    const elementoNumOrgaoJustica = await wait(until.elementLocated(By.id('fPP:numeroProcesso:NumeroOrgaoJustica')));
    await elementoNumOrgaoJustica.sendKeys(numOrgaoJustica);

    if (estadoOAB) {
        const elementoNumeroOAB = await wait(until.elementLocated(By.id('fPP:decorationDados:numeroOAB')));
        await elementoNumeroOAB.sendKeys(numeroOAB);

        const elementoEstadosOAB = await wait(until.elementLocated(By.id('fPP:decorationDados:ufOABCombo')));
        const listaEstadosOAB = new Select(elementoEstadosOAB);
        await listaEstadosOAB.selectByValue(estadoOAB);
    }

    const consultaClasse = await wait(until.elementLocated(By.id('fPP:j_id245:classeJudicial')));
    await consultaClasse.sendKeys(classeJudicial);

    const elementoNomeDaParte = await wait(until.elementLocated(By.id('fPP:j_id150:nomeParte')));
    await elementoNomeDaParte.sendKeys(nomeParte);

    const btnProcurarProcesso = await wait(until.elementLocated(By.id('fPP:searchProcessos')));
    await btnProcurarProcesso.click();
}

async function collectProcessNumbers(driver, wait) {
    const processNumbers = [];
    const processElements = await wait(until.elementsLocated(By.css('.process-number')));
    for (let element of processElements) {
        const processNumber = await element.getText();
        processNumbers.push(processNumber);
    }
    return processNumbers;
}

export {
    initializeDriver,
    login,
    skipToken,
    selectProfile,
    searchProcess,
    collectProcessNumbers
};