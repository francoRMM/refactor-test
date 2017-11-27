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
		let schema = {};
		schema.data = {};

		Object.keys(data).forEach(propName => {
			schema.data[propName] = data[propName];

			if (propName === 'properties') {
				schema.data[propName] = [];

				for (let subPropName in data[propName]) {
					let subSchema = {};

					subSchema.name = subPropName;

					for (let subSubPropName in data[propName][subPropName]) {
						subSchema[subSubPropName] = data[propName][subPropName][subSubPropName];

						if (subSubPropName === 'properties') {
							subSchema[subSubPropName] = [];

							for (let subSubSubPropName in data[propName][subPropName][subSubPropName]) {
								let obj = {};

								subSchema.name = subSubSubPropName;

								for (let subSubSubSubPropName in data[propName][subPropName][subSubPropName][subSubSubPropName]) {
									obj[subSubSubSubPropName] = data[propName][subPropName][subSubPropName][subSubSubPropName][subSubSubSubPropName];
								}

								subSchema[subSubPropName].push(obj);
							}
						}
					}

					schema.data[propName].push(subSchema);
				}
			}
		});

		callback(schema);
	});
}
