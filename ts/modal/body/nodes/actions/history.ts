import {getStickyScroll} from './scroll';
import {reset as resetFocus} from './focus';
import {setActive as highlight} from './highlight';

import {element as scrollElement} from '@/modal/body';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

import {getSocket, getDocument} from '@/modal';

const undoStack = [];
const redoStack = [];

export function register(target, undo, redo, doAct = true, isUndoDeletion = false, isRedoDeletion = false) {
	if (doAct) {
		redo();
	}
	
	redoStack.length = 0;
	
	undoStack.push({target, undo: {act: undo, isDeletion: isUndoDeletion}, redo: {act: redo, isDeletion: isRedoDeletion}});
}

function show(node) {
	const target = node.element.headContainer;
	
	if (!target.isSameNode(getDocument().activeElement)) {
		target.addEventListener('focusin', (event) => {
			event.stopImmediatePropagation();
		}, {capture: true, once: true});
	}
	
	target.focus({preventScroll: true});
	
	const targetRect = target.getBoundingClientRect();
	const scrollRect = scrollElement.getBoundingClientRect();
	
	const top = isSticky() ? getStickyScroll(node) : (targetRect.top - scrollRect.top + scrollElement.scrollTop);
	
	if (top < scrollElement.scrollTop) {
		scrollElement.scrollTo({top: top, behavior: 'smooth'});
		
		return;
	}
	
	const bottom = targetRect.top - scrollRect.top + scrollElement.scrollTop + targetRect.height - scrollElement.clientHeight;
	
	if (bottom > scrollElement.scrollTop) {
		scrollElement.scrollTo({top: bottom, behavior: 'smooth'});
	}
}

function act(from, to, property) {
	if (from.length === 0) {
		return;
	}
	
	const action = from.pop();
	
	resetFocus();
	
	if (action[property].isDeletion) {
		const index = action.target.getIndex();
		const target = index === 0 ? action.target.parent : action.target.parent.children[index - 1];
		
		action[property].act();
		
		show(target);
	} else {
		action[property].act();
		
		highlight(action.target);
		
		show(action.target);
	}
	
	to.push(action);
}

export function onMount() {
	getSocket().addEventListener('keydown', (event) => {
		if (event.key === 'Undo' || (event.code === 'KeyZ' && event.ctrlKey)) {
			act(undoStack, redoStack, 'undo');
		} else if (event.key === 'Redo' || (event.code === 'KeyY' && event.ctrlKey)) {
			act(redoStack, undoStack, 'redo');
		}
	});
}
