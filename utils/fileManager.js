import fs from 'fs';
import path from 'path';
import { diffLines } from 'diff'; // it was used to compare two files and see the difference between them 
import chalk from 'chalk'; // it was used to color the text in the console 

export const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(path.resolve(filePath), 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
};

export const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(path.resolve(filePath), content, 'utf8');
    console.log('File written successfully');
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
};

export const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(path.resolve(filePath));
    console.log('File deleted successfully');
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    process.exit(1);
  }
};

// list files and directories 

export const listFilesAndFolders = (dirPath) => {
  try {
    const items = fs.readdirSync(path.resolve(dirPath));
    const result = items.map(item => {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      return {
        name: item,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    });
    return result;
  } catch (error) {
    console.error(`Error listing files and folders: ${error.message}`);
    process.exit(1);
  }
};

// @note: make it better later 
// @desc: comparing files (its useful for comparing two files and see the difference between them)

export const compareFiles = (filePath1, filePath2) => {
  try {
    const file1Content = fs.readFileSync(path.resolve(filePath1), 'utf-8');
    const file2Content = fs.readFileSync(path.resolve(filePath2), 'utf-8');

    const differences = diffLines(file1Content, file2Content);

    return differences;
  } catch (error) {
    console.error(`Error comparing files: ${error.message}`);
    process.exit(1);
  }
};