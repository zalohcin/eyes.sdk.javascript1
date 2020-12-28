const formatter = require('./lib/formatter');

function fancy({
	header = '',
	indent = 0,
	body = {},
	dull = false,
	footer = '',
	template = '',
	formatterFunction = require('./lib/default/formatResults')
}) {

	const formatFunction = formatter({ header, footer, body, formatterFunction, indent, dull, template });

	return {
		formatter: formatFunction,
		output: formatFunction.report()
	}
}

module.exports = fancy