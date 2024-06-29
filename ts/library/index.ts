import validate, {hasOwnProperty} from './validation';

import type {Config} from '@types';

import start from '../modal';

import {SOCKET_ID} from '../consts';

import {setRootId} from '../modal/css';
import {reset} from '../modal/body';

import {setCallback as setOnClose} from '@/modal/header/actions/close';

let socket: HTMLElement;

async function init(config: unknown, _socket: HTMLElement, idPostfix: string) {
	socket = _socket;
	
	socket.id = `${SOCKET_ID}-${idPostfix}`;
	
	setRootId(socket.id);
	
	try {
		await validate(config);
		
		start(config as Config, _socket);
		
		// Config is valid
		return {
			requireReset: false,
			tree: (config as Config).userTree ?? (config as Config).defaultTree,
		};
	} catch (error) {
		if (typeof config !== 'object' || !hasOwnProperty(config, 'userTree')) {
			throw error;
		}
		
		delete config.userTree;
		
		await validate(config);
		
		start(config as Config, socket);
		
		// Config is valid with userTree removed
		return {
			requireReset: true,
			tree: (config as Config).defaultTree,
			error,
		};
	}
}

function edit() {
	socket.focus();
	
	return new Promise((resolve) => {
		setOnClose(resolve);
	});
}

export {init, reset, edit};
