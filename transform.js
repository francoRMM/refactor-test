const cpyProps = obj => {
	return Object.keys(obj).reduce((acc, key) => {
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

const json = async (file, successHandler, errorHandler = err => console.error(err)) => {
	try {
		successHandler(await(await fetch(file)).json());
	} catch (err) {
		errorHandler(err);
	}
};

const transform = callback => {
	json('./from.json', data => callback({data: cpyProps(data)}));
};