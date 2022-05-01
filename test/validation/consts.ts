import type {Root, UserStyle, DefaultStyle} from '../../ts/validation/types';

import CONFIG_0 from '../../ts/modal/body/trees/data/examples/faves';
import CONFIG_1 from '../../ts/modal/body/trees/data/examples/riddle';
import CONFIG_2 from '../../ts/modal/body/trees/data/examples/places';

type Configs = {
    TITLES: Array<string>,
    TREES: Array<Root>,
    USER_STYLES: Array<Array<UserStyle>>,
    DEV_STYLES: Array<DefaultStyle>
}

export const VALID: Configs = {
    'TITLES': [
        'YouTube Sub Feed Filter'
    ],
    'TREES': [
        {
            'children': [{
                'label': '_',
                'value': '_',
                'children': [{
                    'label': '_',
                    'value': '_'
                }],
                'seed': {
                    'label': '_',
                    'value': '_'
                }
            }]
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'children': [{
                    'label': '_',
                    'value': '1',
                    'predicate': true
                }],
                'seed': {
                    'label': '_',
                    'value': '_',
                    'predicate': true
                }
            }]
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'children': [
                    {
                        'label': '_',
                        'value': '1',
                        'predicate': true
                    },
                    {
                        'label': '_',
                        'value': '2',
                        'predicate': true
                    }
                ],
                'seed': {
                    'label': '_',
                    'value': '_',
                    'predicate': true
                }
            }]
        },
        {
            'children': [
                {
                    'label': '_',
                    'value': false
                },
                {
                    'label': '_',
                    'value': 1
                },
                {
                    'label': '_',
                    'value': '2'
                }
            ]
        },
        {
            'children': [],
            'seed': {
                'label': '_',
                'value': '_',
                'children': [],
                'seed': {
                    'label': '_',
                    'value': '_',
                    'children': [
                        {
                            'label': '_',
                            'value': '_',
                            'predicate': ['_']
                        }
                    ],
                    'seed': {
                        'label': '_',
                        'value': '_',
                        'predicate': ['_']
                    },
                    'childPredicate': () => true
                }
            }
        },
        {
            'children': [
                {
                    'label': '_',
                    'value': '_',
                    'predicate': true,
                    'poolId': 1,
                    'children': []
                }
            ],
            'seed': {
                'label': '_',
                'value': '|',
                'predicate': true,
                'poolId': 1,
                'children': []
            },
            'poolId': 0,
            'descendantPredicate': ([{value}]) => value === '_',
            'childPredicate': ({length}) => length === 1,
        }
    ],
    'USER_STYLES': [
        []
    ],
    'DEV_STYLES': [
        {
            'fontSize': 18,
            'headBase': '#ff0000',
            'headButtonExit': '#000000',
            'headButtonLabel': '#2432ff',
            'headButtonLeaf': '#0dc700',
            'headButtonStyle': '#ffd500',
            'headContrast': 'Black / White',
            'inputInvalid': '#ffb4be',
            'inputValid': '#d9ffc0',
            'leafShowBorder': true,
            'modalOutline': '#ffffff',
            'nodeBase': ['#e8e8e8', '#ffffff'],
            'nodeButtonCreate': '#a000cc',
            'nodeButtonEdit': '#209400',
            'nodeButtonMove': '#00a0d1',
            'nodeButtonRemove': '#d10000',
            'nodeContrast': 'Black / White',
            'tooltipOutline': '#570000'
        }
    ]
};

for (const {title, tree, defaultStyle} of [CONFIG_0, CONFIG_1, CONFIG_2]) {
    VALID.TITLES.push(title);
    VALID.TREES.push(tree);
    VALID.DEV_STYLES.push(defaultStyle);
}

export const INVALID = {
    'TITLES': [
        // Unexpected type
        true,
        1,
        {},
        [],
        // Empty
        ''
    ],
    'TREES': [
        // Unexpected type
        '',
        true,
        1,
        [],
        // Missing property
        {},
        {'seed': VALID.TREES[0]},
        {'children': []},
        {},
        // Unexpected property type
        {
            'children': {
                'label': '_',
                'value': '_'
            }
        },
        {
            'children': [{
                'label': '_',
                'value': '_'
            }],
            'seed': []
        },
        {
            'children': [{
                'label': '_',
                'value': '_'
            }],
            'seed': [{
                'label': '_',
                'value': '_'
            }]
        },
        {
            'children': [{
                'label': 1,
                'value': '_',
                'predicate': () => false
            }]
        },
        {
            'children': [{
                'label': '_',
                'value': () => '_',
                'predicate': () => false
            }]
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'predicate': 4
            }]
        },
        {
            'children': [],
            'seed': '_'
        },
        {
            'children': [],
            'seed': []
        },
        // Predicate fail
        {
            'children': [{
                'label': '_',
                'value': '_',
                'predicate': () => false
            }]
        },
        {
            ...VALID.TREES[0],
            'childPredicate': () => false
        },
        {
            ...VALID.TREES[0],
            'descendentPredicate': () => false
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'predicate': ['|']
            }]
        },
        // Seed match fail
        {
            'children': [{
                'label': '_',
                'value': '_'
            }],
            'seed': {
                'label': '_',
                'value': '_',
                'predicate': true
            }
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'predicate': true
            }],
            'seed': {
                'label': '_',
                'value': '_'
            }
        },
        {
            'children': [{
                'label': '_',
                'value': 1,
                'predicate': true
            }],
            'seed': {
                'label': '_',
                'value': '1',
                'predicate': true
            }
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'predicate': false
            }],
            'seed': {
                'label': '_',
                'value': '_',
                'predicate': true
            }
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'children': []
            }],
            'seed': {
                'label': '_',
                'value': '_',
                'children': [],
                'seed': {
                    'label': '_',
                    'value': '_',
                }
            }
        },
        // Pool errors
        {
            'children': [{
                'label': '_',
                'value': '_',
                'poolId': 0
            }],
            'poolId': 0
        },
        {
            'children': [{
                'label': '_',
                'value': '_',
                'poolId': 0
            }],
            'seed': {
                'label': '_',
                'value': '_',
                'poolId': 1
            },
        }
    ],
    'USER_STYLES': [
        // Unexpected type
        '',
        true,
        1,
        {},
        // Missing property
        [{}],
        [{
            'name': '_'
        }],
        [{
            'isValid': true
        }],
        // Unexpected property type
        [{
            ...VALID.USER_STYLES[0],
            'name': 1
        }],
        [{
            ...VALID.USER_STYLES[0],
            'isValid': 1
        }]
    ],
    'DEV_STYLES': [
        // Unexpected type
        '',
        true,
        1,
        [],
        // Unexpected property
        {
            'name': '_'
        },
        {
            'isActive': false
        }
    ]
};
