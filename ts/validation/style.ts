import type {Root, Middle} from './types';

function getDefault(): Middle {
    return {
        'label': 'Name',
        'value': 'New Style',
        'predicate': true,
        'children': [
            {
                'label': 'Is Active',
                'value': false,
                'predicate': true
            },
            {
                'label': 'Mode',
                'value': 'Dark',
                'predicate': ['Light', 'Dark']
            },
            {
                'label': 'Category',
                'value': 'General',
                'predicate': false,
                'children': [
                    {
                        'label': 'Font Size (px)',
                        'value': 18,
                        'predicate': (value: number): boolean => value > 0
                    }
                ]
            },
            {
                'label': 'Category',
                'value': 'Menu Buttons',
                'predicate': false,
                'children': [
                    {
                        'label': 'Exit Button Color',
                        'value': '#aa0000',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Help Button Color',
                        'value': '#007997',
                        'input': 'color',
                        'predicate': true
                    }
                ]
            },
            {
                'label': 'Category',
                'value': 'Node Buttons',
                'predicate': false,
                'children': [
                    {
                        'label': 'Fill Color',
                        'value': '#000',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Delete Color',
                        'value': '#ff0000',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Create Color',
                        'value': '#ffff00',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Edit Color',
                        'value': '#7cfc00',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Move Color',
                        'value': '#70c2db',
                        'input': 'color',
                        'predicate': true
                    }
                ]
            },
            {
                'label': 'Category',
                'value': 'Light-Mode Colors',
                'predicate': false,
                'children': [
                    {
                        'label': 'Background Color',
                        'value': '#bbb',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Font Color',
                        'value': '#000',
                        'input': 'color',
                        'predicate': true
                    }
                ]
            },
            {
                'label': 'Category',
                'value': 'Dark-Mode Colors',
                'predicate': false,
                'children': [
                    {
                        'label': 'Background Color',
                        'value': '#000',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Font Color',
                        'value': '#fff',
                        'input': 'color',
                        'predicate': true
                    }
                ]
            },
            {
                'label': 'Category',
                'value': 'Miscellaneous',
                'predicate': false,
                'children': [
                    {
                        'label': 'Valid Color',
                        'value': '#D9FFC0',
                        'input': 'color',
                        'predicate': true
                    },
                    {
                        'label': 'Invalid Color',
                        'value': '#FFB4BE',
                        'input': 'color',
                        'predicate': true
                    }
                ]
            }
        ]

    };
}

function hasMaxOneActive(children: Array<Middle>): boolean {
    let foundOneActive = false;

    for (const {'children': [{'value': isActive}]} of children) {
        if (isActive) {
            if (foundOneActive) {
                return false;
            }

            foundOneActive = true;
        }
    }

    return true;
}

const config: Root = {
    'children': [],
    'ancestorPredicate': (children: Array<Middle>): true | string =>
        hasMaxOneActive(children) ? true : 'Only one color scheme may be active at a time.',
    'seed': getDefault()
};

export default config;
