const { countBy, flatMap } = require('lodash');
const isColor = require('is-color');
const isLength = require('is-css-length');

// TODO: Better expanding of background, border
// TODO: box-shadow, text-shadow, outline
const COLOR_PROPS = [
	'color',
	'background-color',
	'border-color',
	'outline-color',
];

const SPACING_PROPS = [
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
];

const isComponent = (name) => name.match(/^[A-Z]/);

const getAllStyles = (instances) =>
	flatMap(instances, (instance) => instance.styles);

module.exports.getElementsStats = function (instances) {
	const elementsOnly = instances.filter(
		(instance) => !isComponent(instance.component)
	);
	return countBy(elementsOnly, (instance) => instance.component);
};

module.exports.getComponentsStats = function (instances) {
	const componentsOnly = instances.filter((instance) =>
		isComponent(instance.component)
	);
	return countBy(componentsOnly, (instance) => instance.component);
};

module.exports.getPropsStats = function (instances) {
	const styles = getAllStyles(instances);
	return countBy(styles, (style) => style.name);
};

module.exports.getValuesStats = function (instances) {
	const styles = getAllStyles(instances);
	return countBy(styles, (style) => style.value);
};

module.exports.getColorsStats = function (instances) {
	const styles = getAllStyles(instances);
	return styles.reduce((colors, { name, value }) => {
		if (COLOR_PROPS.includes(name) && isColor(value)) {
			if (!colors[value]) {
				colors[value] = 0;
			}
			colors[value]++;
		}
		return colors;
	}, {});
};

module.exports.getSpacingStats = function (instances) {
	const styles = getAllStyles(instances);
	return styles.reduce((spacings, { name, value }) => {
		if (SPACING_PROPS.includes(name) && isLength(value)) {
			if (!spacings[value]) {
				spacings[value] = 0;
			}
			spacings[value]++;
		}
		return spacings;
	}, {});
};
