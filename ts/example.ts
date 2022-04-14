import {Config} from './validation/types';

const config: Config = {
    'title': 'An Example Title for an Example Tree',
    'data': {
        'children': [
            {
                'label': 'Category',
                'value': 'Favourite Colours',
                'parentPredicate': ({length}) => {
                    if (length === 0) {
                        return 'Come on, everyone has a favourite colour!';
                    }

                    if (length > 5) {
                        return 'Six favourite colours!? That\'s going a bit too far.';
                    }

                    return true;
                },
                'children': [
                    {
                        'label': 'Number',
                        'value': '#1c8c00',
                        'predicate': true,
                        'input': 'color'
                    }
                ],
                'seed': {
                    'label': 'Number',
                    'value': '#1c8c00',
                    'predicate': true,
                    'input': 'color'
                }
            },
            {
                'label': 'Category',
                'value': 'Favourite Numbers',
                'parentPredicate': (children) => {
                    if (children.length === 0) {
                        return 'Come on, everyone has a favourite number!';
                    }

                    if (children.length > 5) {
                        return 'Six favourite numbers!? That\'s going a bit too far.';
                    }

                    if (children.map(({value}) => value).join('') === '80085') {
                        return 'I don\'t think so kid.';
                    }

                    return true;
                },
                'children': [
                    {
                        'label': 'Number',
                        'value': 29,
                        'predicate': (value: number) => {
                            if (Math.floor(value) !== value) {
                                return 'A non-integer favourite number? Nice try punk.';
                            }

                            return true;
                        }
                    }
                ],
                'seed': {
                    'label': 'Number',
                    'value': 29,
                    'predicate': (value: number) => {
                        if (Math.floor(value) !== value) {
                            return 'A non-integer favourite number? Nice try punk.';
                        }

                        return true;
                    }
                }
            }
        ]
    },
    'userStyles': []
};

export default config;
