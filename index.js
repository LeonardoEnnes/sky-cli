#!/usr/bin/env node

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import { httpRequest, monitorAPI, showLogs } from './utils/api.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

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
	}
})();