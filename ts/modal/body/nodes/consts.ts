export const ROOT_CLASS = 'root';

export const MIDDLE_CLASS = 'middle';

export const ELEMENT_CLASSES = {
	ELEMENT_CONTAINER: 'node',
	BACKGROUND_CONTAINER: 'node-background-container',
	CHILD_CONTAINER: 'node-child-container',
	BUTTON_CONTAINER: 'node-button-container',
	INFO_CONTAINER: 'node-info-container',
	HEAD_CONTAINER: 'node-head-container',
	VALUE_CONTAINER: 'node-value-container',
	VALUE: 'node-value',
	LABEL_CONTAINER: 'node-label-container',
	LABEL: 'node-label',
};

export const BASE_CLASS = 'node-base';

export const CONTRAST_CLASS = 'node-contrast';

export const CHECKBOX_WRAPPER_CLASS = 'checkbox-wrapper';

export const EDITABLE_CLASS = 'editable';

export const NODE_COLOURS: Array<[string, string, string]> = [
	[`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${EDITABLE_CLASS})`, 'var(--nodeHeaderBase)', 'var(--nodeHeaderContrast)'],
	[`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${MIDDLE_CLASS}.${EDITABLE_CLASS}`, 'var(--nodeBlendBase)', 'var(--nodeBlendContrast)'],
	[`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${MIDDLE_CLASS}).${EDITABLE_CLASS}`, 'var(--nodeValueBase)', 'var(--nodeValueContrast)'],
];
