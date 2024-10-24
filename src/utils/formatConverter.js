// @desc: add Filtering and Sorting feat somewhere (maybe put it in another file, i think theres no need to put in this file)

import { parse as json2csv } from 'json2csv';
import { parseStringPromise as xml2js, Builder as js2xml } from 'xml2js';
import { promises as fs } from 'fs';

class FormatConverter {
    async convert(inputFile, outputFile, inputFormat, outputFormat) {
        const inputData = await fs.readFile(inputFile, 'utf8');
        let data = this.parseInputData(inputData, inputFormat);
        let outputData = this.convertOutputFormat(data, outputFormat);
        await fs.writeFile(outputFile, outputData, 'utf8');
    }

    parseInputData(inputData, inputFormat) {
        if (inputFormat === 'json') {
            return JSON.parse(inputData);
        } else if (inputFormat === 'xml') {
            return xml2js(inputData).then(parsedXml => parsedXml.root && Array.isArray(parsedXml.root.item) ? parsedXml.root.item : parsedXml.root);
        } else if (inputFormat === 'csv') {
            return csv().fromString(inputData);
        } else {
            throw new Error('Unsupported input format');
        }
    }

    convertOutputFormat(data, outputFormat) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (outputFormat === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (outputFormat === 'xml') {
            const builder = new js2xml();
            return builder.buildObject({ root: { item: data } });
        } else if (outputFormat === 'csv') {
            return json2csv(data);
        } else {
            throw new Error('Unsupported output format');
        }
    }
}

export default FormatConverter;