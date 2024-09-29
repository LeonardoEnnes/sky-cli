import fs from 'fs';
import { parseStringPromise, Builder } from 'xml2js';
import { parse as csvParse, stringify as csvStringify } from 'csv';
import { promisify } from 'util';

const csvParseAsync = promisify(csvParse);
const csvStringifyAsync = promisify(csvStringify);

export async function convertFormat(inputFile, outputFile, inputFormat, outputFormat, filter, transform) {
	const inputData = fs.readFileSync(inputFile, 'utf8');
	let data;

	if (inputFormat === 'json') {
		data = JSON.parse(inputData);
	} else if (inputFormat === 'xml') {
		data = (await parseStringPromise(inputData)).employees.employee;
	} else if (inputFormat === 'csv') {
		data = await csvParseAsync(inputData, { columns: true });
	} else {
		throw new Error('Unsupported input format');
	}

	// Ensure data is an array
	if (!Array.isArray(data)) {
		data = [data];
	}

	if (filter) {
		data = data.filter(item => {
			return Object.keys(filter).every(key => item[key] === filter[key]);
		});
	}

	if (transform) {
		data = data.map(item => {
			const transformedItem = { ...item };
			Object.keys(transform).forEach(key => {
				if (typeof transform[key] === 'string' && transform[key] === 'toUpperCase') {
					transformedItem[key] = item[key].toUpperCase();
				}
			});
			return transformedItem;
		});
	}

	// Convert to output format
	let outputData;
	if (outputFormat === 'json') {
		outputData = JSON.stringify(data, null, 2);
	} else if (outputFormat === 'xml') {
		const builder = new Builder();
		outputData = builder.buildObject({ employees: { employee: data } });
	} else if (outputFormat === 'csv') {
		outputData = await csvStringifyAsync(data, { header: true });
	} else {
		throw new Error('Unsupported output format');
	}

	fs.writeFileSync(outputFile, outputData, 'utf8');
}