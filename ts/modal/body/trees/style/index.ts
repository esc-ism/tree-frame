import {DEFAULT_STYLE, ROOT_ID} from './consts';
import updateStylesheet from './update';
import generateCSS from './css';

import {generateTree, ROOTS} from '..';

import type {
    ContrastMethod,
    DefaultStyle, UserStyle,
// TODO Change all type imports to this format
    Leaf as LeafJSON, Middle as MiddleJSON
} from '../../../../validation/types';
import {CONTRAST_METHODS} from '../../../../validation/types';

export function getRoot() {
    return ROOTS[ROOT_ID];
}

// Fill any missing entries
function getFilledStyle(style: DefaultStyle = {}): DefaultStyle {
    return {...DEFAULT_STYLE, ...style}
}

export function getActiveStyle(userStyles: Array<UserStyle>, devStyle?: DefaultStyle): DefaultStyle {
    const activeUserStyle = userStyles.find(({isActive}) => isActive);

    return activeUserStyle ?? getFilledStyle(devStyle);
}

export function toJSON(style: UserStyle): MiddleJSON {
    const filledStyle: UserStyle = {...DEFAULT_STYLE, ...style};
    const toDepthColour: (string) => LeafJSON = value => ({
        'label': 'Depth Color',
        value,
        'input': 'color',
        'predicate': true
    });
    const partLabel = 'Section';
    const categoryLabel = 'Category';

    return {
        'label': 'Name',
        'value': filledStyle.name,
        'predicate': true,
        'children': [
            {
                'label': 'Style Is Active?',
                'value': filledStyle.isActive,
                'predicate': true
            },
            {
                'label': partLabel,
                'value': 'Modal',
                'children': [
                    {
                        'label': 'Font Size (px)',
                        'value': filledStyle.fontSize,
                        'predicate': (value: number): true | string => (value > 0 ? true : 'Font size must be greater than zero')
                    },
                    {
                        'label': 'Outline Color',
                        'value': filledStyle.modalOutline,
                        'input': 'color',
                        'predicate': true
                    }
                ]
            },
            {
                'label': partLabel,
                'value': 'Header',
                'children': [
                    {
                        'label': categoryLabel,
                        'value': 'General',
                        'children': [
                            {
                                'label': 'Base Color',
                                'value': filledStyle.headBase,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Contrast Method',
                                'value': filledStyle.headContrast,
                                'predicate': [...CONTRAST_METHODS]
                            }
                        ]
                    },
                    {
                        'label': categoryLabel,
                        'value': 'Buttons',
                        'children': [
                            {
                                'label': 'Exit Color',
                                'value': filledStyle.headButtonExit,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Label Color',
                                'value': filledStyle.headButtonLabel,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Leaf Color',
                                'value': filledStyle.headButtonLeaf,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Style Color',
                                'value': filledStyle.headButtonStyle,
                                'input': 'color',
                                'predicate': true
                            }
                        ]
                    }
                ]
            },
            {
                'label': partLabel,
                'value': 'Body',
                'children': [
                    {
                        'label': categoryLabel,
                        'value': 'General',
                        'children': [
                            {
                                'label': 'Sub-Part',
                                'value': 'Depth Base Colors',
                                'seed': toDepthColour(DEFAULT_STYLE.nodeBase[0]),
                                'children': filledStyle.nodeBase.map(toDepthColour),
                                'childPredicate': (children) => children.length > 0 ? true : 'At least one color must be provided.'
                            },
                            {
                                'label': 'Contrast Method',
                                'value': filledStyle.nodeContrast,
                                'predicate': [...CONTRAST_METHODS]
                            }
                        ]
                    },
                    {
                        'label': categoryLabel,
                        'value': 'Buttons',
                        'children': [
                            {
                                'label': 'Delete Color',
                                'value': filledStyle.nodeButtonRemove,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Create Color',
                                'value': filledStyle.nodeButtonCreate,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Move Color',
                                'value': filledStyle.nodeButtonMove,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Edit Color',
                                'value': filledStyle.nodeButtonEdit,
                                'input': 'color',
                                'predicate': true
                            }
                        ]
                    },
                    {
                        'label': categoryLabel,
                        'value': 'Miscellaneous',
                        'children': [
                            {
                                'label': 'Show Leaf Separator?',
                                'value': filledStyle.leafShowBorder,
                                'predicate': true
                            },
                            {
                                'label': 'Valid Color',
                                'value': filledStyle.inputValid,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Invalid Color',
                                'value': filledStyle.inputInvalid,
                                'input': 'color',
                                'predicate': true
                            },
                            {
                                'label': 'Tooltip Color',
                                'value': filledStyle.tooltipOutline,
                                'input': 'color',
                                'predicate': true
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

export function toRawStyle(json: MiddleJSON): DefaultStyle {
    const [, modal, header, body] = (json.children as Array<MiddleJSON>).map(({children}) => children) as Array<Array<MiddleJSON>>;
    const [headerGeneral, headerButtons] = header.map(({children}) => children) as Array<Array<MiddleJSON>>;
    const [bodyGeneral, bodyButtons, bodyMisc] = body.map(({children}) => children) as Array<Array<MiddleJSON>>;

    return {
        'fontSize': modal[0].value as number,
        'modalOutline': modal[1].value as string,

        'headBase': headerGeneral[0].value as string,
        'headContrast': headerGeneral[1].value as ContrastMethod,

        'headButtonExit': headerButtons[0].value as string,
        'headButtonLabel': headerButtons[1].value as string,
        'headButtonLeaf': headerButtons[2].value as string,
        'headButtonStyle': headerButtons[3].value as string,

        'nodeBase': bodyGeneral[0].children.map(child => child.value as string),
        'nodeContrast': bodyGeneral[1].value as ContrastMethod,

        'nodeButtonRemove': bodyButtons[0].value as string,
        'nodeButtonCreate': bodyButtons[1].value as string,
        'nodeButtonMove': bodyButtons[2].value as string,
        'nodeButtonEdit': bodyButtons[3].value as string,

        'leafShowBorder': bodyMisc[0].value as boolean,
        'inputValid': bodyMisc[1].value as string,
        'inputInvalid': bodyMisc[2].value as string,
        'tooltipOutline': bodyMisc[3].value as string
    };
}

// For returning updated styles to the userscript
export function getUserStyles(): Array<UserStyle> {
    const {'children': styleNodes} = getRoot().getJSON();
    const styles: Array<UserStyle> = [];

    for (const json of styleNodes as Array<MiddleJSON>) {
        styles.push({
            'isActive': json.value as boolean,
            'name': json.children[0].value as string,
            ...toRawStyle(json)
        });
    }

    return styles;
}

export default function generate(userStyles: Array<UserStyle>, devStyle?: DefaultStyle) {
    generateCSS();

    const defaultStyle = getFilledStyle(devStyle);

    return generateTree({
        'children': userStyles.map(toJSON),
        'seed': toJSON({
            'isActive': false,
            'name': 'New Style',
            ...DEFAULT_STYLE
        }),
        'descendantPredicate': (styleNodes: Array<MiddleJSON>): true | string => {
            const activeStyles: Array<MiddleJSON> = styleNodes.filter(({'children': [{value}]}) => value);

            switch (activeStyles.length) {
                case 0:
                    updateStylesheet(defaultStyle);

                    return true;

                case 1:
                    updateStylesheet(toRawStyle(activeStyles[0]));

                    return true;

                default:
                    return 'Only one color scheme may be active at a time.';
            }
        }
    }, ROOT_ID);
}
