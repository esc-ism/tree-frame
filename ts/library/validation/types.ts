// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | number | string;

export type ChildCallback = ((value: Value) => unknown);
export type ParentCallback = ((children: Array<Child>) => unknown);

export const INPUT_FORMATS = ['color', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'] as const;
export type Input = typeof INPUT_FORMATS[number];

export const CONTRAST_METHODS = ['Black / White', 'Invert'] as const;
export type ContrastMethod = typeof CONTRAST_METHODS[number];

export interface DefaultStyle {
	fontSize?: number;
	borderTooltip?: string;
	
	borderModal?: string;
	
	headBase?: string;
	headContrast?: ContrastMethod;
	
	headButtonExit?: string;
	headButtonLabel?: string;
	headButtonStyle?: string;
	headButtonHide?: string;
	headButtonAlt?: string;
	
	nodeBase?: Array<string>;
	nodeContrast?: ContrastMethod;
	
	nodeButtonCreate?: string;
	nodeButtonDuplicate?: string;
	nodeButtonMove?: string;
	nodeButtonDisable?: string;
	nodeButtonDelete?: string;
	
	validBackground?: string;
	invalidBackground?: string;
}

export interface UserStyle extends DefaultStyle {
	name: string;
	isActive: boolean;
}

// Group types

export interface _Child {
	// The node's purpose
	label?: string;
	// The node's data
	value?: Value;
	// Valid values (will override predicate)
	options?: Array<Value>;
	// A data validator
	predicate?: ChildCallback;
	// Indicates a preferred input type
	input?: Input;
	// Indicates whether the data should ignored or not
	isActive?: boolean;
	// Called after the node is modified
	onUpdate?: ChildCallback;
}

export interface _Parent {
	// The node's children
	children: Array<Child>;
	// A node that can be added to children
	seed?: Child;
	// Children may be moved between nodes with poolId values that match their parent's
	poolId?: number;
	// Checked before a child is modified
	childPredicate?: ParentCallback;
	// Checked before a descendant is modified
	descendantPredicate?: ParentCallback;
	// Called after a child is modified
	onChildUpdate?: ParentCallback;
	// Called after a descendant is modified
	onDescendantUpdate?: ParentCallback;
}

// Node types

export const LEAF_KEYS = ['label', 'value', 'predicate', 'input', 'isActive', 'onUpdate'] as const;
export const ROOT_KEYS = ['children', 'seed', 'poolId', 'childPredicate', 'descendantPredicate', 'onChildUpdate', 'onDescendantUpdate'] as const;
export const MIDDLE_KEYS = [...LEAF_KEYS, ...ROOT_KEYS] as const;

export interface Leaf extends _Child {
}

export interface Root extends _Parent {
}

export interface Middle extends _Child, _Parent {
}

// Saved data info

export const SAVED_KEYS = ['label', 'value', 'isActive'];

export const SCHEMA_KEYS = [...ROOT_KEYS, ...LEAF_KEYS.filter((key) => !SAVED_KEYS.includes(key))];

// Node unions

export type Child = Middle | Leaf;
export type Parent = Root | Middle;
export type Node = Root | Child;

// Config type

export const CONFIG_KEYS = ['title', 'defaultTree', 'userTree', 'defaultStyle', 'userStyles'];

export interface Config {
	title: string;
	defaultTree: Root;
	userTree?: Root;
	defaultStyle?: DefaultStyle;
	userStyles: Array<UserStyle>;
}
