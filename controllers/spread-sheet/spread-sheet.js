'use strict';

const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Spreadsheet {

	static get sheetsAliases() {
		return this._sheetsAliases || [];
	}

	/**
	 * Setter for Aliases for the Sheets
	 * @param {Array<string>} aliases Aliases sorted, first alias for first sheet.
	 */
	static setSheetsAliases(aliases) {

		if(!Array.isArray(aliases) || aliases.some(alias => typeof alias !== 'string'))
			throw new Error('Aliases must be an array of strings');

		this._sheetsAliases = aliases;
	}

	get sheetsNumber() {

		if(!this.document)
			throw new Error('A Google Spreadsheet document must be loaded');

		return this.document.sheetsByIndex ? this.document.sheetsByIndex.length : 0;
	}

	async load(credentials, spreadsheetId) {

		if(!credentials)
			throw new Error('Cannot load without Credentials');

		if(!spreadsheetId)
			throw new Error('Cannot load without an ID');

		if(typeof spreadsheetId !== 'string')
			throw new Error('Invalid Spreadsheet ID');

		this.document = new GoogleSpreadsheet(spreadsheetId);

		await this.document.useServiceAccountAuth(credentials);
		await this.document.loadInfo();
	}

	async getData() {

		if(!this.document)
			throw new Error('A Google Spreadsheet document must be loaded');

		const sheets = await Promise.all(this.document.sheetsByIndex.map(sheet => this.getSheetData(sheet)));

		return sheets.reduce((sheetsWithAliases, sheet, index) => {

			const sheetName = this.constructor.sheetsAliases[index] || `Sheet${index}`;

			sheetsWithAliases[sheetName] = sheet;

			return sheetsWithAliases;
		}, {});
	}

	getSheet(sheetNumber) {

		if(!this.document)
			throw new Error('A Google Spreadsheet document must be loaded');

		if(typeof sheetNumber !== 'number' || sheetNumber < 0)
			throw new Error('Sheet Number must be a positive number');

		return this.getSheetData(this.document.sheetsByIndex[sheetNumber]);
	}

	async getSheetData(sheet) {

		const rows = await sheet.getRows();

		return rows.reduce((data, { _rawData, _rowNumber, _sheet, ...row }) => {

			const element = {};

			Object.keys(row).forEach(field => {
				if(row[field])
					element[field] = row[field];
			});

			data.push(element);
			return data;
		}, []);
	}
};
