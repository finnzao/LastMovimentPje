import { Builder, By, until, Select, WebDriver } from 'selenium-webdriver';
import 'dotenv/config'

async function initializeDriver() {
    const driver = await new Builder().forBrowser('chrome').build();
    const wait = new driver.wait(20000);
    return { driver, wait };
}

async function login(driver, wait, user, password) {
    const loginUrl = 'https://pje.tjba.jus.br/pje/login.seam';
    await driver.get(loginUrl);
    await wait.until(until.ableToSwitchToFrame(By.id('ssoFrame')));
    const usernameInput = await wait.until(until.elementLocated(By.id('username')));
    const passwordInput = await wait.until(until.elementLocated(By.id('password')));
    const loginButton = await wait.until(until.elementLocated(By.id('kc-login')));
    await usernameInput.sendKeys(user);
    await passwordInput.sendKeys(password);
    await loginButton.click();
    await driver.switchTo().defaultContent();
}

async function skipToken(driver, wait) {
    const proceedButton = await wait.until(
        until.elementLocated(By.xpath("//a[contains(text(),'Prosseguir sem o Token')]"))
    );
    await proceedButton.click();
}

async function selectProfile(driver, wait, profile) {
    const dropdown = await wait.until(until.elementLocated(By.className('dropdown-toggle')));
    await dropdown.click();
    const buttonXPath = `//a[contains(text(), '${profile}')]`;
    const desiredButton = await wait.until(until.elementLocated(By.xpath(buttonXPath)));
    await desiredButton.click();
}

async function searchProcess(driver, wait, classeJudicial = '', nomeParte = '', numOrgaoJustica = '0216', numeroOAB = '', estadoOAB = '') {
    await wait.until(until.ableToSwitchToFrame(By.id('ngFrame')));
    const iconSearchButton = await wait.until(until.elementLocated(By.css('li#liConsultaProcessual i.fas')));
    await iconSearchButton.click();
    await wait.until(until.ableToSwitchToFrame(By.id('frameConsultaProcessual')));

    const ElementoNumOrgaoJutica = await wait.until(until.elementLocated(By.id('fPP:numeroProcesso:NumeroOrgaoJustica')));
    await ElementoNumOrgaoJutica.sendKeys(numOrgaoJustica);

    if (estadoOAB) {
        const ElementoNumeroOAB = await wait.until(until.elementLocated(By.id('fPP:decorationDados:numeroOAB')));
        await ElementoNumeroOAB.sendKeys(numeroOAB);
        const ElementoEstadosOAB = await wait.until(until.elementLocated(By.id('fPP:decorationDados:ufOABCombo')));
        const listaEstadosOAB = new Select(ElementoEstadosOAB);
        await listaEstadosOAB.selectByValue(estadoOAB);
    }

    const consulta_classe = await wait.until(until.elementLocated(By.id('fPP:j_id245:classeJudicial')));
    await consulta_classe.sendKeys(classeJudicial);

    const ElementonomeDaParte = await wait.until(until.elementLocated(By.id('fPP:j_id150:nomeParte')));
    await ElementonomeDaParte.sendKeys(nomeParte);

    const btnProcurarProcesso = await wait.until(until.elementLocated(By.id('fPP:searchProcessos')));
    await btnProcurarProcesso.click();
}

async function collectProcessNumbers(driver, wait) {
    await wait.until(until.elementLocated(By.id('fPP:processosTable:tb')));
    const numProcessos = new Set();

    while (true) {
        await wait.until(until.elementsLocated(By.css("a.btn-link.btn-condensed")));

        const links_dos_processos = await driver.findElements(By.css("a.btn-link.btn-condensed"));
        for (const link of links_dos_processos) {
            const numero_do_processo = await link.getAttribute('title');
            numProcessos.add(numero_do_processo);
        }

        try {
            await wait.until(until.invisibilityOfElementLocated(By.id('j_id136:modalStatusCDiv')));
            const next_page_button = await wait.until(until.elementLocated(By.xpath("//td[contains(@onclick, 'next')]")));
            await next_page_button.click();
        } catch (error) {
            console.log("Fim da pagina");
            break;
        }
    }

    return Array.from(numProcessos);
}

export {
    initializeDriver,
    login,
    skipToken,
    selectProfile,
    searchProcess,
    collectProcessNumbers
};