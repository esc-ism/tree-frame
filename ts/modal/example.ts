import {Config, Middle} from '../validation/types';

function getPerson(
    name = '*name*',
    occupation = '*occupation*',
    birthYear = 0,
    hairColour = '*colour*',
    eyeColour = '*colour*'
): Middle {
    return {
        'label': 'Name',
        'value': name,
        'predicate': (value) => value !== '',
        'children': [
            {
                'label': 'Occupation',
                'value': occupation,
                'predicate': (value) => value !== '',
            },
            {
                'label': 'Birth Year (AD)',
                'value': birthYear,
                'predicate': (value: number): boolean => value >= 0 && Math.floor(value) === value,
            },
            {
                'label': 'Hair Colour',
                'value': hairColour,
                'predicate': (value) => value !== '',
                'input': 'color',
            },
            {
                'label': 'Eye Colour',
                'value': eyeColour,
                'predicate': (value) => value !== '',
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
        'predicate': (value) => value !== '',
        'children': [
            {
                'label': 'input',
                'value': type,
                'predicate': ['*type*', 'Movie', 'TV Show', 'Song', 'Album'],
            },
            {
                'label': 'Release Year (AD)',
                'value': releaseYear,
                'predicate': (value: number): boolean => value >= 0 && Math.floor(value) === value,
            },
            {
                'label': 'Description',
                'value': description,
                'predicate': (value) => value !== '',
            },
        ]
    };
}

const config: Config = {
    'title': 'An Example Title for an Example Tree',
    'data': {
        'children': [
            {
                'label': 'Location',
                'value': 'The UK',
                'predicate': (value) => value !== '',
                'children': [
                    {
                        'label': 'Category',
                        'value': 'Famous People',
                        'predicate': false,
                        'seed': getPerson(),
                        'children': [
                            getPerson('William Shakespeare', 'Playwright', 1564, 'Brown?', 'Brown'),
                        ]
                    },
                    {
                        'label': 'Category',
                        'value': 'Famous Media',
                        'predicate': false,
                        'seed': getMedia(),
                        'children': [
                            getMedia('Doctor Who', 'TV Show', 1963, 'A genderless, time-travelling alien struggles to cope with constantly saving the world, even on their days off.'),
                            getMedia('The Wicker Man', 'Movie', 1973, 'Cultists exact a contrived scheme to ritualistically sacrifice a policeman.'),
                            getMedia('How Soon Is Now?', 'Song', 1985, 'The Smiths\' manifestation of loneliness.'),
                        ]
                    },
                ]
            },
        ],
        'seed': {
            'label': 'Location',
            'value': '*location*',
            'predicate': (value) => value !== '',
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
    }
}

export default config;
