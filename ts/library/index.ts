import validate, {hasOwnProperty} from './validation';

import type {Page} from '@types';

import start, {getSocket} from '../modal';

import {getSaveData} from '../modal/body/data';

import {setCallback as setOnClose} from '../modal/header/actions/close';

export {reset} from '../modal/body';

export async function init(page: unknown, socket: HTMLElement, targetWindow: Window = window) {
	const response: any = {};
	
	try {
		await validate(page);
		
		start(page as Page, socket, targetWindow);
		
		// Config is valid
		response.requireReset = false;
	} catch (error) {
		if (typeof page !== 'object' || !hasOwnProperty(page, 'userTree')) {
			throw error;
		}
		
		delete page.userTree;
		
		// Test validity after reset
		await validate(page);
		
		start(page as Page, socket, targetWindow);
		
		response.requireReset = true;
		response.error = error;
	}
	
	return {...response, ...getSaveData()};
}

export function edit() {
	getSocket().focus();
	
	return new Promise((resolve) => {
		setOnClose(resolve);
	});
}
