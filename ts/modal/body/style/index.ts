import {DEFAULT_STYLE, ROOT_ID} from './consts';
import generateCSS from './css';
import updateStylesheet from './update';

import {generateTree, ROOTS} from '..';

import type {
	ContrastMethod,
	DefaultStyle, UserStyle,
	// TODO Change all type imports to this format
	Middle as _Middle,
} from '@types';
import {CONTRAST_METHODS} from '@types';

export function getRoot() {
	return ROOTS[ROOT_ID];
}

// Fill any missing entries
function getFilledStyle(style: DefaultStyle = {}): DefaultStyle {
	return {...DEFAULT_STYLE, ...style};
}

export function toJSON(style: UserStyle): _Middle {
	const filledStyle: UserStyle = {...DEFAULT_STYLE, ...style};
	
	return {
		label: 'Name',
		value: filledStyle.name,
		isActive: filledStyle.isActive ?? true,
		children: [
			{
				label: 'Modal',
				children: [
					{
						label: 'Width (%)',
						value: filledStyle.width,
						predicate: (value: number): true | string =>
							value > 0 || 'Width must be greater than zero',
					},
					{
						label: 'Height (%)',
						value: filledStyle.height,
						predicate: (value: number): true | string =>
							value > 0 || 'Height must be greater than zero',
					},
					{
						label: 'Font Size (px)',
						value: filledStyle.fontSize,
						predicate: (value: number): true | string =>
							value > 0 || 'Font size must be greater than zero',
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
								label: 'Sticky Color',
								value: filledStyle.headButtonSticky,
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
								label: 'Header Node Color',
								value: DEFAULT_STYLE.nodeHeaderBase,
								input: 'color',
							},
							{
								label: 'Blend Node Color',
								value: DEFAULT_STYLE.nodeBlendBase,
								input: 'color',
							},
							{
								label: 'Value Node Color',
								value: DEFAULT_STYLE.nodeValueBase,
								input: 'color',
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
								label: 'Focus Color',
								value: filledStyle.focusBackground,
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
	const [modal, header, body] = (json.children as Array<_Middle>).map(({children}) => children) as Array<Array<_Middle>>;
	const [headerGeneral, headerButtons] = header.map(({children}) => children) as Array<Array<_Middle>>;
	const [bodyGeneral, bodyButtons, bodyMisc] = body.map(({children}) => children) as Array<Array<_Middle>>;
	
	return {
		width: modal[0].value as number,
		height: modal[1].value as number,
		fontSize: modal[2].value as number,
		
		borderModal: modal[3].value as string,
		
		headBase: headerGeneral[0].value as string,
		headContrast: headerGeneral[1].value as ContrastMethod,
		
		headButtonExit: headerButtons[0].value as string,
		headButtonLabel: headerButtons[1].value as string,
		headButtonSticky: headerButtons[2].value as string,
		headButtonStyle: headerButtons[3].value as string,
		headButtonHide: headerButtons[4].value as string,
		headButtonAlt: headerButtons[5].value as string,
		
		nodeHeaderBase: bodyGeneral[0].value as string,
		nodeBlendBase: bodyGeneral[1].value as string,
		nodeValueBase: bodyGeneral[2].value as string,
		nodeContrast: bodyGeneral[3].value as ContrastMethod,
		
		nodeButtonCreate: bodyButtons[0].value as string,
		nodeButtonDuplicate: bodyButtons[1].value as string,
		nodeButtonMove: bodyButtons[2].value as string,
		nodeButtonDisable: bodyButtons[3].value as string,
		nodeButtonDelete: bodyButtons[4].value as string,
		
		validBackground: bodyMisc[0].value as string,
		invalidBackground: bodyMisc[1].value as string,
		focusBackground: bodyMisc[2].value as string,
		borderTooltip: bodyMisc[3].value as string,
	};
}

// For returning updated styles to the userscript
export function getUserStyles(): Array<UserStyle> {
	const {tree: {'children': styleNodes}} = getRoot().getSaveData();
	
	return styleNodes.map((json) => ({
		name: json.value as string,
		...((json.isActive ?? true) ? {} : {isActive: false}),
		...toRawStyle(json),
	}));
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
		descendantPredicate: (styles: Array<_Middle>): true | string => styles.length <= 1 || 'Only one style may be active at a time.',
		onDescendantUpdate: (styles: Array<_Middle>) => {
			updateStylesheet(styles.length === 0 ? defaultStyle : toRawStyle(styles[0]));
		},
	}, ROOT_ID);
}
