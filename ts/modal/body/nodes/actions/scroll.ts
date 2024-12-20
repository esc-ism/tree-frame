import {FOCUS_CLASS} from './focus/consts';
import {isActive as _isFocus} from './focus';

import type Root from '@nodes/root';
import type Child from '@nodes/child';

import {element as scrollElement} from '@/modal/body';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

import {SUB_PIXEL_BS} from '@/modal/consts';

// specifically returns the last *visible* descendant
function getLastDescendant(node: Root | Child, isFocus = _isFocus()): Child {
	if ('children' in node && node.children.length > 0 && (!isFocus || node.element.hasClass(FOCUS_CLASS))) {
		for (let i = node.children.length - 1; i >= 0; --i) {
			if (node.children[i].element.elementContainer.clientHeight > 0) {
				return getLastDescendant(node.children[i], isFocus);
			}
		}
	}
	
	return node as Child;
}

// a scrollIntoView replacement for sticky positioning
export function getStickyScroll(node: Root | Child, alignToTop: boolean = true): number {
	const firstChild: Root | Child = alignToTop ? node : getLastDescendant(node);
	const {height} = node.element.headContainer.getBoundingClientRect();
	
	let depth = 0;
	
	for (let root = node; 'parent' in root; root = root.parent) {
		depth++;
	}
	
	return Math.ceil(firstChild.element.headContainer.getBoundingClientRect().top
		- scrollElement.getBoundingClientRect().top
		+ scrollElement.scrollTop
		- (height + SUB_PIXEL_BS) * depth);
}

export function stickyScroll(node: Root | Child, doSnap: boolean = true, alignToTop: boolean = true) {
	const scroll = getStickyScroll(node, alignToTop);
	
	if (alignToTop) {
		scrollElement.scrollTo({top: scroll, behavior: doSnap ? 'auto' : 'smooth'});
	} else if (scrollElement.scrollTop > scroll) {
		scrollElement.scrollTop = scroll;
	}
}

export function basicScroll(node: Root | Child) {
	node.element.scrollIntoView({block: 'center'});
}

export function scroll(node: Root | Child) {
	if (isSticky()) {
		stickyScroll(node);
	} else {
		basicScroll(node);
	}
}
