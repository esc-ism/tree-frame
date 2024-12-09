import {FOCUS_CLASS} from './focus/consts';
import {isActive as _isFocus} from './focus';

import type Root from '@nodes/root';
import type Middle from '@nodes/middle';
import type Child from '@nodes/child';

import {element as scrollElement} from '@/modal/body';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

function getLastDescendant(node: Child | Middle, isFocus = _isFocus()): Child | Middle {
	return ('children' in node && (!isFocus || node.element.hasClass(FOCUS_CLASS))) ? getLastDescendant(node.children[node.children.length - 1], isFocus) : node;
}

// a scrollIntoView replacement for sticky positioning
export function stickyScroll(node: Root | Child, doSnap: boolean = true, alignToTop: boolean = true) {
	if (!('parent' in node)) {
		if (alignToTop) {
			scrollElement.scrollTop = 0;
		}
		
		return;
	}
	
	const {height} = node.element.headContainer.getBoundingClientRect();
	const firstChild = alignToTop ? node : getLastDescendant(node);
	
	let scroll = 0;
	
	for (let child: any = firstChild; 'parent' in child; child = child.parent) {
		if (child.element.hasClass(FOCUS_CLASS) || child === child.parent.children[0]) {
			continue;
		}
		
		const {top: base} = child.parent.element.elementContainer.getBoundingClientRect();
		const {top} = child.element.elementContainer.getBoundingClientRect();
		
		scroll += top - base - height;
	}
	
	if (alignToTop) {
		scrollElement.scrollTo({top: Math.ceil(scroll + 1), behavior: doSnap ? 'auto' : 'smooth'});
		
		return;
	}
	
	scroll += height * (firstChild.depth - node.depth);
	
	if (scrollElement.scrollTop > scroll) {
		scrollElement.scrollTop = Math.ceil(scroll + 1);
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
