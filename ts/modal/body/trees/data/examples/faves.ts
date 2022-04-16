import {Config, Child} from '../../../../../validation/types';

const colourSeed: Child = {
    'label': 'Colour',
    'value': '#1c8c00',
    'predicate': true,
    'input': 'color'
};

const numberSeed: Child = {
    'label': 'Number',
    'value': 29,
    'predicate': (value: number) => {
        if (Math.floor(value) !== value) {
            return 'A non-integer favourite number? I don\'t buy it.';
        }

        return true;
    }
};

function favePredicate(name: string, children: Array<Child>) {
    if (children.length === 0) {
        return `Come on, everyone has a favourite ${name}!`;
    }

    if (children.length > 5) {
        return `'Six favourite ${name}s!? Let\'s not get carried away.'`;
    }

    return true;
}

const config: Config = {
    'title': 'My Favourite Things',
    'dataTree': {
        'children': [
            {
                'label': 'Category',
                'value': 'Favourite Colours',
                'parentPredicate': favePredicate.bind(null, 'colour'),
                'children': [colourSeed],
                'seed': colourSeed
            },
            {
                'label': 'Category',
                'value': 'Favourite Numbers',
                'parentPredicate': (children) => {
                    if (children.map(({value}) => value).join('') === '80085') {
                        return 'Ha ha. Very funny.';
                    }

                    return favePredicate('number', children);
                },
                'children': [numberSeed],
                'seed': numberSeed
            }
        ]
    },
    'userStyleForest': []
};

export default config;
