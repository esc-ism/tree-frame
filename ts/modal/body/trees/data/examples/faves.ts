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
            return 'A non-integer favourite number? That\'s cheating.';
        }

        if (value < 0) {
            return 'A negative favourite number? I don\'t buy it.';
        }

        return true;
    }
};

function favePredicate(name: string, children: Array<Child>) {
    if (children.length === 0) {
        return `Come on, everyone has a favourite ${name}!`;
    }

    if (children.length > 5) {
        return `Six favourite ${name}s!? Let\'s not get carried away.`;
    }

    return true;
}

const config: Config = {
    'title': 'My Favourite Things',
    'tree': {
        'children': [
            {
                'label': 'Category',
                'value': 'Favourite Colours',
                'childPredicate': favePredicate.bind(null, 'colour'),
                'children': [colourSeed],
                'seed': colourSeed
            },
            {
                'label': 'Category',
                'value': 'Favourite Numbers',
                'childPredicate': (children) => {
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
    'userStyles': [],
    'defaultStyle': {
        'headBase': '#eeff00',
        'headContrast': 'Black / White',
        'headButtonExit': '#f10000',
        'headButtonLabel': '#7a4800',
        'headButtonLeaf': '#3bac21',
        'headButtonStyle': '#ff75da',
        'nodeBase': ['#381700', '#2f3000'],
        'nodeContrast': 'Invert',
        'leafShowBorder': true,
        'nodeButtonRemove': '#ff0000',
        'nodeButtonCreate': '#15ff00',
        'nodeButtonMove': '#9000ff',
        'nodeButtonEdit': '#00bbd1',
    }
};

export default config;
