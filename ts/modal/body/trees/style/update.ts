import {STYLESHEET} from './consts';

import {addRule as _addRule} from '../../../css';

import * as dataTypes from '../../../../validation/types';

function addRule(...args: [any, any]) {
    _addRule(...args, STYLESHEET);
}

function addGeneralRuleStrings({
    'children': [fontSize, base, contrast, valid, invalid]
}: dataTypes.Middle) {
        addRule('body', [['font-size', `${fontSize.value}px`]]);

        addRule(':root', [
            ['--base', base.value as string],
            ['--contrast', contrast.value as string],
            ['--valid', valid.value as string],
            ['--invalid', invalid.value as string]
        ]);
}

function addModalButtonRuleString({
    'children': [exit, label, leaf, style]
}: dataTypes.Middle) {
    addRule(':root', [
        ['--modalButtonExit', exit.value as string],
        ['--modalButtonLabel', label.value as string],
        ['--modalButtonLeaf', leaf.value as string],
        ['--modalButtonStyle', style.value as string],
    ]);
}

function addNodeButtonRuleString({
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
    const [, general, modalButtons, nodeButtons] = style.children as Array<dataTypes.Middle>;

    addGeneralRuleStrings(general);
        addModalButtonRuleString(modalButtons);
        addNodeButtonRuleString(nodeButtons);
}

export default function updateStylesheet(activeStyle: dataTypes.Middle) {
    for (let i = STYLESHEET.cssRules.length - 1; i >= 0; --i) {
        STYLESHEET.deleteRule(i);
    }

    addRuleStrings(activeStyle);
}
