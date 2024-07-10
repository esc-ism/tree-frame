import {DEFAULT_STYLE, ROOT_ID} from './consts';
import generateCSS from './css';
import updateStylesheet from './update';

import {generateTree, ROOTS} from '..';

import type {
	ContrastMethod,
	DefaultStyle, UserStyle,
	// TODO Change all type imports to this format
	Leaf as _Leaf, Middle as _Middle,
} from '@types';
import {CONTRAST_METHODS} from '@types';

export function getRoot() {
	return ROOTS[ROOT_ID];
}

// Fill any missing entries
function getFilledStyle(style: DefaultStyle = {}): DefaultStyle {
	return {...DEFAULT_STYLE, ...style};
}

export function getActiveStyle(userStyles: Array<UserStyle>, devStyle?: DefaultStyle): DefaultStyle {
	const activeUserStyle = userStyles.find(({isActive}) => isActive);
	
	return activeUserStyle ?? getFilledStyle(devStyle);
}

export function toJSON(style: UserStyle): _Middle {
	const filledStyle: UserStyle = {...DEFAULT_STYLE, ...style};
	const toDepthColour: (string) => _Leaf = (value) => ({value, input: 'color'});
	
	return {
		label: 'Name',
		value: filledStyle.name,
		children: [
			{
				label: 'Style Is Active?',
				value: filledStyle.isActive,
			},
			{
				label: 'Modal',
				children: [
					{
						label: 'Font Size (px)',
						value: filledStyle.fontSize,
						predicate: (value: number): true | string =>
							value > 0 ? true : 'Font size must be greater than zero',
					},
					{
						label: 'Border Color',
						value: filledStyle.borderModal,
						input: 'color',
					},
				],
			},
			{
				label: 'Header',
				children: [
					{
						label: 'General',
						children: [
							{
								label: 'Base Color',
								value: filledStyle.headBase,
								input: 'color',
							},
							{
								label: 'Contrast Method',
								value: filledStyle.headContrast,
								options: [...CONTRAST_METHODS],
							},
						],
					},
					{
						label: 'Buttons',
						children: [
							{
								label: 'Exit Color',
								value: filledStyle.headButtonExit,
								input: 'color',
							},
							{
								label: 'Label Color',
								value: filledStyle.headButtonLabel,
								input: 'color',
							},
							{
								label: 'Style Color',
								value: filledStyle.headButtonStyle,
								input: 'color',
							},
							{
								label: 'Hide Color',
								value: filledStyle.headButtonHide,
								input: 'color',
							},
							{
								label: 'Alt Buttons Color',
								value: filledStyle.headButtonAlt,
								input: 'color',
							},
						],
					},
				],
			},
			{
				label: 'Body',
				children: [
					{
						label: 'General',
						children: [
							{
								label: 'Depth Base Colors',
								seed: toDepthColour(DEFAULT_STYLE.nodeBase[0]),
								children: filledStyle.nodeBase.map(toDepthColour),
								childPredicate: (children: Array<object>): true | string =>
									children.length > 0 ? true : 'At least one color must be provided.',
							},
							{
								label: 'Contrast Method',
								value: filledStyle.nodeContrast,
								options: [...CONTRAST_METHODS],
							},
						],
					},
					{
						label: 'Buttons',
						children: [
							{
								label: 'Create Color',
								value: filledStyle.nodeButtonCreate,
								input: 'color',
							},
							{
								label: 'Duplicate Color',
								value: filledStyle.nodeButtonDuplicate,
								input: 'color',
							},
							{
								label: 'Move Color',
								value: filledStyle.nodeButtonMove,
								input: 'color',
							},
							{
								label: 'Disable Color',
								value: filledStyle.nodeButtonDisable,
								input: 'color',
							},
							{
								label: 'Delete Color',
								value: filledStyle.nodeButtonDelete,
								input: 'color',
							},
						],
					},
					{
						label: 'Miscellaneous',
						children: [
							{
								label: 'Valid Color',
								value: filledStyle.validBackground,
								input: 'color',
							},
							{
								label: 'Invalid Color',
								value: filledStyle.invalidBackground,
								input: 'color',
							},
							{
								label: 'Tooltip Color',
								value: filledStyle.borderTooltip,
								input: 'color',
							},
						],
					},
				],
			},
		],
	};
}

export function toRawStyle(json: _Middle): DefaultStyle {
	const [, modal, header, body] = (json.children as Array<_Middle>).map(({children}) => children) as Array<Array<_Middle>>;
	const [headerGeneral, headerButtons] = header.map(({children}) => children) as Array<Array<_Middle>>;
	const [bodyGeneral, bodyButtons, bodyMisc] = body.map(({children}) => children) as Array<Array<_Middle>>;
	
	return {
		fontSize: modal[0].value as number,
		borderModal: modal[1].value as string,
		
		headBase: headerGeneral[0].value as string,
		headContrast: headerGeneral[1].value as ContrastMethod,
		
		headButtonExit: headerButtons[0].value as string,
		headButtonLabel: headerButtons[1].value as string,
		headButtonStyle: headerButtons[2].value as string,
		headButtonHide: headerButtons[3].value as string,
		headButtonAlt: headerButtons[4].value as string,
		
		nodeBase: bodyGeneral[0].children
			.filter(({isActive}) => isActive)
			.map((child) => child.value as string),
		nodeContrast: bodyGeneral[1].value as ContrastMethod,
		
		nodeButtonCreate: bodyButtons[0].value as string,
		nodeButtonDuplicate: bodyButtons[1].value as string,
		nodeButtonMove: bodyButtons[2].value as string,
		nodeButtonDisable: bodyButtons[3].value as string,
		nodeButtonDelete: bodyButtons[4].value as string,
		
		validBackground: bodyMisc[0].value as string,
		invalidBackground: bodyMisc[1].value as string,
		borderTooltip: bodyMisc[2].value as string,
	};
}

// For returning updated styles to the userscript
export function getUserStyles(): Array<UserStyle> {
	const {'children': styleNodes} = getRoot().getJSON();
	const styles: Array<UserStyle> = [];
	
	for (const json of styleNodes as Array<_Middle>) {
		styles.push({
			name: json.value as string,
			isActive: json.children[0].value as boolean,
			...toRawStyle(json),
		});
	}
	
	return styles;
}

export default function generate(userStyles: Array<UserStyle>, devStyle?: DefaultStyle): HTMLElement {
	generateCSS();
	
	const defaultStyle = getFilledStyle(devStyle);
	
	return generateTree({
		children: userStyles.map(toJSON),
		seed: toJSON({
			name: 'New Style',
			isActive: false,
			...defaultStyle,
		}),
		descendantPredicate: (styles: Array<_Middle>): true | string => {
			let count = 0;
			
			for (const {isActive, children: [{value}]} of styles) {
				if (isActive && value && ++count > 1) {
					return 'Only one color scheme may be active at a time.';
				}
			}
			
			return true;
		},
		onDescendantUpdate: (styles) => {
			for (const style of (styles as Array<_Middle>)) {
				if (style.isActive && style.children[0].value) {
					updateStylesheet(toRawStyle(style));
					
					return;
				}
			}
			
			updateStylesheet(defaultStyle);
		},
	}, ROOT_ID);
}
