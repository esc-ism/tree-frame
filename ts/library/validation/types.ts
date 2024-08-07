// Basic types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | number | string;

// For predicates, return values can be any type;
//  promises get awaited
//  strings, thrown errors and rejected promises indicate failure & get presented to users
//  otherwise, truthy values indicate success and falsy values indicate failure
export type ChildCallback = (value: Value) => unknown;
export type ParentCallback = (children: ParentCallbackArg) => unknown;

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

interface _ChildArg {
	// The node's purpose
	label?: string;
	// The node's data
	value?: Value;
	// Indicates whether the data should ignored or not
	isActive?: boolean;
}

interface _ParentArg {
	// The node's children
	children: Array<_ChildArg>;
}

export interface _Child extends _ChildArg {
	// Valid values (will override predicate)
	options?: Array<Value>;
	// A data validator
	predicate?: ChildCallback;
	// Indicates a preferred input type
	input?: Input;
	// Called after the node is modified
	onUpdate?: ChildCallback;
}

export interface _Parent extends _ParentArg {
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

// Key categories

export const SAVED_KEYS = ['label', 'value', 'isActive', 'children'];
export const ROOT_PREDICATE_KEYS = ['childPredicate', 'descendantPredicate'] as const;
export const ROOT_UPDATE_KEYS = ['onChildUpdate', 'onDescendantUpdate'] as const;
export const ROOT_OTHER_KEYS = ['children', 'seed', 'poolId'] as const;

// Node types

export const LEAF_KEYS = ['label', 'value', 'predicate', 'options', 'input', 'isActive', 'onUpdate'] as const;
export const ROOT_KEYS = [...ROOT_PREDICATE_KEYS, ...ROOT_UPDATE_KEYS, ...ROOT_OTHER_KEYS] as const;
export const MIDDLE_KEYS = [...LEAF_KEYS, ...ROOT_KEYS] as const;

export interface Leaf extends _Child {}
export interface Root extends _Parent {}
export interface Middle extends _Child, _Parent {}

export interface LeafArg extends _ChildArg {}
export interface MiddleArg extends _ChildArg, _ParentArg {}
export interface RootArg extends _ParentArg {}

// Node unions

export type Child = Middle | Leaf;
export type Parent = Root | Middle;
export type Node = Root | Child;

type ParentCallbackArg = Array<MiddleArg | LeafArg>;

// Config type

export const CONFIG_KEYS = ['title', 'defaultTree', 'userTree', 'defaultStyle', 'userStyles'];

export interface Config {
	title: string;
	defaultTree: Root;
	userTree?: Root;
	defaultStyle?: DefaultStyle;
	userStyles: Array<UserStyle>;
}
