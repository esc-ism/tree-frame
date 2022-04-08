import type {Middle} from '../../../../validation/types';

const style: Middle = Object.freeze({
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
            'label': 'Category',
            'value': 'General',
            'children': [
                {
                    'label': 'Font Size (px)',
                    'value': 18,
                    'predicate': (value: number): boolean => value > 0
                },
                {
                    'label': 'Base Color',
                    'value': '#000000',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Contrast Color',
                    'value': '#bbbbbb',
                    'input': 'color',
                    'predicate': true
                },
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
        },
        {
            'label': 'Category',
            'value': 'Menu Buttons',
            'children': [
                {
                    'label': 'Exit Button Background',
                    'value': '#aa0000',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Label Button Fill',
                    'value': '#9a7b4a',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Label Button Background',
                    'value': '#00000000',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Leaf Button Fill',
                    'value': '#177700',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Leaf Button Background',
                    'value': '#00000000',
                    'input': 'color',
                    'predicate': true
                },
                // Not currently used
                {
                    'label': 'Style Button Fill',
                    'value': '#492609',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Style Button Background',
                    'value': '#00000000',
                    'input': 'color',
                    'predicate': true
                }
            ]
        },
        {
            'label': 'Category',
            'value': 'Node Buttons',
            'children': [
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
                    'label': 'Move Color',
                    'value': '#70c2db',
                    'input': 'color',
                    'predicate': true
                },
                {
                    'label': 'Edit Color',
                    'value': '#7cfc00',
                    'input': 'color',
                    'predicate': true
                }
            ]
        }
    ]
});

export default style;
