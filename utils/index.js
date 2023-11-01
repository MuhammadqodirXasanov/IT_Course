import moment from 'moment';

export default {
	ifequal(a, b, options) {
		if (a == b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
	firstLetterName(f) {
		return f.charAt(0);
	},
	formatDate(date) {
		return moment(date).format('hh:mm, DD-MMM, YYYY');
	},
};
