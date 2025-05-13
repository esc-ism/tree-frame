// Basic types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | number | string;

// For predicates, return values can be any type;
//  promises get awaited
//  strings, thrown errors and rejected promises indicate failure & get presented to users
//  otherwise, truthy values indicate success and falsy values indicate failure
export type ChildCallback = (value: Value) => unknown;
export type ParentCallback = (children: Array<MiddleArg | LeafArg>) => unknown;

export interface Listeners {
	[name: string]: (event: Event) => unknown;
}

export type Getter = (self: RootArg | MiddleArg | LeafArg, config: Array<unknown>) => unknown;

export const INPUT_FORMATS = ['color', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'] as const;
export type Input = typeof INPUT_FORMATS[number];

export const CONTRAST_METHODS = ['Black / White', 'Invert'] as const;
export type ContrastMethod = typeof CONTRAST_METHODS[number];

export interface DefaultStyle {
	width?: number;
	height?: number;
	
	fontSize?: number;
	
	borderTooltip?: string;
	borderModal?: string;
	
	headBase?: string;
	headContrast?: ContrastMethod;
	
	headButtonExit?: string;
	headButtonLabel?: string;
	headButtonSticky?: string;
	headButtonStyle?: string;
	headButtonHide?: string;
	headButtonAlt?: string;
	
	nodeHeaderBase?: string;
	nodeBlendBase?: string;
	nodeValueBase?: string;
	nodeContrast?: ContrastMethod;
	
	nodeButtonCreate?: string;
	nodeButtonDuplicate?: string;
	nodeButtonMove?: string;
	nodeButtonDisable?: string;
	nodeButtonDelete?: string;
	
	validBackground?: string;
	invalidBackground?: string;
	focusBackground?: string;
}

export interface UserStyle extends DefaultStyle {
	name: string;
	isActive?: boolean;
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
	// Called after the node is modified
	listeners?: Listeners;
	// Derives a config from the node
	get?: Getter;
	// Used by update functions to hide nodes
	hideId?: number;
	// Attributes applied to the input element
	inputAttributes?: object;
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
	// Derives a config from the node
	get?: Getter;
}

// Key categories

export const SAVED_KEYS = ['label', 'value', 'isActive', 'children'];
export const ROOT_PREDICATE_KEYS = ['childPredicate', 'descendantPredicate'] as const;
export const ROOT_UPDATE_KEYS = ['onChildUpdate', 'onDescendantUpdate'] as const;
export const ROOT_OTHER_KEYS = ['children', 'seed', 'poolId', 'get'] as const;

// Node types

// hacky code to avoid a duplicate "get" in MIDDLE_KEYS
const _LEAF_KEYS = ['label', 'value', 'predicate', 'options', 'input', 'isActive', 'onUpdate', 'listeners', 'hideId', 'inputAttributes'];

export const LEAF_KEYS = [..._LEAF_KEYS, 'get'] as const;
export const ROOT_KEYS = [...ROOT_PREDICATE_KEYS, ...ROOT_UPDATE_KEYS, ...ROOT_OTHER_KEYS] as const;
export const MIDDLE_KEYS = [..._LEAF_KEYS, ...ROOT_KEYS] as const;

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

// Config type

export const PAGE_KEYS = ['title', 'defaultTree', 'userTree', 'defaultStyle', 'userStyles'];

export interface Page {
	title: string;
	defaultTree: Root;
	userTree?: Root;
	defaultStyle?: DefaultStyle;
	userStyles: Array<UserStyle>;
}
