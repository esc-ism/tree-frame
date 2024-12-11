import {FOCUS_CLASS} from './focus/consts';
import {isActive as _isFocus} from './focus';

import type Root from '@nodes/root';
import type Middle from '@nodes/middle';
import type Child from '@nodes/child';

import {element as scrollElement} from '@/modal/body';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

function getLastDescendant(node: Child | Middle, isFocus = _isFocus(), depth = 0): [Child | Middle, number] {
	if ('children' in node && (!isFocus || node.element.hasClass(FOCUS_CLASS))) {
		return getLastDescendant(node.children[node.children.length - 1], isFocus, depth + 1);
	}
	
	return [node, depth];
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
	const [firstChild, depth] = alignToTop ? [node, 0] : getLastDescendant(node);
	
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
		scrollElement.scrollTo({top: scroll, behavior: doSnap ? 'auto' : 'smooth'});
		
		return;
	}
	
	scroll += (height - 0.6) * depth;
	
	if (scrollElement.scrollTop > scroll) {
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
