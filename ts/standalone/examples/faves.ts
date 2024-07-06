import type {Config, Child} from '@types';

const colourSeed: Child = {
	value: '#1c8c00',
	input: 'color',
};

const numberSeed: Child = {
	value: 29,
	predicate: (value: number) => {
		if (Math.floor(value) !== value) {
			return 'A non-integer favourite number? That\'s cheating.';
		}
		
		if (value < 0) {
			return 'A negative favourite number? I don\'t buy it.';
		}
		
		return true;
	},
};

function favePredicate(name: string, children: Array<Child>) {
	if (children.filter(({isActive = true}) => isActive).length === 0) {
		return `Come on, everyone has a favourite ${name}!`;
	}
	
	if (children.length > 5) {
		return `Six favourite ${name}s!? Let's not get carried away.`;
	}
	
	return true;
}

const config: Config = {
	title: 'My Favourite Things',
	defaultTree: {
		children: [
			{
				label: 'Favourite Colours',
				childPredicate: favePredicate.bind(null, 'colour'),
				children: [colourSeed],
				seed: colourSeed,
			},
			{
				label: 'Favourite Numbers',
				childPredicate: (children) => {
					if (children.map(({value}) => `${value}`).join('') === '80085') {
						return 'Ha ha. Very funny.';
					}
					
					return favePredicate('number', children);
				},
				children: [numberSeed],
				seed: numberSeed,
			},
		],
	},
	userStyles: [],
	defaultStyle: {
		fontSize: 19,
		headBase: '#0cc0ff',
		headContrast: 'Black / White',
		headButtonExit: '#f10000',
		headButtonLabel: '#563b14',
		headButtonStyle: '#ff75da',
		nodeBase: ['#001946', '#001130'],
		nodeContrast: 'Invert',
		nodeButtonMove: '#9000ff',
		borderTooltip: '#c12d00',
	},
};

export default config;
