import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    logRequest(type, log) {
        const logFile = path.join(this.logDir, `${type}_logs.json`);
        const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) : [];
        logs.push(log);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    }
}

class HttpRequest {
    constructor(logger) {
        this.logger = logger;
    }

    async request(method, url, headers, data) {
        try {
            const response = await axios({ method, url, headers, data });
            console.log(response.data);
            this.logger.logRequest('request', { method, url, headers, data, response: response.data });
        } catch (error) {
            console.error(error);
            this.logger.logRequest('request', { method, url, headers, data, error: error.message });
        }
    }
}

// Definindo a função monitorAPI
async function monitorAPI(url, interval) {
    const logger = new Logger();
    setInterval(async () => {
        try {
            const response = await axios.get(url);
            console.log(`Monitoring ${url}:`, response.data);
            logger.logRequest('monitor', { url, response: response.data });
        } catch (error) {
            console.error(`Error monitoring ${url}:`, error.message);
            logger.logRequest('monitor', { url, error: error.message });
        }
    }, interval);
}

// Definindo a função showLogs
function showLogs() {
    const logDir = path.join(__dirname, '../logs');
    const logFiles = fs.readdirSync(logDir);
    logFiles.forEach(file => {
        const logFilePath = path.join(logDir, file);
        const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
        console.log(`Logs from ${file}:`, logs);
    });
}

// Exportando as classes e funções
export { Logger, HttpRequest, monitorAPI, showLogs };