import fs from 'fs';
import path from 'path';

class FileSearcher {
    constructor(basePath) {
        this.basePath = basePath;
    }

    search(regex, createdBefore, createdAfter, modifiedBefore, modifiedAfter) {
        const results = [];
        if (fs.statSync(this.basePath).isDirectory()) {
            this.searchDirectory(this.basePath, regex, results, createdBefore, createdAfter, modifiedBefore, modifiedAfter);
        } else {
            this.searchFile(this.basePath, regex, results);
        }
        return results;
    }

    searchDirectory(dirPath, regex, results, createdBefore, createdAfter, modifiedBefore, modifiedAfter) {
        const items = fs.readdirSync(dirPath);
        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                this.searchDirectory(fullPath, regex, results, createdBefore, createdAfter, modifiedBefore, modifiedAfter);
            } else {
                this.searchFile(fullPath, regex, results);
            }
        });
    }

    searchFile(filePath, regex, results) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (regex && regex.test(content)) {
            results.push({ filePath, matches: content.match(regex) });
        }
    }
}

export default FileSearcher;