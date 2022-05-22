import type {Config, Middle} from '../../../../../validation/types';

const NAMES = ['Shield', 'Gladiator', 'Lion'];

let mistakes = 0;

function getRegister(children) {
    const register = [false, false, false];

    for (const {label, isActive} of children) {
        if (isActive) {
            register[NAMES.indexOf(label)] = true;
        }
    }

    return register;
}

const config: Config = {
    'title': 'Move Everything to the Goal!',
    'defaultTree': {
        'children': [
            {
                'label': 'Start',
                'poolId': 0,
                'children': [
                    {'label': NAMES[0]},
                    {'label': NAMES[1]},
                    {'label': NAMES[2]}
                ]
            },
            {
                'label': 'Bandit\'s Camp',
                'children': [],
                'poolId': 0,
                'childPredicate': (children) => {
                    const register = getRegister(children);

                    if (register[2]) {
                        mistakes++;

                        return `The ${NAMES[2].toLowerCase()} can't enter the bandit camp!`;
                    }

                    if (!register[0] && register[1]) {
                        mistakes++;

                        return `The ${NAMES[1].toLowerCase()} can't enter the bandit camp without a ${NAMES[0].toLowerCase()}!`;
                    }

                    return true;
                }
            },
            {
                'label': 'Goal',
                'children': [],
                'poolId': 0,
                'childPredicate': (children) => {
                    if (children.filter(({isActive}) => isActive).length === 3) {
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
                const register = getRegister(children);

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
