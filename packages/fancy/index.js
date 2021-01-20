const formatter = require('./lib/formatter');
const defaultFormatterFunction = require('./lib/default/formatResults')

function fancy({
	header = '',
	indent = 0,
	body = {},
	dull = false,
	footer = '',
	template = '',
}, formatterFunction = defaultFormatterFunction) {

	const formatFunction = formatter({ header, footer, body, indent, dull, template });

	return {
		formatter: formatFunction,
		output: formatFunction.report(formatterFunction)
	}
}

module.exports = fancy