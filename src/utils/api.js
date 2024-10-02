import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../logs');

// Verifica e cria o diretório 'logs' se não existir
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export async function httpRequest(method, url, headers, data) {
	try {
		const response = await axios({ method, url, headers, data });
		console.log(response.data);
		logRequest('request', { method, url, headers, data, response: response.data });
	} catch (error) {
		console.error(error);
		logRequest('request', { method, url, headers, data, error: error.message });
	}
}

export async function monitorAPI(url, interval) {
	setInterval(async () => {
		try {
			const start = Date.now();
			const response = await axios.get(url);
			const duration = Date.now() - start;
			console.log(`Status: ${response.status}, Time: ${duration}ms`);
			logRequest('monitor', { url, status: response.status, duration });
		} catch (error) {
			console.error(`Error: ${error.message}`);
			logRequest('monitor', { url, error: error.message });
		}
	}, interval);
}

export function showLogs() {
	const requestLogFile = path.join(logDir, 'request_logs.json');
	const monitorLogFile = path.join(logDir, 'monitor_logs.json');

	if (fs.existsSync(requestLogFile)) {
		const requestLogs = fs.readFileSync(requestLogFile, 'utf-8');
		console.log('Request Logs:', requestLogs);
	} else {
		console.log('No request logs found.');
	}

	if (fs.existsSync(monitorLogFile)) {
		const monitorLogs = fs.readFileSync(monitorLogFile, 'utf-8');
		console.log('Monitor Logs:', monitorLogs);
	} else {
		console.log('No monitor logs found.');
	}
}

function logRequest(type, log) {
	const logFile = path.join(logDir, `${type}_logs.json`);
	const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) : [];
	logs.push(log);
	fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}