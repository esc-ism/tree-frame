import {Config, Middle} from '../../../../../validation/types';

const NAMES = [
    'Shield',
    'Gladiator',
    'Lion'
];

const label = 'Entity';

let mistakes = 0;

const config: Config = {
    'title': 'Move Everything to the Goal!',
    'defaultTree': {
        'children': [
            {
                'label': 'Location',
                'value': 'Start',
                'poolId': 0,
                'children': [
                    {
                        label,
                        'value': NAMES[0]
                    },
                    {
                        label,
                        'value': NAMES[1]
                    },
                    {
                        label,
                        'value': NAMES[2]
                    }
                ]
            },
            {
                'label': 'Location',
                'value': 'Bandit\'s Camp',
                'children': [],
                'poolId': 0,
                'childPredicate': (children) => {
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
                'poolId': 0,
                'childPredicate': (children) => {
                    if (children.length === 3) {
                        // Wait for the element to move
                        window.setTimeout(
                            () => window.alert('You win!\n\n' + (
                                mistakes === 0 ? 'Perfect clear!' :
                                    `You made ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`
                            )), 1
                        );
                    }

                    return true;
                }
            }
        ],
        'descendantPredicate': (locations: Array<Middle>) => {
            for (const {children} of locations) {
                const register = [false, false, false];

                for (const {value} of children) {
                    register[NAMES.indexOf(value as string)] = true;
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

            return true;
        }
    },
    'userStyles': [],
    'defaultStyle': {
        'fontSize': 20
    }
};

export default config;
