import fs from 'fs';
import path from 'path';

export const searchFiles = (dir, regex, createdBefore, createdAfter, modifiedBefore, modifiedAfter) => {
    const searchResults = [];

    const searchDirectory = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                searchDirectory(filePath);
            } else {
                let match = true;

                if (regex) {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    match = regex.test(content);
                }

                if (createdBefore && stats.birthtime >= createdBefore) {
                    match = false;
                }

                if (createdAfter && stats.birthtime <= createdAfter) {
                    match = false;
                }

                if (modifiedBefore && stats.mtime >= modifiedBefore) {
                    match = false;
                }

                if (modifiedAfter && stats.mtime <= modifiedAfter) {
                    match = false;
                }

                if (match) {
                    searchResults.push(filePath);
                }
            }
        });
    };

    searchDirectory(dir);
    return searchResults;
};