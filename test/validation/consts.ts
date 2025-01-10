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
							options: ['_'],
						},
					],
					seed: {
						label: '_',
						value: '_',
						options: ['_'],
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
					options: ['_'],
				},
			],
		},
		// 7
		{
			onChildUpdate: () => null,
			onDescendantUpdate: () => null,
			children: [
				{
					label: '_',
					value: '_',
					options: ['_'],
					predicate: () => false,
					onUpdate: () => null,
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
		// 9
		{
			children: [
				{
					label: '_',
					value: '_',
					options: ['|'],
					predicate: () => true,
				},
			],
		},
		// 10
		(() => {
			const predicate = () => true;
			
			return {
				children: [
					{
						label: '_',
						value: '1',
						predicate,
					},
				],
				seed: {
					label: '_',
					value: '1',
					predicate,
				},
			};
		})(),
	],
	USER_STYLES: [[]],
	DEV_STYLES: [],
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
		// 0
		'',
		// 1
		true,
		// 2
		1,
		// 3
		[],
		// Missing property
		// 4
		{seed: VALID.TREES[0]},
		// Unexpected property type
		// 5
		{
			children: {
				label: '_',
				value: '_',
			},
		},
		// 6
		{
			children: [
				{
					label: '_',
					value: '_',
				},
			],
			seed: [],
		},
		// 7
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
		// 9
		{
			children: [
				{
					label: 1,
					value: '_',
				},
			],
		},
		// 10
		{
			children: [
				{
					label: '_',
					value: () => '_',
				},
			],
		},
		// 11
		{
			children: [
				{
					label: '_',
					value: '_',
					options: '_',
				},
			],
		},
		// 12
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: true,
				},
			],
		},
		// 13
		{
			children: [],
			seed: '_',
		},
		// Predicate fail
		// 14
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: () => false,
				},
			],
		},
		// 15
		{
			...VALID.TREES[0],
			childPredicate: () => false,
		},
		// 16
		{
			...VALID.TREES[0],
			descendantPredicate: () => false,
		},
		// 17
		{
			children: [
				{
					label: '_',
					value: '_',
					options: ['|'],
				},
			],
		},
		// 18
		{
			children: [
				{
					label: '_',
					value: '_',
					predicate: () => false,
				},
			],
		},
		// Seed match fail
		// 19
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
		// 20
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
		// 21
		{
			children: [
				{
					label: '_',
					value: '1',
					predicate: () => true,
				},
			],
			seed: {
				label: '_',
				value: '1',
				predicate: () => true,
			},
		},
		// 22
		{
			children: [
				{
					label: '_',
					value: 1,
				},
			],
			seed: {
				label: '_',
				value: '1',
			},
		},
		// 23
		{
			children: [
				{
					label: '_',
					value: '_',
					options: ['_', '|'],
				},
			],
			seed: {
				label: '_',
				value: '_',
				options: ['_', 'X'],
			},
		},
		// 24
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
		// 25
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
		// 26
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
		// 27
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
