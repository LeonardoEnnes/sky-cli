import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';

class Initializer {
    constructor(clear = true) {
        this.clear = clear;
    }

    async init() {
        unhandled();
        const pkgJson = await getPackageJson(`../../package.json`);
        welcome({
            title: `sky-cli`,
            tagLine: `by Leonardo Ennes`,
            description: pkgJson.description,
            version: pkgJson.version,
            bgColor: '#A699EA',
            color: '#000000',
            bold: true,
            clear: this.clear
        });
    }
}

export default Initializer;