#!/usr/bin/env node

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import { httpRequest, monitorAPI, showLogs } from './utils/api.js';
import { readFile, writeFile, deleteFile, listFilesAndFolders, compareFiles } from './utils/fileManager.js';
import chalk from 'chalk';
import figlet from "figlet";
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

// Register the autocomplete prompt
inquirer.registerPrompt('autocomplete', autocomplete);

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

console.log(
	chalk.yellow(figlet.textSync("Welcome to the Sky CLI", { horizontalLayout: "full" }))
);

// List of commands for autocomplete
const commands = [
	{ name: 'help', params: [] },
	{ name: 'request', params: ['--method', '--url', '--headers', '--data'] },
	{ name: 'monitor', params: ['--url', '--interval'] },
	{ name: 'logs', params: [] },
	{ name: 'read-file', params: ['--file'] },
	{ name: 'write-file', params: ['--file', '--content'] },
	{ name: 'delete-file', params: ['--file'] },
	{ name: 'list-files', params: ['--dir'] },
	{ name: 'compare-files', params: ['--file1', '--file2'] }
];

(async () => {
	await init({ clear });
	debug && log(flags);

	// Prompt the user with an autocomplete list of commands
	const { command } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'command',
			message: 'What do you want to do?',
			source: (answersSoFar, input) => {
				input = input || '';
				return new Promise((resolve) => {
					const filteredCommands = commands.filter(cmd =>
						cmd.name.toLowerCase().includes(input.toLowerCase())
					);
					resolve(filteredCommands.map(cmd => cmd.name));
				});
			}
		}
	]);

	// Find the selected command and its parameters
	const selectedCommand = commands.find(cmd => cmd.name === command);

	// Prompt the user for the parameters
	const params = await inquirer.prompt(
		selectedCommand.params.map(param => ({
			type: 'input',
			name: param,
			message: `Enter value for ${param}:`
		}))
	);

	// Construct the command with the provided parameters
	const commandWithParams = `${command} ${Object.entries(params).map(([key, value]) => `${key}=${value}`).join(' ')}`;

	// Execute the constructed command
	const args = commandWithParams.split(' ');
	const cmd = args[0];
	const cmdFlags = args.slice(1).reduce((acc, arg) => {
		const [key, value] = arg.split('=');
		acc[key.replace('--', '')] = value;
		return acc;
	}, {});

	if (cmd === 'help') {
		showHelp(0);
	} else if (cmd === 'request') {
		const method = cmdFlags.method || 'GET';
		const url = cmdFlags.url;
		let headers = {};
		let data = {};

		try {
			headers = cmdFlags.headers ? JSON.parse(cmdFlags.headers.replace(/'/g, '"')) : {};
		} catch (error) {
			console.error('Invalid JSON for headers');
			process.exit(1);
		}

		try {
			data = cmdFlags.data ? JSON.parse(cmdFlags.data.replace(/'/g, '"')) : {};
		} catch (error) {
			console.error('Invalid JSON for data');
			process.exit(1);
		}

		await httpRequest(method, url, headers, data);
	} else if (cmd === 'monitor') {
		const url = cmdFlags.url;
		const interval = cmdFlags.interval || 60000; // default to 60 seconds
		await monitorAPI(url, interval);
	} else if (cmd === 'logs') {
		showLogs();
	} else if (cmd === 'read-file') { 
		const filePath = cmdFlags.file;
		const content = readFile(filePath);
		console.log(content);
	} else if (cmd === 'write-file') { // function to write files (check it later to do better maybe)
		const filePath = cmdFlags.file;
		const content = cmdFlags.content;
		writeFile(filePath, content);
	} else if (cmd === 'delete-file') { // function to delete any file
		const filePath = cmdFlags.file;
		deleteFile(filePath);
	} else if (cmd === 'list-files') { // function to list files and folders
		const dirPath = cmdFlags.dir;
		const items = listFilesAndFolders(dirPath);
		console.log(items);
	} else if (cmd === 'compare-files') { // function to compare files (make it better later)
		const filePath1 = cmdFlags.file1;
		const filePath2 = cmdFlags.file2;
		const differences = compareFiles(filePath1, filePath2);

		// Print legend (make it better later)
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
})();