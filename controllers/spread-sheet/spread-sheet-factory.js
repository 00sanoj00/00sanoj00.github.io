'use strict';

const SpreadSheet = require('./spread-sheet');

const getCredentials = require('./get-credentials');

module.exports = class SpreadsheetFactory {

	static async getDocument(spreadsheetId) {

		const credentials = getCredentials();

		const document = new SpreadSheet();
		await document.load(credentials, spreadsheetId);

		return document;
	}
};
