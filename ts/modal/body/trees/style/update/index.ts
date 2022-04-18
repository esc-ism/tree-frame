import {updateDepth} from './depth';

import {addRule as _addRule, generateStylesheet} from '../../../../css';
import type {Selectors, Styles} from '../../../../css';

import * as dataTypes from '../../../../../validation/types';

const STYLESHEET = generateStylesheet();

function addRule(selectors: Selectors, styles: Styles) {
    _addRule(selectors, styles, STYLESHEET);
}

function getContrast(hex: string, method: string): string {
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

function addModalRuleStrings({
    'children': [fontSize, modalOutline]
}: dataTypes.Middle) {
    addRule('body', [['font-size', `${fontSize.value}px`]]);

    addRule(':root', [
        ['--modalOutline', modalOutline.value as string]
    ]);
}

function addHeadGeneralRuleStrings({
    'children': [base, contrastType]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--baseHead', base.value as string],
        ['--contrastHead', getContrast(base.value as string, contrastType.value as string)]
    ]);
}

function addHeadButtonRuleStrings({
    'children': [exit, label, leaf, style]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--modalButtonExit', exit.value as string],
        ['--modalButtonLabel', label.value as string],
        ['--modalButtonLeaf', leaf.value as string],
        ['--modalButtonStyle', style.value as string]
    ]);
}

function addBodyGeneralRuleStrings({
    'children': [base, contrastType, separator]
}: dataTypes.Middle) {
    updateDepth((base as dataTypes.Middle).children.length);

    for (const [depth, colour] of (base as dataTypes.Middle).children.entries()) {
        const inversion = getContrast(colour.value as string, contrastType.value as string);

        addRule(':root', [
            [`--baseBody${depth}`, colour.value as string],
            [`--contrastBody${depth}`, inversion],
            [`--leafGroupSeparator${depth}`, separator.value ? inversion : 'transparent']
        ]);
    }
}

function addBodyButtonRuleStrings({
    'children': [remove, create, move, edit]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--nodeButtonRemove', remove.value as string],
        ['--nodeButtonCreate', create.value as string],
        ['--nodeButtonMove', move.value as string],
        ['--nodeButtonEdit', edit.value as string]
    ]);
}

function addBodyMiscRuleStrings({
    'children': [valid, invalid, tooltip]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--valid', valid.value as string],
        ['--invalid', invalid.value as string],
        ['--tooltip', tooltip.value as string]
    ]);
}

function addRuleStrings(style: dataTypes.Middle) {
    const [, modal, header, body] = style.children as Array<dataTypes.Middle>;

    addModalRuleStrings(modal);

    addHeadGeneralRuleStrings(header.children[0] as dataTypes.Middle);
    addHeadButtonRuleStrings(header.children[1] as dataTypes.Middle);

    addBodyGeneralRuleStrings(body.children[0] as dataTypes.Middle);
    addBodyButtonRuleStrings(body.children[1] as dataTypes.Middle);
    addBodyMiscRuleStrings(body.children[2] as dataTypes.Middle);
}

export default function updateStylesheet(activeStyle: dataTypes.Middle) {
    for (let i = STYLESHEET.cssRules.length - 1; i >= 0; --i) {
        STYLESHEET.deleteRule(i);
    }

    addRuleStrings(activeStyle);
}
