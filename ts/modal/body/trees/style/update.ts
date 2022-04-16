import {STYLESHEET} from './consts';

import {addRule as _addRule} from '../../../css';

import * as dataTypes from '../../../../validation/types';

function addRule(...args: [any, any]) {
    _addRule(...args, STYLESHEET);
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
    'children': [base, contrast]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--baseHead', base.value as string],
        ['--contrastHead', contrast.value as string]
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
    'children': [base, contrast, valid, invalid, tooltip]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--baseBody', base.value as string],
        ['--contrastBody', contrast.value as string],
        ['--valid', valid.value as string],
        ['--invalid', invalid.value as string],
        ['--tooltip', tooltip.value as string]
    ]);
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

function addRuleStrings(style: dataTypes.Middle) {
    const [, modal, header, body] = style.children as Array<dataTypes.Middle>;

    addModalRuleStrings(modal);
    addHeadGeneralRuleStrings(header.children[0] as dataTypes.Middle);
    addHeadButtonRuleStrings(header.children[1] as dataTypes.Middle);
    addBodyGeneralRuleStrings(body.children[0] as dataTypes.Middle);
    addBodyButtonRuleStrings(body.children[1] as dataTypes.Middle);
}

export default function updateStylesheet(activeStyle: dataTypes.Middle) {
    for (let i = STYLESHEET.cssRules.length - 1; i >= 0; --i) {
        STYLESHEET.deleteRule(i);
    }

    addRuleStrings(activeStyle);
}
