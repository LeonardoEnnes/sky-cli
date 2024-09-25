import fs from 'fs';
import path from 'path';

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