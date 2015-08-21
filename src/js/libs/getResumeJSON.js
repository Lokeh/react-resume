// get resume
const Promise = require('bluebird');

function getResumeJSON() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('get', '../json/resume.json');

		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(JSON.parse(xhr.response));
			}
			else {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			}
		};

		xhr.onerror = () => {
			reject({
				status: xhr.status,
				statusText: xhr.statusText
			});
		};

		xhr.send();
	});
}

module.exports = getResumeJSON;
