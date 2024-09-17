import axios from 'axios';
import fs from 'fs';

const logFile = 'api_logs.json';

export async function httpRequest(method, url, headers, data) {
	try {
		const response = await axios({ method, url, headers, data });
		console.log(response.data);
		logRequest({ method, url, headers, data, response: response.data });
	} catch (error) {
		console.error(error);
		logRequest({ method, url, headers, data, error: error.message });
	}
}

export async function monitorAPI(url, interval) {
	setInterval(async () => {
		try {
			const start = Date.now();
			const response = await axios.get(url);
			const duration = Date.now() - start;
			console.log(`Status: ${response.status}, Time: ${duration}ms`);
			logRequest({ url, status: response.status, duration });
		} catch (error) {
			console.error(`Error: ${error.message}`);
			logRequest({ url, error: error.message });
		}
	}, interval);
}

export function showLogs() {
	if (fs.existsSync(logFile)) {
		const logs = fs.readFileSync(logFile, 'utf-8');
		console.log(logs);
	} else {
		console.log('No logs found.');
	}
}

function logRequest(log) {
	const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) : [];
	logs.push(log);
	fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}