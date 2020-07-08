import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

import { settings } from '../../app/settings';

const headers = { 'Content-type': 'application/json' };


Meteor.methods({
	async getExtraField(email) {
		check(email, String);
		try {
			const Service_key = settings.get('Service_account_key');
			const userId = Meteor.userId();
			if (!userId) {
				throw new Meteor.Error('error-invalid-user', 'Invalid user', {
					method: 'ignoreUser',
				});
			}
			// request to profile server
			const response = await HTTP.get(`${ Service_key }/${ email }`, headers);
			return response;
		} catch (error) {
			throw new Meteor.Error('error-get-user-data', `Error message : ${ error.message }`, {
				method: 'getExtraField',
				message: error.message,
			});
		}
	},

});
