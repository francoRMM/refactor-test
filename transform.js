const cpyProps = obj => {
	Object.keys(obj).reduce((acc, key) => {
		return {
			...acc, ...{
				[key]: key === 'properties' ?
					Object.values(cpyProps(obj[key])) :
					Object.prototype.toString.call(obj[key]) === "[object Object]" ?
						cpyProps(obj[key]) :
						obj[key]
			}
		}
	}, {});
};

const json = (file, successHandler, errorHandler = (err) => { throw err}) => {
	fetch(file).then(res => {
			if (res.ok)
				return res.json();
			throw new Error('Connection Error');
		})
		.then(data => successHandler && successHandler(data))
		.catch(err => errorHandler(err));
};

const transform = callback => {
	json('./from.json', data => callback({data: cpyProps(data)}));
};