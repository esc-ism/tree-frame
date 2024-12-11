import type {Styles} from '@/modal/css';
import {addVariables, registerStyleNode} from '@/modal/css';

import type {DefaultStyle, ContrastMethod} from '@types';

const styleNode = document.createElement('style');

registerStyleNode(styleNode);

function getContrast(hex: string, method: ContrastMethod): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	
	switch (method) {
		case 'Black / White': {
			// https://stackoverflow.com/a/3943023/112731
			const luminosity = r * 0.299 + g * 0.587 + b * 0.114;
			
			return luminosity > 145 ? 'black' : 'white';
		}
	}
	
	const toHexPart = (rgb) => {
		const x = (255 - rgb).toString(16);
		
		return x.length === 2 ? x : `0${x}`;
	};
	
	return `#${toHexPart(r)}${toHexPart((g))}${toHexPart(b)}`;
}

export default function updateStylesheet({fontSize, width, height, headContrast, nodeContrast, ...colours}: DefaultStyle) {
	for (let i = styleNode.sheet.cssRules.length - 1; i >= 0; --i) {
		styleNode.sheet.deleteRule(i);
	}
	
	const variables: Styles = Object.entries(colours).map(
		([property, value]: [string, string]): [string, string] => [`--${property}`, value],
	);
	
	variables.push(
		['--fontSize', `${fontSize}px`],
		['--width', `${width}%`],
		['--height', `${height}%`],
	);
	
	variables.push(['--nodeHeaderContrast', getContrast(colours.nodeHeaderBase, nodeContrast)]);
	variables.push(['--nodeBlendContrast', getContrast(colours.nodeBlendBase, nodeContrast)]);
	variables.push(['--nodeValueContrast', getContrast(colours.nodeValueBase, nodeContrast)]);
	variables.push(['--headContrast', getContrast(colours.headBase, headContrast)]);
	
	addVariables(variables, styleNode);
}
