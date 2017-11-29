// Creates an array with the properties of the object and add to each element a property name with its name
const objToArr = obj => Object.keys(obj).reduce((acc, key) => [...acc, {...{name: key}, ...obj[key]}], []);

// Creates a new object with the property "properties" as an array
const cpyObj = obj =>
	Object.keys(obj).reduce((acc, key) => ({
		...acc, ...{
			[key]: key === 'properties' ?
				objToArr(cpyObj(obj[key])) :
				Object.prototype.toString.call(obj[key]) === "[object Object]" ?
					cpyObj(obj[key]) :
					obj[key]
		}
	}), {});

// I wanted to keep json and transform and theirs interfaces
const json = (file, successHandler, errorHandler = err => console.error(err)) =>
	(async () => await(await fetch(file)).json())()
		.then(data => successHandler(data))
		.catch(err => errorHandler(err));

const transform = callback => {
	json('./from.json', data => callback({data: cpyObj(data)}));
};