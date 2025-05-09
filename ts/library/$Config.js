import {SOCKET_ID} from '../consts';

import {init, edit} from './index';
import {reset} from '../modal/body';

const PATCHES = [
	(node) => {
		delete node.predicate;
		delete node.childPredicate;
		delete node.descendantPredicate;
		delete node.seed;
	},
	(node) => {
		delete node.input;
	},
];

const KEY_VERSION_CONFIG = 'TREE_FRAME_VERSION';
const KEY_VERSION_SCRIPT = 'SCRIPT_VERSION';
const KEY_STYLES = 'TREE_FRAME_USER_STYLES';

const STYLE_OUTER_DEFAULTS = {
	position: 'fixed',
	top: '0',
	height: '100vh',
	width: '100vw',
};

export default class $Config {
	constructor(treeKey, defaultTree, {defaultStyle = {}, outerStyle = {}, patches = []} = {}) {
		// PERMISSION CHECKS
		
		const getError = (reason, error) => {
			const message = `[${GM.info.script.name}]${reason.includes('\n') ? '\n\n' : ' '}${reason}`;
			
			if (error) {
				error.message = message;
				
				return error;
			}
			
			return new Error(message);
		};
		
		if (typeof GM.getValue !== 'function') {
			throw getError('Missing GM.getValue permission.');
		}
		
		if (typeof GM.setValue !== 'function') {
			throw getError('Missing GM.setValue permission.');
		}
		
		if (typeof treeKey !== 'string' || !(/^[a-z_][a-z0-9_]*$/i.test(treeKey))) {
			throw getError(`'${treeKey}' is not a valid storage key.`);
		}
		
		// PRIVATE
		
		const displayStyle = outerStyle.display ?? 'initial';
		
		const target = (() => {
			let targetWindow = window;
			
			while (targetWindow.frameElement) {
				targetWindow = window.parent;
			}
			
			const id = `${SOCKET_ID}-${treeKey}`;
			
			for (const child of targetWindow.document.body.children) {
				if (child.id === id) {
					child.remove();
					
					break;
				}
			}
			
			const target = document.createElement('iframe');
			
			target.id = id;
			
			for (const [property, value] of Object.entries({...STYLE_OUTER_DEFAULTS, ...outerStyle})) {
				target.style[property] = value;
			}
			
			target.style.display = 'none';
			
			targetWindow.document.body.appendChild(target);
			
			return target;
		})();
		
		let isOpen = false;
		
		const open = (doOpen = true) => new Promise((resolve) => {
			isOpen = doOpen;
			
			target.style.display = doOpen ? displayStyle : 'none';
			
			// Delay script execution until visual update
			setTimeout(resolve, 0);
		});
		
		const disconnect = () => new Promise((resolve) => {
			isOpen = false;
			
			target.remove();
			
			// Delay script execution until visual update
			setTimeout(resolve, 0);
		});
		
		// PUBLIC
		
		this.ready = Promise.all([
			GM.getValue(treeKey),
			GM.getValue(KEY_STYLES, []),
			GM.getValue(KEY_VERSION_CONFIG, -1),
			GM.getValue(KEY_VERSION_SCRIPT, 0),
		])
			// Retrieve data
			.then(([userTree, userStyles, configVersion, scriptVersion]) => {
				// Patch to current version
				
				(() => {
					if (!userTree) {
						return;
					}
					
					// patch to make configVersion start from 0 instead of -1
					if (configVersion < 2) {
						configVersion++;
					}
					
					if (configVersion < PATCHES.length) {
						const patchAllNodes = (doPatch, node = userTree) => {
							doPatch(node);
							
							if ('children' in node) {
								for (const child of node.children) {
									patchAllNodes(doPatch, child);
								}
							}
						};
						
						for (let i = configVersion; i < PATCHES.length; ++i) {
							patchAllNodes(PATCHES[i]);
						}
					}
					
					for (let i = scriptVersion; i < patches.length; ++i) {
						patches[i](userTree);
					}
				})();
				
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
					
					await GM.deleteValue(treeKey);
					
					// It may have previously been a rejected promise
					this.ready = () => Promise.resolve();
					
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
					
					const {tree, config, styles} = await edit();
					
					GM.setValue(treeKey, tree);
					GM.setValue(KEY_STYLES, styles);
					GM.setValue(KEY_VERSION_CONFIG, PATCHES.length);
					GM.setValue(KEY_VERSION_SCRIPT, patches.length);
					
					this.get = ((config) => config).bind(null, Object.freeze(config));
					
					await open(false);
				};
				
				// Pass data
				
				return init({
					userStyles,
					defaultTree,
					title: GM.info.script.name,
					defaultStyle,
					...(userTree ? {userTree} : {}),
				}, target.contentDocument.body, target.contentWindow);
			})
			.catch(async (error) => {
				delete this.reset;
				
				await disconnect();
				
				throw getError(
					'Your config is invalid.'
					+ '\nThis could be due to a script update or your data being corrupted.'
					+ `\n\nReason:\n${error.message.replaceAll(/\n+/g, '\n')}`,
					error,
				);
			})
			.then((response) => {
				this.get = ((config) => config).bind(null, Object.freeze(response.config));
				
				if (response.requireReset) {
					throw getError(
						'Your config is invalid.'
						+ '\nThis could be due to a script update or your data being corrupted.'
						+ `\n\nReason:\n${response.error.message.replaceAll(/\n+/g, '\n')}`,
						response.error,
					);
				}
			});
	}
}
