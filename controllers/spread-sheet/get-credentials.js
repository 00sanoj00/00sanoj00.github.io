/* eslint-disable global-require */

'use strict';

module.exports = () => {

	try {

		const credentials = require('../../../config/google-credentials.json');
		return credentials;

	} catch(error) {

		return {
			client_email: 'json-api@proto-rescuefy.iam.gserviceaccount.com',
			private_key: process.env.PRIVATE_KEY || ''
		};
	}
};
