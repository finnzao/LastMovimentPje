import { utils, writeFile } from 'xlsx';
import { join } from 'path';

async function saveToExcel(processNumbers, filename = "ResultadoProcessosPesquisa") {
    const dir = join(__dirname, `../docs/${filename}.xlsx`);
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([["Processos"]]);

    processNumbers.forEach((processo, index) => {
        utils.sheet_add_aoa(ws, [[processo]], { origin: `A${index + 2}` });
    });

    utils.book_append_sheet(wb, ws, filename);
    writeFile(wb, dir);
    console.log(`Arquivo '${filename}' criado com sucesso.`);
}

export {
    saveToExcel
};