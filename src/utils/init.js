// src/utils/init.js
import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';
import figlet from 'figlet'; 
import chalk from 'chalk'; 

class Initializer {
    constructor(clear = true) {
        this.clear = clear;
    }

    async init() {
        unhandled();
        const pkgJson = await getPackageJson(`../../package.json`);

        // Generate the welcome message using figlet
        const welcomeMessage = figlet.textSync('Welcome to the Sky CLI!', {
            font: 'Standard', 
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        if (this.clear) {
            console.clear();
        }

        console.log(chalk.cyan(welcomeMessage)); // Change color to cyan

        // Display the CLI information
        welcome({
            title: `🌌 Sky CLI`, 
            description: pkgJson.description,
            version: pkgJson.version,
            bgColor: '#A699EA',
            color: '#000000',
            bold: true,
            clear: false // Do not clear again after the welcome message
        });
    }
}

export default Initializer;