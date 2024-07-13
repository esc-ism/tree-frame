import {SOCKET_ID} from '../consts';

import {init, edit} from './index';
import {getTargetWindow} from '../modal/css';
import {reset} from '../modal/body';

const VERSION = 1;

const KEY_VERSION = 'TREE_FRAME_VERSION';

const KEY_STYLES = 'TREE_FRAME_USER_STYLES';

const STYLE_OUTER = {
	position: 'fixed',
	height: '100vh',
	width: '100vw',
};

const getStrippedForest = (children) => {
	const stripped = [];
	
	for (const child of children) {
		if (child.isActive === false) {
			continue;
		}
		
		const data = {};
		
		if ('value' in child) {
			data.value = child.value;
		}
		
		if ('label' in child) {
			data.label = child.label;
		}
		
		if ('children' in child) {
			data.children = getStrippedForest(child.children);
		}
		
		stripped.push(data);
	}
	
	return stripped;
};

export default class $Config {
	constructor(KEY_TREE, TREE_DEFAULT, getConfig, TITLE, STYLE_INNER = {}, _STYLE_OUTER = {}) {
		const getError = (reason, error) => {
			const message = `[${TITLE}]${reason.includes('\n') ? '\n\n' : ' '}${reason}`;
			
			if (error) {
				error.message = message;
				
				return error;
			}
			
			return new Error(message);
		};
		
		// CORE PERMISSION CHECKS
		
		if (typeof GM.getValue !== 'function') {
			throw getError('Missing GM.getValue permission.');
		}
		
		if (typeof GM.setValue !== 'function') {
			throw getError('Missing GM.setValue permission.');
		}
		
		if (typeof KEY_TREE !== 'string' || !(/^[a-z_][a-z0-9_]*$/i.test(KEY_TREE))) {
			throw getError(`'${KEY_TREE}' is not a valid storage key.`);
		}
		
		// PRIVATE STATE
		
		let isOpen = false;
		
		const styleOuter = {
			...STYLE_OUTER,
			..._STYLE_OUTER,
		};
		
		// PUBLIC FUNCTIONS
		
		this.ready = async () => {
			// Setup root element
			const target = (() => {
				const targetWindow = getTargetWindow();
				const id = `${SOCKET_ID}-${KEY_TREE}`;
				
				for (const child of targetWindow.document.body.children) {
					if (child.id === id) {
						child.remove();
						
						break;
					}
				}
				
				const target = document.createElement('div');
				
				target.id = id;
				
				for (const [property, value] of Object.entries(styleOuter)) {
					target.style[property] = value;
				}
				
				target.style.display = 'none';
				
				targetWindow.document.body.appendChild(target);
				
				return target;
			})();
			
			// Retrieve data
			
			const [userTree, userStyles, version] = await Promise.all([
				GM.getValue(KEY_TREE),
				GM.getValue(KEY_STYLES, []),
				GM.getValue(KEY_VERSION, -1),
			]);
			
			// Patch to current version
			
			(() => {
				if (!userTree) {
					return;
				}
				
				switch (version) {
					case -1: {
						const patch = (node) => {
							delete node.predicate;
							delete node.childPredicate;
							delete node.descendantPredicate;
							delete node.seed;
							
							if ('children' in node) {
								for (const child of node.children) {
									patch(child);
								}
							}
						};
						
						patch(userTree);
					}
					
					// eslint-disable-next-line no-fallthrough
					case 0: {
						const patch = (node) => {
							delete node.input;
							
							if ('children' in node) {
								for (const child of node.children) {
									patch(child);
								}
							}
						};
						
						patch(userTree);
					}
				}
			})();
			
			// Listen for post-init communication
			
			const open = (doOpen = true) => new Promise((resolve) => {
				isOpen = doOpen;
				
				target.style.display = doOpen ? (styleOuter.display ?? 'initial') : 'none';
				
				// Delay script execution until visual update
				setTimeout(resolve, 0);
			});
			
			const disconnect = () => new Promise((resolve) => {
				isOpen = false;
				
				target.remove();
				
				// Delay script execution until visual update
				setTimeout(resolve, 0);
			});
			
			/**
			 * @name $Config#reset
			 * @description Deletes the user's data.
			 * @returns {Promise<void>} Resolves upon completing the deletion.
			 */
			this.reset = async () => {
				if (isOpen) {
					throw getError('Cannot reset while the UI is open.');
				}
				
				if (typeof GM.deleteValue !== 'function') {
					throw getError('Missing GM.deleteValue permission.');
				}
				
				try {
					const config = getConfig(getStrippedForest(TREE_DEFAULT));
					
					this.get = () => config;
				} catch (error) {
					throw getError('Unable to parse default config.', error);
				}
				
				await GM.deleteValue(KEY_TREE);
				
				// It may have previously been a rejected promise
				this.ready = Promise.resolve();
				
				reset();
			};
			
			/**
			 * @name $Config#edit
			 * @description Allows the user to edit the active config.
			 * @returns {Promise<void>} Resolves when the user closes the config editor.
			 */
			this.edit = async () => {
				if (isOpen) {
					throw getError('A config editor is already open.');
				}
				
				open();
				
				const {tree, styles} = await edit();
				
				GM.setValue(KEY_TREE, tree);
				GM.setValue(KEY_STYLES, styles);
				GM.setValue(KEY_VERSION, VERSION);
				
				const config = getConfig(tree.children);
				
				this.get = () => config;
				
				await open(false);
			};
			
			// Pass data
			
			try {
				const response = await init({
					userStyles,
					defaultTree: TREE_DEFAULT,
					title: TITLE,
					defaultStyle: STYLE_INNER,
					...(userTree ? {userTree} : {}),
				}, target);
				
				if (response.requireReset) {
					throw getError(
						'Your config is invalid.'
						+ '\nThis could be due to a script update or your data being corrupted.'
						+ `\n\nReason:\n${response.error.message.replaceAll(/\n+/g, '\n')}`,
						response.error,
					);
				}
				
				const config = getConfig(response.tree.children);
				
				this.get = () => config;
			} catch (error) {
				delete this.reset;
				
				await disconnect();
				
				throw getError(
					'Your config is invalid.'
					+ '\nThis could be due to a script update or your data being corrupted.'
					+ `\n\nReason:\n${error.message.replaceAll(/\n+/g, '\n')}`,
					error,
				);
			}
		};
	}
}
