#!/usr/bin/env node

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import { httpRequest, monitorAPI, showLogs } from './utils/api.js';
import { readFile, writeFile, deleteFile, listFilesAndFolders, compareFiles } from './utils/fileManager.js';
import chalk from 'chalk';
import figlet from "figlet";

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

console.log(
	chalk.yellow(figlet.textSync("Welcome to the Sky CLI", { horizontalLayout: "full" }))
  );

(async () => {
	await init({ clear });
	debug && log(flags);

	if (input.includes('help')) {
		showHelp(0);
	} else if (input.includes('request')) {
		const method = flags.method || 'GET';
		const url = flags.url;
		let headers = {};
		let data = {};

		try {
			headers = flags.headers ? JSON.parse(flags.headers.replace(/'/g, '"')) : {};
		} catch (error) {
			console.error('Invalid JSON for headers');
			process.exit(1);
		}

		try {
			data = flags.data ? JSON.parse(flags.data.replace(/'/g, '"')) : {};
		} catch (error) {
			console.error('Invalid JSON for data');
			process.exit(1);
		}

		await httpRequest(method, url, headers, data);
	} else if (input.includes('monitor')) {
		const url = flags.url;
		const interval = flags.interval || 60000; // default to 60 seconds
		await monitorAPI(url, interval);
	} else if (input.includes('logs')) {
		showLogs();
	} else if (input.includes('read-file')) { 
		const filePath = flags.file;
		const content = readFile(filePath);
		console.log(content);
	} else if (input.includes('write-file')) { // function to write files (check it later to do better maybe)
		const filePath = flags.file;
		const content = flags.content;
		writeFile(filePath, content);
	} else if (input.includes('delete-file')) { // function to delete any file
		const filePath = flags.file;
		deleteFile(filePath);
	} else if (input.includes('list-files')) { // function to list files and folders
		const dirPath = flags.dir;
		const items = listFilesAndFolders(dirPath);
		console.log(items);
	}else if (input.includes('compare-files')) { // function to compare files (make it better later)
		const filePath1 = flags.file1;
		const filePath2 = flags.file2;
		const differences = compareFiles(filePath1, filePath2);
		differences.forEach((part) => {
			const color = part.added ? chalk.green :
			              part.removed ? chalk.red : chalk.grey;
			process.stderr.write(color(part.value));
		});
	}
})();