import type {Root, UserStyle, DefaultStyle} from '../../ts/library/validation/types';

import CONFIG_0 from '../../ts/standalone/examples/faves';
import CONFIG_1 from '../../ts/standalone/examples/riddle';
import CONFIG_2 from '../../ts/standalone/examples/places';

type Configs = {
	TITLES: Array<string>;
	TREES: Array<Root>;
	USER_STYLES: Array<Array<UserStyle>>;
	DEV_STYLES: Array<DefaultStyle>;
};

export const VALID: Configs = {
	TITLES: ['YouTube Sub Feed Filter'],
	TREES: [
		// 0
		{children: [{}]},
		// 1
		{
			children: [
				{
					label: '_',
					value: '_',
					children: [
						{
							label: '_',
							value: '_',
						},
					],
					seed: {
						label: '_',
						value: '_',
					},
				},
			],
		},
		// 2
		{
			children: [
				{
					label: '_',
					value: '_',
					children: [
						{
							label: '_',
							value: '1',
						},
					],
					seed: {
						label: '_',
						value: '_',
					},
				},
			],
		},
		// 3
		{
			children: [
				{
					label: '_',
					value: '_',
					children: [
						{
							label: '_',
							value: '1',
						},
						{
							label: '_',
							value: '2',
						},
					],
					seed: {
						label: '_',
						value: '_',
					},
				},
			],
		},
		// 4
		{
			children: [
				{
					label: '_',
					value: false,
				},
				{
					label: '_',
					value: 1,
				},
				{
					label: '_',
					value: '2',
				},
			],
		},
		// 5
		{
			children: [],
			seed: {
				label: '_',
				value: '_',
				children: [],
				seed: {
					label: '_',
					value: '_',
					children: [
						{
							label: '_',
							value: '_',
							predicate: ['_'],
						},
					],
					seed: {
						label: '_',
						value: '_',
						predicate: ['_'],
					},
					childPredicate: () => true,
				},
			},
		},
		// 6
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: [() => false, '_'],
				},
			],
		},
		// 7
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: [() => false, () => true],
				},
			],
		},
		// 8
		{
			children: [
				{
					label: '_',
					value: '_',
					poolId: 1,
					children: [],
				},
			],
			seed: {
				label: '_',
				value: '|',
				poolId: 1,
				children: [],
			},
			poolId: 0,
			descendantPredicate: ([{value}]) => value === '_',
			childPredicate: ({length}) => length === 1,
		},
	],
	USER_STYLES: [[]],
	DEV_STYLES: [
		{
			fontSize: 18,
			headBase: '#ff0000',
			headButtonExit: '#000000',
			headButtonLabel: '#2432ff',
			headButtonStyle: '#ffd500',
			headContrast: 'Black / White',
			validBackground: '#d9ffc0',
			invalidBackground: '#ffb4be',
			borderModal: '#ffffff',
			nodeBase: ['#e8e8e8', '#ffffff'],
			nodeButtonCreate: '#a000cc',
			nodeButtonMove: '#00a0d1',
			nodeButtonDelete: '#d10000',
			nodeContrast: 'Black / White',
			borderTooltip: '#570000',
		},
	],
};

for (const {title, defaultTree, defaultStyle} of [CONFIG_0, CONFIG_1, CONFIG_2]) {
	VALID.TITLES.push(title);
	VALID.TREES.push(defaultTree);
	VALID.DEV_STYLES.push(defaultStyle);
}

export const INVALID = {
	TITLES: [
		// Unexpected type
		true,
		1,
		{},
		[],
		// Empty
		'',
	],
	TREES: [
		// Unexpected type
		'',
		true,
		1,
		[],
		// Missing property
		{seed: VALID.TREES[0]},
		// Unexpected property type
		{
			children: {
				label: '_',
				value: '_',
			},
		},
		{
			children: [
				{
					label: '_',
					value: '_',
				},
			],
			seed: [],
		},
		{
			children: [
				{
					label: '_',
					value: '_',
				},
			],
			seed: [
				{
					label: '_',
					value: '_',
				},
			],
		},
		{
			children: [
				{
					label: 1,
					value: '_',
				},
			],
		},
		{
			children: [
				{
					label: '_',
					value: () => '_',
				},
			],
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: '_',
				},
			],
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: true,
				},
			],
		},
		{
			children: [],
			seed: '_',
		},
		// Predicate fail
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: () => false,
				},
			],
		},
		{
			...VALID.TREES[0],
			childPredicate: () => false,
		},
		{
			...VALID.TREES[0],
			descendantPredicate: () => false,
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: ['|'],
				},
			],
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: [() => false],
				},
			],
		},
		// Seed match fail
		{
			children: [
				{
					label: '_',
					value: '_',
				},
			],
			seed: {
				label: '_',
				value: '_',
				predicate: () => true,
			},
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: () => true,
				},
			],
			seed: {
				label: '_',
				value: '_',
			},
		},
		{
			children: [
				{
					label: '_',
					value: 1,
					predicate: () => true,
				},
			],
			seed: {
				label: '_',
				value: '1',
				predicate: () => true,
			},
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: ['_', '|'],
				},
			],
			seed: {
				label: '_',
				value: '_',
				predicate: ['_', '/'],
			},
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					children: [],
				},
			],
			seed: {
				label: '_',
				value: '_',
				children: [],
				seed: {
					label: '_',
					value: '_',
				},
			},
		},
		// Pool errors
		{
			children: [
				{
					label: '_',
					value: '_',
					poolId: 0,
				},
			],
			poolId: 0,
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					poolId: 0,
				},
			],
			seed: {
				label: '_',
				value: '_',
				poolId: 1,
			},
		},
		{
			children: [
				{
					label: '_',
					value: '_',
					poolId: 1.5,
				},
			],
		},
	],
	USER_STYLES: [
		// Unexpected type
		'',
		true,
		1,
		{},
		// Missing property
		[{}],
		[{name: '_'}],
		[{isValid: true}],
		// Unexpected property type
		[
			{
				...VALID.USER_STYLES[0],
				name: 1,
			},
		],
		[
			{
				...VALID.USER_STYLES[0],
				isValid: 1,
			},
		],
	],
	DEV_STYLES: [
		// Unexpected type
		'',
		true,
		1,
		[],
		// Unexpected property
		{name: '_'},
		{isActive: false},
	],
};
