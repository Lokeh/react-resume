// get resume
import Promise from 'bluebird';

export default function getResumeJSON(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('get', url);

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
