#!/usr/bin/env node

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import { Logger, HttpRequest, monitorAPI, showLogs } from './utils/api.js';
import FileSearcher from './utils/search.js';
import FileManager from './utils/fileManager.js';
import FormatConverter from './utils/formatConverter.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', autocomplete);

class Command {
    constructor(name, params, execute) {
        this.name = name;
        this.params = params;
        this.execute = execute;
    }
}

class CommandHandler {
    constructor() {
        this.commands = [
            new Command('help', [], () => cli.showHelp(0)),
            new Command('request', ['--method', '--url', '--headers', '--data'], this.handleRequest.bind(this)),
            new Command('monitor', ['--url', '--interval'], this.handleMonitor.bind(this)),
            new Command('logs', [], showLogs),
            new Command('read-file', ['--file'], this.handleReadFile.bind(this)),
            new Command('write-file', ['--file', '--content'], this.handleWriteFile.bind(this)),
            new Command('delete-file', ['--file'], this.handleDeleteFile.bind(this)),
            new Command('list-files', ['--dir'], this.handleListFiles.bind(this)),
            new Command('compare-files', ['--file1', '--file2'], this.handleCompareFiles.bind(this)),
            new Command('search', ['--dir', '--regex', '--created-before', '--created-after', '--modified-before', '--modified-after'], this.handleSearch.bind(this)),
            new Command('convert-format', ['--input-file', '--output-file', '--input-format', '--output-format'], this.handleConvertFormat.bind(this))
        ];

        // Vinculando o método printDifferences
        this.printDifferences = this.printDifferences.bind(this);
    }

    async handleRequest(params) {
        const method = params['--method'] || 'GET';
        const url = params['--url'];
        let headers = {};
        let data = {};

        try {
            headers = params['--headers'] ? JSON.parse(params['--headers'].replace(/'/g, '"')) : {};
        } catch (error) {
            console.error('Invalid JSON for headers');
            process.exit(1);
        }

        try {
            data = params['--data'] ? JSON.parse(params['--data'].replace(/'/g, '"')) : {};
        } catch (error) {
            console.error('Invalid JSON for data');
            process.exit(1);
        }

        const logger = new Logger();
        const httpRequestInstance = new HttpRequest(logger);
        await httpRequestInstance.request(method, url, headers, data);
    }

    async handleMonitor(params) {
        const url = params['--url'];
        const interval = params['--interval'] || 60000; // default to 60 seconds
        await monitorAPI(url, interval);
    }

    async handleReadFile(params) {
        const filePath = params['--file'];
        const content = FileManager.readFile(filePath);
        console.log(content);
    }

    async handleWriteFile(params) {
        const filePath = params['--file'];
        const content = params['--content'];
        FileManager.writeFile(filePath, content);
    }

    async handleDeleteFile(params) {
        const filePath = params['--file'];
        FileManager.deleteFile(filePath);
    }

    async handleListFiles(params) {
        const dirPath = params['--dir'];
        const items = FileManager.listFilesAndFolders(dirPath);
        console.log(items);
    }

    async handleCompareFiles(params) {
        const filePath1 = params['--file1'];
        const filePath2 = params['--file2'];
        const differences = FileManager.compareFiles(filePath1, filePath2);
        this.printDifferences(differences);
    }

    async handleSearch(params) {
        const dirPath = params['--dir'];
        const regex = params['--regex'] ? new RegExp(params['--regex']) : null;
        const createdBefore = params['--created-before'] ? new Date(params['--created-before']) : null;
        const createdAfter = params['--created-after'] ? new Date(params['--created-after']) : null;
        const modifiedBefore = params['--modified-before'] ? new Date(params['--modified-before']) : null;
        const modifiedAfter = params['--modified-after'] ? new Date(params['--modified-after']) : null;

        const searcher = new FileSearcher(dirPath);
        const searchResults = searcher.search(regex, createdBefore, createdAfter, modifiedBefore, modifiedAfter);
        console.log('Search Results:', searchResults);
    }

    async handleConvertFormat(params) {
        const inputFile = params['--input-file'];
        const outputFile = params['--output-file'];
        const inputFormat = params['--input-format'];
        const outputFormat = params['--output-format'];

        const converter = new FormatConverter();
        await converter.convert(inputFile, outputFile, inputFormat, outputFormat);
    }

    printDifferences(differences) {
        console.log('---------------------------------------');
        console.log(chalk.bold.underline('Legend:'));
        console.log(chalk.green('  + Added lines'));
        console.log(chalk.red('  - Removed lines'));
        console.log(chalk.grey('  = Unchanged lines'));
        console.log();
        console.log('---------------------------------------');

        differences.forEach((part) => {
            const color = part.added ? chalk.green :
                          part.removed ? chalk.red : chalk.grey;
            process.stderr.write(color(part.value));
        });
    }

    async promptUser() {
        const { command } = await inquirer.prompt([{
            type: 'autocomplete',
            name: 'command',
            message: 'What do you want to do?',
            source: (answersSoFar, input) => {
                input = input || '';
                return new Promise((resolve) => {
                    const filteredCommands = this.commands.filter(cmd =>
                        cmd.name.toLowerCase().includes(input.toLowerCase())
                    );
                    resolve(filteredCommands.map(cmd => cmd.name));
                });
            }
        }]);

        const selectedCommand = this.commands.find(cmd => cmd.name === command);
        const params = await inquirer.prompt(
            selectedCommand.params.map(param => ({
                type: 'input',
                name: param,
                message: `Enter value for ${param}:`
            }))
        );

        await selectedCommand.execute(params);
    }
}

(async () => {
    const initializer = new init();
    await initializer.init({ clear: true });

    const commandHandler = new CommandHandler();
    await commandHandler.promptUser();
})();