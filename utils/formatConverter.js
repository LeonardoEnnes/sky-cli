import fs from 'fs';
import { parseStringPromise, Builder } from 'xml2js';
import { parse as csvParse, stringify as csvStringify } from 'csv';
import { promisify } from 'util';

const csvParseAsync = promisify(csvParse);
const csvStringifyAsync = promisify(csvStringify);

export async function convertFormat(inputFile, outputFile, inputFormat, outputFormat, filter, transform) {
	const inputData = fs.readFileSync(inputFile, 'utf8');
	let data;

	// Parse input data
	if (inputFormat === 'json') {
		data = JSON.parse(inputData).employees;
	} else if (inputFormat === 'xml') {
		data = (await parseStringPromise(inputData)).employees.employee;
	} else if (inputFormat === 'csv') {
		data = await csvParseAsync(inputData, { columns: true });
	} else {
		throw new Error('Unsupported input format');
	}

	// Apply filter if provided
	if (filter) {
		data = data.filter(item => {
			return Object.keys(filter).every(key => item[key] === filter[key]);
		});
	}

	// Apply transform if provided
	if (transform) {
		data = data.map(item => {
			const transformedItem = { ...item };
			Object.keys(transform).forEach(key => {
				if (typeof transform[key] === 'string' && transform[key] === 'toUpperCase') {
					transformedItem[key] = item[key].toUpperCase();
				}
				// Add more transformations as needed
			});
			return transformedItem;
		});
	}

	// Convert to output format
	let outputData;
	if (outputFormat === 'json') {
		outputData = JSON.stringify({ employees: data }, null, 2);
	} else if (outputFormat === 'xml') {
		const builder = new Builder();
		outputData = builder.buildObject({ employees: { employee: data } });
	} else if (outputFormat === 'csv') {
		outputData = await csvStringifyAsync(data, { header: true });
	} else {
		throw new Error('Unsupported output format');
	}

	// Write to output file
	fs.writeFileSync(outputFile, outputData, 'utf8');
}