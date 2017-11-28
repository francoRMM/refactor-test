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

const json = (file, successHandler, errorHandler) => {
	return fetch(file).then((res) => {
			if (res.ok)
				return res.json();
			throw new Error('Connection Error');
		})
		.then(data => successHandler & successHandler(data))
		.catch(error => errorHandler & errorHandler(error));
};

const transform = (callback) => {
	json('./from.json', data => callback({data: cpyProps(data)}));
};

