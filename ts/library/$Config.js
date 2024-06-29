import * as $TreeFrame from './index';

const VERSION = 0;

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

const getError = (reason, error) => {
	const message = `[${TITLE}]${reason.includes('\n') ? '\n\n' : ' '}${reason}`;
	
	if (error) {
		error.message = message;
		
		return error;
	}
	
	return new Error(message);
};

/**
 * A node's value.
 * @typedef {boolean | number | string} NodeValue
 */

/**
 * A child node.
 * @typedef {object} ChildNode
 * @property {string} [label] The node's purpose.
 * @property {boolean | number | string} [value] The node's data.
 * @property {Array<NodeValue> | function(NodeValue): boolean | string} [predicate] A data validator.
 * @property {"color" | "date" | "datetime-local" | "email" | "month" | "password" | "search" | "tel" | "text" | "time" | "url" | "week"} [input] The desired input type.
 */

/**
 * A parent node.
 * @typedef {object} ParentNode
 * @property {Array<ChildNode | (ChildNode & ParentNode)>} children The node's children.
 * @property {ChildNode | (ChildNode & ParentNode)} [seed] - A node that may be added to children.
 * @property {function(Array<ChildNode>): boolean | string} [childPredicate] A child validator.
 * @property {function(Array<ChildNode>): boolean | string} [descendantPredicate] A descendant validator.
 * @property {number} [poolId] Children may be moved between nodes with poolId values that match their parent's.
 */

/**
 * A style to pass to the config-editor iFrame.
 * @typedef {object} InnerStyle
 * @property {number} [fontSize] The base font size for the whole frame.
 * @property {string} [borderTooltip] The colour of tooltip borders.
 * @property {string} [borderModal] The colour of the modal's border.
 * @property {string} [headBase] The base colour of the modal's header.
 * @property {'Black / White' | 'Invert'} [headContrast] The method of generating a contrast colour for the modal's header.
 * @property {string} [headButtonExit] The colour of the modal header's exit button.
 * @property {string} [headButtonLabel] The colour of the modal header's exit button.
 * @property {string} [headButtonStyle] The colour of the modal header's style button.
 * @property {string} [headButtonHide] The colour of the modal header's node-hider button.
 * @property {string} [headButtonAlt] The colour of the modal header's alt button.
 * @property {Array<string>} [nodeBase] Base colours for nodes, depending on their depth.
 * @property {'Black / White' | 'Invert'} [nodeContrast] The method of generating a contrast colour for nodes.
 * @property {string} [nodeButtonCreate] The colour of nodes' add-child buttons.
 * @property {string} [nodeButtonDuplicate] The colour of nodes' duplicate buttons.
 * @property {string} [nodeButtonMove] The colour of nodes' move buttons.
 * @property {string} [nodeButtonDisable] The colour of nodes' toggle-active buttons.
 * @property {string} [nodeButtonDelete] The colour of nodes' delete buttons.
 * @property {string} [validBackground] The colour used to show that a node's value is valid.
 * @property {string} [invalidBackground] The colour used to show that a node's value is invalid.
 */

export default class $Config {
	/**
	 * @param {string} KEY_TREE The identifier used to store and retrieve the user's config.
	 * @param {ParentNode} TREE_DEFAULT The tree to use as a starting point for the user's config.
	 * @param {function(Array<ChildNode | (ChildNode & ParentNode)>): *} _getConfig Takes a root node's children and returns the data structure expected by your script.
	 * @param {string} TITLE The heading to use in the config-editor iFrame.
	 * @param {InnerStyle} [STYLE_INNER] A custom style to use as the default
	 * @param {object} [_STYLE_OUTER] CSS to assign to the frame element. e.g. {zIndex: 9999}.
	 */
	constructor(KEY_TREE, TREE_DEFAULT, _getConfig, TITLE, STYLE_INNER = {}, _STYLE_OUTER = {}) {
		// PRIVATE FUNCTIONS
		
		const getConfig = ({children}) => _getConfig(getStrippedForest(children));
		
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
		
		const setConfig = (tree) => {
			const config = getConfig(tree);
			
			this.get = () => config;
		};
		
		this.ready = async () => {
			// Setup root element
			const target = (() => {
				const target = document.createElement('div');
				
				for (const [property, value] of Object.entries(styleOuter)) {
					target.style[property] = value;
				}
				
				target.style.display = 'none';
				
				let targetWindow = window;
				
				while (targetWindow.frameElement) {
					targetWindow = window.parent;
				}
				
				targetWindow.document.body.appendChild(target);
				
				return target;
			})();
			
			// Retrieve data & await frame load
			
			const [userTree, userStyles, version] = await Promise.all([
				GM.getValue(KEY_TREE),
				GM.getValue(KEY_STYLES, []),
				GM.getValue(KEY_VERSION, -1),
			]);
			
			// Patch to current version
			
			(() => {
				if (version !== -1) {
					return;
				}
				
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
					throw getError('Cannot reset while a frame is open.');
				}
				
				if (typeof GM.deleteValue !== 'function') {
					throw getError('Missing GM.deleteValue permission.');
				}
				
				try {
					setConfig(TREE_DEFAULT);
				} catch (error) {
					throw getError('Unable to parse default config.', error);
				}
				
				await GM.deleteValue(KEY_TREE);
				
				// It may have previously been a rejected promise
				this.ready = Promise.resolve();
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
				
				const {tree, styles} = await $TreeFrame.edit();
				
				GM.setValue(KEY_TREE, tree);
				GM.setValue(KEY_STYLES, styles);
				GM.setValue(KEY_VERSION, VERSION);
				
				setConfig(tree);
				
				await open(false);
			};
			
			// Pass data
			
			try {
				const response = await $TreeFrame.init({
					userStyles,
					defaultTree: TREE_DEFAULT,
					title: TITLE,
					defaultStyle: STYLE_INNER,
					...(userTree ? {userTree} : {}),
				}, target, KEY_TREE);
				
				if (response.requireReset) {
					throw getError(
						'Your config is invalid.'
						+ '\nThis could be due to a script update or your data being corrupted.'
						+ `\n\nReason:\n${response.error.message.replaceAll(/\n+/g, '\n')}`,
						response.error,
					);
				}
				
				setConfig(response.tree);
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
