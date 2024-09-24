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

