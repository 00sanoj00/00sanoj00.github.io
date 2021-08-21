'use strict';

module.exports = async (req, res) => {
	res.json({
		message: 'Cannot Access',
		url: req.url
	});
};
