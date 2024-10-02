import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';

export default async ({ clear = true }) => {
    unhandled();
    // Certifique-se de que o caminho está correto
    const pkgJson = await getPackageJson(`../../package.json`); 

    welcome({
        title: `sky-cli`,
        tagLine: `by Leonardo Ennes`,
        description: pkgJson.description,
        version: pkgJson.version,
        bgColor: '#A699EA',
        color: '#000000',
        bold: true,
        clear
    });
};