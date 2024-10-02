// @desc: the filter and transform functions were removed from the code due to errors during the execution
// @desc: filter and transform functions will be implemented later

import { parse as json2csv } from 'json2csv';
import { parseStringPromise as xml2js, Builder as js2xml } from 'xml2js';
import { promises as fs } from 'fs';

export async function convertFormat(inputFile, outputFile, inputFormat, outputFormat) {
    const inputData = await fs.readFile(inputFile, 'utf8');
    let data;

    // Parse input data
    if (inputFormat === 'json') {
        data = JSON.parse(inputData);
    } else if (inputFormat === 'xml') {
        const parsedXml = await xml2js(inputData);
        data = parsedXml.root && Array.isArray(parsedXml.root.item) ? parsedXml.root.item : parsedXml.root;
    } else if (inputFormat === 'csv') {
        data = await csv().fromString(inputData);
    } else {
        throw new Error('Unsupported input format');
    }

    // Ensure data is an array for consistent processing
    if (!Array.isArray(data)) {
        data = [data]; // Convert to array if it's not already an array
    }

    let outputData;

    // Convert to output format
    if (outputFormat === 'json') {
        outputData = JSON.stringify(data, null, 2);
    } else if (outputFormat === 'xml') {
        const builder = new js2xml();
        outputData = builder.buildObject({ root: { item: data } });
    } else if (outputFormat === 'csv') {
        outputData = json2csv(data);
    } else {
        throw new Error('Unsupported output format');
    }

    // Write to output file
    await fs.writeFile(outputFile, outputData, 'utf8');
}