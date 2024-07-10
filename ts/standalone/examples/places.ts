import type {Config, Middle} from '@types';

const year = (new Date()).getFullYear();

const yearPredicate = (value: number): true | string => {
	if (value < 0) {
		return 'Value must be positive';
	}
	
	if (Math.floor(value) !== value) {
		return 'Value must be an integer';
	}
	
	if (year < value) {
		return `Value must not be greater than ${year}`;
	}
	
	return true;
};

const emptyStringPredicate = (value: string): true | string => {
	return value !== '' || 'Please provide a value';
};

function getPerson(
	name = '*name*',
	occupation = '*occupation*',
	birthYear = 0,
	hairColour = '#3B2D25',
	eyeColour = '#3c75e2',
	hasChildren = true,
): Middle {
	return {
		label: 'Name',
		value: name,
		predicate: emptyStringPredicate,
		children: [
			{
				label: 'Occupation',
				value: occupation,
				predicate: emptyStringPredicate,
			},
			{
				label: 'Birth Year (AD)',
				value: birthYear,
				predicate: yearPredicate,
			},
			{
				label: 'Hair Colour',
				value: hairColour,
				input: 'color',
			},
			{
				label: 'Eye Colour',
				value: eyeColour,
				input: 'color',
			},
			{
				label: 'Has Children?',
				value: hasChildren,
			},
		],
	};
}

function getMedia(
	title = '*title*',
	type = '*type*',
	releaseYear = 0,
	description = '*description*',
): Middle {
	return {
		label: 'Title',
		value: title,
		predicate: emptyStringPredicate,
		children: [
			{
				label: 'Media Type',
				value: type,
				options: ['*type*', 'Movie', 'TV Show', 'Song', 'Album'],
			},
			{
				label: 'Release Year (AD)',
				value: releaseYear,
				predicate: yearPredicate,
			},
			{
				label: 'Description',
				value: description,
				predicate: emptyStringPredicate,
			},
		],
	};
}

const config: Config = {
	title: 'Pop Atlas',
	defaultTree: {
		children: [
			{
				label: 'Location',
				value: 'The UK',
				predicate: emptyStringPredicate,
				children: [
					{
						label: 'Famous People',
						seed: getPerson(),
						children: [getPerson('William Shakespeare', 'Playwright', 1564, '#1b0600', '#391b00')],
					},
					{
						label: 'Famous Media',
						seed: getMedia(),
						children: [
							getMedia('Doctor Who', 'TV Show', 1963, 'A time-travelling alien struggles to cope with constantly saving the world, even on their days off.'),
							getMedia('The Wicker Man', 'Movie', 1973, 'Cultists exact a contrived scheme to ritualistically sacrifice a policeman.'),
						],
					},
				],
			},
		],
		seed: {
			label: 'Location',
			value: '*location*',
			predicate: emptyStringPredicate,
			children: [
				{
					label: 'Famous People',
					seed: getPerson(),
					children: [],
				},
				{
					label: 'Famous Media',
					seed: getMedia(),
					children: [],
				},
			],
		},
	},
	userStyles: [],
	defaultStyle: {
		borderTooltip: '#7f0000',
		nodeBase: ['#000000', '#0a2400', '#0c3700', '#0d4800'],
	},
};

export default config;
