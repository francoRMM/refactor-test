const objToArr = obj => {
	return Object.keys(obj).reduce((acc, cur) => [...acc, obj[cur]], []);
};

const cpyProps = obj => {
	return Object.keys(obj).reduce((acc, key) => {
		return {
			...acc, ...{
				[key]: key === 'properties'?
					objToArr(cpyProps(obj[key])) :
					Object.prototype.toString.call(obj[key])==="[object Object]"?
						cpyProps(obj[key]) :
						obj[key]
			}
		}
	}, {});
};

const json = (file, successHandler, errorHandler) => {
	return fetch(file).then(res => {
			if (res.ok)
				return res.json();
			throw new Error('Connection Error');
		})
		.then(data => successHandler & successHandler(data))
		.catch(error => errorHandler & errorHandler(error));
};

const transform = callback => {
	json('./from.json', data => callback({data: cpyProps(data)}));
};

