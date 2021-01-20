const formatter = require('./lib/formatter');
const defaultFormatterFunction = require('./lib/default/formatResults')

function fancy(options = {}, formatterFunction = defaultFormatterFunction) {

	const formatFunction = formatter(options);

	return {
		formatter: formatFunction,
		output: formatFunction.report(formatterFunction)
	}
}

module.exports = fancy