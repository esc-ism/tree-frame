import {STYLESHEET} from './consts';

import {getRuleString} from '../../../css';

import * as dataTypes from '../../../../validation/types';

function getGeneralRuleStrings({
    'children': [fontSize, base, contrast, valid, invalid]
}: dataTypes.Middle) {
    return [
        getRuleString('body', [['font-size', `${fontSize.value}px`]]),

        getRuleString(':root', [
            ['--base', base.value as string],
            ['--contrast', contrast.value as string],
            ['--valid', valid.value as string],
            ['--invalid', invalid.value as string]
        ])
    ];
}

function getModalButtonRuleString({
    'children': [exit, label, leaf, style]
}: dataTypes.Middle) {
    return getRuleString(':root', [
        ['--modalButtonExit', exit.value as string],
        ['--modalButtonLabel', label.value as string],
        ['--modalButtonLeaf', leaf.value as string],
        ['--modalButtonStyle', style.value as string],
    ]);
}

function getNodeButtonRuleString({
    'children': [remove, create, move, edit]
}: dataTypes.Middle) {
    return getRuleString(':root', [
        ['--nodeButtonRemove', remove.value as string],
        ['--nodeButtonCreate', create.value as string],
        ['--nodeButtonMove', move.value as string],
        ['--nodeButtonEdit', edit.value as string]
    ]);
}

function getRuleStrings(style: dataTypes.Middle) {
    const [, general, modalButtons, nodeButtons] = style.children as Array<dataTypes.Middle>;

    return [
        ...getGeneralRuleStrings(general),
        getModalButtonRuleString(modalButtons),
        getNodeButtonRuleString(nodeButtons)
    ];
}

export default function updateStylesheet(activeStyle: dataTypes.Middle) {
    const ruleStrings = getRuleStrings(activeStyle);

    for (let i = STYLESHEET.cssRules.length - 1; i >= 0; --i) {
        STYLESHEET.deleteRule(i);
    }

    for (const rule of ruleStrings) {
        STYLESHEET.insertRule(rule);
    }
}
