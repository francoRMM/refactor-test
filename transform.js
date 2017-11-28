const objToArr = obj => {
	return Object.keys(obj).reduce((acc, cur) => [...acc, obj[cur]], []);
};

const cpyProps = obj => {
	return Object.keys(obj).reduce((acc, key) => {
		return {
			...acc, ...{
				[key]: key === 'properties' || key === 'examples' ?
					objToArr(cpyProps(obj[key])) :
					typeof obj[key] === 'object' ?
						cpyProps(obj[key]) :
						obj[key]
			}
		}
	}, {});
};

function json(value, successHandler, errorHandler) {
	let xhr = typeof XMLHttpRequest !== 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	xhr.open('get', value, true);
	xhr.onreadystatechange = function () {
		let status;
		let data;
		// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
		if (xhr.readyState === 4) {
			// `DONE`
			status = xhr.status;
			if (status === 200) {
				data = JSON.parse(xhr.responseText);
				successHandler && successHandler(data);
			} else {
				errorHandler && errorHandler(status);
			}
		}
	};
	xhr.send();
}

function transform(callback) {
	json('./from.json', data => {
		callback({data: cpyProps(data)});
	});
}

