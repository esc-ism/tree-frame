import type {Value} from '../../types';

import type {Handler} from '../handlers/utils';

// Node groups

export interface ValueHolder {
    label: String;
    value: Value;

    setValue: (value: Value) => void;
}

export interface Internal {
    element: HTMLElement;
    valueElement: HTMLElement;
}

export interface Middle extends Internal {
    disconnect(): void;
    attach(parent: Internal, index?: number): void;

    relocationHandler: Handler;
    modificationHandler: Handler;
    deletionHandler: Handler;
}

// Nodes

export interface Leaf extends ValueHolder {
}

export interface Inner extends Middle, ValueHolder {
    creationHandler: Handler;
}

export interface Outer extends Middle, ValueHolder {
}

export interface Root extends Internal {
    element: HTMLElement;
    valueElement: HTMLElement;

    creationHandler: Handler;
}
