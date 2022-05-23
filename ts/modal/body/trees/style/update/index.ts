import {updateDepth} from './depth';

import {addRule as _addRule, generateStylesheet} from '../../../../css';
import type {Selectors, Styles} from '../../../../css';

import type {DefaultStyle, ContrastMethod} from '../../../../../validation/types';

const STYLESHEET = generateStylesheet();

function addRule(selectors: Selectors, styles: Styles) {
    _addRule(selectors, styles, STYLESHEET);
}

function getContrast(hex: string, method: ContrastMethod): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    switch (method) {
        case 'Black / White':
            // https://stackoverflow.com/a/3943023/112731
            const luminosity = r * 0.299 + g * 0.587 + b * 0.114;

            return luminosity > 145 ? 'black' : 'white';

        default:
            const toHexPart = (rgb) => {
                const x = (255 - rgb).toString(16);

                return x.length === 2 ? x : `0${x}`;
            };

            return `#${toHexPart(r)}${toHexPart((g))}${toHexPart(b)}`;
    }
}

export default function updateStylesheet({
    fontSize, headContrast, nodeBase, nodeContrast, ...colours
}: DefaultStyle) {
    for (let i = STYLESHEET.cssRules.length - 1; i >= 0; --i) {
        STYLESHEET.deleteRule(i);
    }

    updateDepth(nodeBase.length);

    addRule('body', ['font-size', `${fontSize}px`]);

    const colourStyles: Styles = Object.entries(colours).map(
        ([property, value]: [string, string]): [string, string] => [`--${property}`, value]
    );

    for (const [depth, baseColour] of nodeBase.entries()) {
        const contrastColour = getContrast(baseColour, nodeContrast);

        colourStyles.push([`--nodeBase${depth}`, baseColour]);
        colourStyles.push([`--nodeContrast${depth}`, contrastColour]);
    }

    colourStyles.push(['--headContrast', getContrast(colours.headBase, headContrast)]);

    colourStyles.push(['--validFont', getContrast(colours.validBackground, nodeContrast)]);
    colourStyles.push(['--invalidFont', getContrast(colours.invalidBackground, nodeContrast)]);

    addRule(':root', colourStyles);
}
