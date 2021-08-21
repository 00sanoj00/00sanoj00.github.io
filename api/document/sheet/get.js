'use strict';

const SpreadSheetFactory = require('../../../controllers/spread-sheet/spread-sheet-factory');

module.exports = async (req, res) => {

	if(!req.query || !req.query.googleId) {

		res.status(400);
		return res.json({
			message: 'Google ID must be provided'
		});
	}

	if(!req.query || !req.query.sheetNumber) {

		res.status(400);
		return res.json({
			message: 'Sheet Number must be provided'
		});
	}

	const sheetNumber = Number(req.query.sheetNumber);

	if(Number.isNaN(sheetNumber) || sheetNumber < 0) {
		res.status(400);
		return res.json({
			message: 'Sheet Number must be a positive number'
		});
	}

	try {

		const document = await SpreadSheetFactory.getDocument(req.query.googleId);

		if(sheetNumber >= document.sheetsNumber) {
			res.status(404);
			return res.json({
				message: `Cannot found Sheet ${sheetNumber} in Document`
			});
		}

		const data = await document.getSheet(sheetNumber) || [];

		res.json(data);

	} catch(error) {

		res.status(500);
		res.json({
			message: 'Internal Server Error',
			errorMessage: error.message
		});
	}
};
