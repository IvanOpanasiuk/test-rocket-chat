import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

import { settings } from '../../app/settings';
import { Users, Rooms } from '../../app/models';

// const headers = { 'Content-type': 'application/json', 'Cache-Control': 'no-cache' };
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
			return await HTTP.get(`${ Service_key }/${ email }`, headers);
		} catch (error) {
			throw new Meteor.Error('error-get-user-data', `Error message : ${ error.message }`, {
				method: 'getExtraField',
				message: error.message,
			});
		}
	},
	async getVacantion(rid = '') {
		check(rid, String);
		try {
			const userId = Meteor.userId();
			if (!userId) {
				throw new Meteor.Error('error-invalid-user', 'Invalid user', {
					method: 'ignoreUser',
				});
			}
			const Service_key = settings.get('Service_account_key');
			const [idUser] = Rooms.findOne({ _id: rid }, { fields: { uids: 1 } }).uids;
			const { address } = await Users.findOne({ _id: idUser }, { fields: { emails: 1 } }).emails[0];
			const res = await HTTP.get(`${ Service_key }/${ address }`, headers);
			const { vacation } = res.data[0];

			if (Object.keys(vacation).length) {
				const { from, to } = vacation;
				const announcement = `In vacantion fom ${ from } to ${ to }`;
				await Rooms.update({ _id: rid }, { $set: { announcement } });
				await Users.update({ _id: idUser }, { $set: { vacation } });
			} else {
				await Rooms.update({ _id: rid }, { $set: { announcement: '' } });
			}
			return res;
		} catch (error) {
			throw new Meteor.Error('error-get-user-data', `Error message : ${ error.message }`, {
				method: 'getVacantion',
				message: error.message,
			});
		}
	},

});
