import pako from 'pako';

export function createGUID() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

export function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

export function formatNum(n) {
	if (+n < 0) n = 0;
	var v = (+n).toFixed(2);
	while (v[v.length - 1] == "0") {
		v = v.slice(0, -1);
	}
	if (v[v.length - 1] == ".") v = v.slice(0, -1);
	return v;
}

export function getUrlParam(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) {
		return 0;
	}
	return results[1] || 0;
};
