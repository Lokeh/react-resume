// get resume
const Promise = require('bluebird');

function getResumeJSON() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('get', '/json/resume.json');
		
		xhr.onload = () => {
			if (this.status === 200) {
				resolve(xhr.response);
			}
			else {
				reject({
					status: this.status,
					statusText: this.statusText
				});
			}
		};

		xhr.onerror = () => {
			reject({
				status: this.status,
				statusText: this.statusText
			});
		};

		xhr.send();
	});
}
