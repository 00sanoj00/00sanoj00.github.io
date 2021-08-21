'use strict';

const SpreadSheetFactory = require('../../controllers/spread-sheet/spread-sheet-factory');

module.exports = async (req, res) => {

	if(!req.query || !req.query.googleId) {

		res.status(400);
		return res.json({
			message: 'Google ID must be provided'
		});
	}

	try {

		const document = await SpreadSheetFactory.getDocument(req.query.googleId);
		const data = await document.getData() || {};

		res.json(data);

	} catch(error) {

		res.status(500);
		res.json({
			message: 'Internal Server Error',
			errorMessage: error.message
		});
	}
};
