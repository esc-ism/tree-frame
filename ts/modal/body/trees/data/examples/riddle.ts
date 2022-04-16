import {Config, Middle} from '../../../../../validation/types';

const NAMES = [
    'Shield',
    'Gladiator',
    'Lion'
];

const label = 'Entity';
const predicate = () => 'No changing the names!';

const seed = {
    label,
    'value': '',
    predicate
};

let mistakes = 0;

const config: Config = {
    'title': 'Move Everything to the Goal!',
    'dataTree': {
        'children': [
            {
                'label': 'Location',
                'value': 'Start',
                'children': [
                    {
                        label,
                        'value': NAMES[0],
                        predicate
                    },
                    {
                        label,
                        'value': NAMES[1],
                        predicate
                    },
                    {
                        label,
                        'value': NAMES[2],
                        predicate
                    }
                ],
                seed
            },
            {
                'label': 'Location',
                'value': 'Bandit\'s Camp',
                'children': [],
                seed,
                'parentPredicate': (children) => {
                    if (children.length > 0) {
                        let foundShield = false;

                        for (const {value} of children) {
                            switch (value) {
                                case NAMES[2]:
                                    mistakes++;

                                    return `The ${NAMES[2].toLowerCase()} can't enter the bandit camp!`;

                                case NAMES[0]:
                                    foundShield = true;
                            }
                        }

                        if (!foundShield) {
                            mistakes++;

                            return `The ${NAMES[1].toLowerCase()} can't enter the bandit camp without a ${NAMES[0].toLowerCase()}!`;
                        }
                    }

                    return true;
                }
            },
            {
                'label': 'Location',
                'value': 'Goal',
                'children': [],
                seed,
                'parentPredicate': (children) => {
                    if (children.length === 3) {
                        window.alert('You win!\n\n' + (mistakes === 0 ? 'Perfect clear!' : `You made ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`));
                    }

                    return true;
                }
            }
        ],
        'ancestorPredicate': (locations: Array<Middle>) => {
            let childCount = 0;

            for (const {children} of locations) {
                const register = [false, false, false];

                for (const {value} of children) {
                    register[NAMES.indexOf(value as string)] = true;

                    childCount++;
                }

                if (!register[0] && register[1] && register[2]) {
                    mistakes++;

                    return `The ${NAMES[1].toLowerCase()} can't be left with the ${NAMES[2].toLowerCase()} without a ${NAMES[0].toLowerCase()}!`;
                }

                if (register[0] && !register[1] && register[2]) {
                    mistakes++;

                    return `The ${NAMES[2].toLowerCase()} will destroy the ${NAMES[0].toLowerCase()} if it's not with the ${NAMES[1].toLowerCase()}!`;
                }
            }

            if (childCount !== 3) {
                return 'No cheating!';
            }

            return true;
        }
    },
    'userStyleForest': []
};

export default config;
