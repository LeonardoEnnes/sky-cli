import fs from 'fs';
import path from 'path';
import { diffLines } from 'diff';

class FileManager {
    static readFile(filePath) {
        try {
            return fs.readFileSync(path.resolve(filePath), 'utf8');
        } catch (error) {
            console.error(`Error reading file: ${error.message}`);
            process.exit(1);
        }
    }

    static writeFile(filePath, content) {
        try {
            fs.writeFileSync(path.resolve(filePath), content, 'utf8');
            console.log('File written successfully');
        } catch (error) {
            console.error(`Error writing file: ${error.message}`);
            process.exit(1);
        }
    }

    static deleteFile(filePath) {
        try {
            fs.unlinkSync(path.resolve(filePath));
            console.log('File deleted successfully');
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
            process.exit(1);
        }
    }

    static listFilesAndFolders(dirPath) {
        try {
            const items = fs.readdirSync(path.resolve(dirPath));
            return items.map(item => {
                const fullPath = path.join(dirPath, item);
                const stats = fs.statSync(fullPath);
                return { name: item, isFile: stats.isFile(), isDirectory: stats.isDirectory() };
            });
        } catch (error) {
            console.error(`Error listing files and folders: ${error.message}`);
            process.exit(1);
        }
    }

    static compareFiles(filePath1, filePath2) {
        try {
            const file1Content = fs.readFileSync(path.resolve(filePath1), 'utf-8');
            const file2Content = fs.readFileSync(path.resolve(filePath2), 'utf-8');
            return diffLines(file1Content, file2Content);
        } catch (error) {
            console.error(`Error comparing files: ${error.message}`);
            process.exit(1);
        }
    }
}

export default FileManager;