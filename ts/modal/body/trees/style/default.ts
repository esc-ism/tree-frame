import type {Middle} from '../../../../validation/types';

const style: Middle = Object.freeze({
    'label': 'Name',
    'value': 'New Style',
    'predicate': true,
    'children': [
        {
            'label': 'Style Is Active?',
            'value': false,
            'predicate': true
        },
        {
            'label': 'Segment',
            'value': 'Modal',
            'children': [
                {
                    'label': 'Font Size (px)',
                    'value': 18,
                    'predicate': (value: number): true | string => (value > 0 ? true : 'Font size must be greater than zero')
                },
                {
                    'label': 'Outline Color',
                    'value': '#ffffff',
                    'input': 'color',
                    'predicate': true
                }
            ]
        },
        {
            'label': 'Segment',
            'value': 'Header',
            'children': [
                {
                    'label': 'Header Part',
                    'value': 'General',
                    'children': [
                        {
                            'label': 'Base Color',
                            'value': '#000000',
                            'input': 'color',
                            'predicate': true
                        },
                        {
                            'label': 'Contrast System',
                            'value': 'Black / White',
                            'predicate': ['Black / White', 'Invert']
                        }
                    ]
                },
                {
                    'label': 'Header Part',
                    'value': 'Buttons',
                    'children': [
                        {
                            'label': 'Exit Color',
                            'value': '#f10000',
                            'input': 'color',
                            'predicate': true
                        },
                        {
                            'label': 'Label Color',
                            'value': '#ffd189',
                            'input': 'color',
                            'predicate': true
                        },
                        {
                            'label': 'Leaf Color',
                            'value': '#65ff41',
                            'input': 'color',
                            'predicate': true
                        },
                        {
                            'label': 'Style Color',
                            'value': '#ff75da',
                            'input': 'color',
                            'predicate': true
                        }
                    ]
                }
            ]
        },
        {
            'label': 'Segment',
            'value': 'Body',
            'children': [
                {
                    'label': 'Body Part',
                    'value': 'General',
                    'children': [
                        {
                            'label': 'Sub-Part',
                            'value': 'Depth Base Colors',
                            'seed': {
                                'label': 'Depth Color',
                                'value': '#000000',
                                'input': 'color',
                                'predicate': true
                            },
                            'children': [
                                {
                                    'label': 'Depth Color',
                                    'value': '#000000',
                                    'input': 'color',
                                    'predicate': true
                                }
                            ],
                            'parentPredicate': (children) => children.length > 0 ? true : 'At least one color must be provided.'
                        },
                        {
                            'label': 'Contrast System',
                            'value': 'Black / White',
                            'predicate': ['Black / White', 'Invert']
                        },
                        {
                            'label': 'Show Leaf Separator?',
                            'value': false,
                            'predicate': true
                        },
                    ]
                },
                {
                    'label': 'Body Part',
                    'value': 'Buttons',
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
                },
                {
                    'label': 'Body Part',
                    'value': 'Miscellaneous',
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
                        },
                        {
                            'label': 'Tooltip Color',
                            'value': '#570000',
                            'input': 'color',
                            'predicate': true
                        }
                    ]
                }
            ]
        }
    ]
});

export default style;
