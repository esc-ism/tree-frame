import {Config, Middle} from '../../../../../validation/types';

const yearPredicate = (value: number): true | string => {
    if (value < 0) {
        return 'Value must be positive';
    }

    if (Math.floor(value) !== value) {
        return 'Value must be an integer';
    }

    return true;
};

const emptyStringPredicate = (value: string): true | string => {
    if (value === '') {
        return 'Please provide a value';
    }

    return true;
};

function getPerson(
    name = '*name*',
    occupation = '*occupation*',
    birthYear = 0,
    hairColour = '#3B2D25',
    eyeColour = '#3c75e2'
): Middle {
    return {
        'label': 'Name',
        'value': name,
        'predicate': (value) => value !== '',
        'children': [
            {
                'label': 'Occupation',
                'value': occupation,
                'predicate': emptyStringPredicate,
            },
            {
                'label': 'Birth Year (AD)',
                'value': birthYear,
                'predicate': yearPredicate
            },
            {
                'label': 'Hair Colour',
                'value': hairColour,
                'predicate': emptyStringPredicate,
                'input': 'color',
            },
            {
                'label': 'Eye Colour',
                'value': eyeColour,
                'predicate': emptyStringPredicate,
                'input': 'color',
            },
            {
                'label': 'Has Children',
                'value': true,
                'predicate': true,
            },
        ]
    };
}

function getMedia(
    title = '*title*',
    type = '*type*',
    releaseYear = 0,
    description = '*description*'
): Middle {
    return {
        'label': 'Title',
        'value': title,
        'predicate': emptyStringPredicate,
        'children': [
            {
                'label': 'input',
                'value': type,
                'predicate': ['*type*', 'Movie', 'TV Show', 'Song', 'Album'],
            },
            {
                'label': 'Release Year (AD)',
                'value': releaseYear,
                'predicate': yearPredicate
            },
            {
                'label': 'Description',
                'value': description,
                'predicate': emptyStringPredicate,
            },
        ]
    };
}

const config: Config = {
    'title': 'Fame Atlas',
    'data': {
        'children': [
            {
                'label': 'Location',
                'value': 'The UK',
                'predicate': emptyStringPredicate,
                'children': [
                    {
                        'label': 'Category',
                        'value': 'Famous People',
                        'predicate': false,
                        'seed': getPerson(),
                        'children': [
                            getPerson('William Shakespeare', 'Playwright', 1564, '#1b0600', '#391b00'),
                        ]
                    },
                    {
                        'label': 'Category',
                        'value': 'Famous Media',
                        'predicate': false,
                        'seed': getMedia(),
                        'children': [
                            getMedia('Doctor Who', 'TV Show', 1963, 'A time-travelling alien struggles to cope with constantly saving the world, even on their days off.'),
                            getMedia('The Wicker Man', 'Movie', 1973, 'Cultists exact a contrived scheme to ritualistically sacrifice a policeman.'),
                        ]
                    },
                ]
            },
        ],
        'seed': {
            'label': 'Location',
            'value': '*location*',
            'predicate': emptyStringPredicate,
            'children': [
                {
                    'label': 'Category',
                    'value': 'Famous People',
                    'predicate': false,
                    'seed': getPerson(),
                    'children': []
                },
                {
                    'label': 'Category',
                    'value': 'Famous Media',
                    'predicate': false,
                    'seed': getMedia(),
                    'children': []
                }
            ],
        }
    },
    'userStyles': []
}

export default config;
