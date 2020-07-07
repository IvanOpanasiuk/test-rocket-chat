import { Meteor } from 'meteor/meteor';

import { updateAvatarOfRoom } from '../../app/ui-utils';
import { Notifications } from '../../app/notifications';

Meteor.startup(function() {
	Notifications.onLogged('updateAvatar', function(data) {
		const { username, etag } = data;
		Meteor.users.update({ username }, { $set: { avatarETag: etag } });
	});
	Notifications.onLogged('updateRoomAvatar', function(data) {
		updateAvatarOfRoom(data.roomId);
	});
});
