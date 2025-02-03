const LIMITS = {none: 'None', static: 'Static', fit: 'Fit'};

const config = {
	title: 'YouTube Viewfinding',
	defaultTree: (() => {
		const isCSSRule = (() => {
			const wrapper = document.createElement('style');
			const regex = /\s/g;
			
			return (property, text) => {
				const ruleText = `${property}:${text};`;
				
				document.head.appendChild(wrapper);
				wrapper.sheet.insertRule(`:not(*){${ruleText}}`);
				
				const [{style: {cssText}}] = wrapper.sheet.cssRules;
				
				wrapper.remove();
				
				return cssText.replaceAll(regex, '') === ruleText.replaceAll(regex, '') || `Must be a valid CSS ${property} rule`;
			};
		})();
		
		const getHideId = (() => {
			let id = -1;
			
			return () => ++id;
		})();
		
		const glowHideId = getHideId();
		
		return {
			get: (_, configs) => Object.assign(...configs),
			children: [
				{
					label: 'Controls',
					children: [
						{
							label: 'Keybinds',
							descendantPredicate: (children) => {
								const isMatch = ({children: a}, {children: b}) => {
									if (a.length !== b.length) {
										return false;
									}
									
									return a.every(({value: keyA}) => b.some(({value: keyB}) => keyA === keyB));
								};
								
								for (let i = 1; i < children.length; ++i) {
									if (children.slice(i).some((child) => isMatch(children[i - 1], child))) {
										return 'Another action has this key combination';
									}
								}
								
								return true;
							},
							get: (_, configs) => ({keys: Object.assign(...configs)}),
							children: (() => {
								const shift = navigator.userAgent.includes('Firefox') ? 'IntlBackslash' : 'ShiftLeft';
								
								const seed = {
									value: '',
									listeners: {
										keydown: (event) => {
											switch (event.key) {
												case 'Enter':
												case 'Escape':
													return;
											}
											
											event.preventDefault();
											
											event.target.value = event.code;
											
											event.target.dispatchEvent(new InputEvent('input'));
										},
									},
								};
								
								const getKeys = (children) => new Set(children.map(({value}) => value));
								
								const getNode = (label, keys, get) => ({
									label,
									seed,
									children: keys.map((value) => ({...seed, value})),
									get,
								});
								
								return [
									{
										label: 'Actions',
										get: (_, [toggle, ...controls]) => Object.assign(...controls.map(({id, keys}) => ({
											[id]: {
												toggle,
												keys,
											},
										}))),
										children: [
											{
												label: 'Toggle?',
												value: false,
												get: ({value}) => value,
											},
											...[
												['Pan / Zoom', ['ControlLeft'], 'pan'],
												['Rotate', [shift], 'rotate'],
												['Crop', ['ControlLeft', shift], 'crop'],
											].map(([label, keys, id]) => getNode(label, keys, ({children}) => ({id, keys: getKeys(children)}))),
										],
									},
									getNode('Reset', ['KeyX'], ({children}) => ({reset: {keys: getKeys(children)}})),
									getNode('Configure', ['AltLeft', 'KeyX'], ({children}) => ({config: {keys: getKeys(children)}})),
								];
							})(),
						},
						{
							label: 'Scroll Speeds',
							get: (_, configs) => ({speeds: Object.assign(...configs)}),
							children: [
								{
									label: 'Zoom',
									value: -100,
									get: ({value}) => ({zoom: value / 150000}),
								},
								{
									label: 'Rotate',
									value: -100,
									// 150000 * (5 - 0.8) / 2π ≈ 100000
									get: ({value}) => ({rotate: value / 100000}),
								},
								{
									label: 'Crop',
									value: -100,
									get: ({value}) => ({crop: value / 300000}),
								},
							],
						},
						{
							label: 'Drag Inversions',
							get: (_, configs) => ({multipliers: Object.assign(...configs)}),
							children: [
								['Pan', 'pan'],
								['Rotate', 'rotate'],
								['Crop', 'crop'],
							].map(([label, key, value = false]) => ({
								label,
								value,
								get: ({value}) => ({[key]: value ? -1 : 1}),
							})),
						},
						{
							label: 'Click Movement Allowance (px)',
							value: 2,
							predicate: (value) => value >= 0 || 'Allowance must be positive',
							inputAttributes: {min: 0},
							get: ({value: clickCutoff}) => ({clickCutoff}),
						},
					],
				},
				{
					label: 'Behaviour',
					children: [
						...(() => {
							const typeNode = {
								label: 'Type',
								get: ({value}) => ({type: value}),
							};
							
							const staticNode = {
								label: 'Value (%)',
								predicate: (value) => value >= 0 || 'Limit must be positive',
								inputAttributes: {min: 0},
								get: ({value}) => ({custom: value / 100}),
							};
							
							const fitNode = {
								label: 'Glow Allowance (%)',
								predicate: (value) => value >= 0 || 'Allowance must be positive',
								inputAttributes: {min: 0},
								get: ({value}) => ({frame: value / 100}),
							};
							
							const options = Object.values(LIMITS);
							
							const getNode = (label, key, value, customValue, glowAllowance = 300) => {
								const staticId = getHideId();
								const fitId = getHideId();
								const onUpdate = (value) => ({
									hide: {
										[staticId]: value !== LIMITS.static,
										[fitId]: value !== LIMITS.fit,
									},
								});
								
								return {
									label,
									get: (_, configs) => ({[key]: Object.assign(...configs)}),
									children: [
										{...typeNode, value, options, onUpdate},
										{...staticNode, value: customValue, hideId: staticId},
										{...fitNode, value: glowAllowance, hideId: fitId},
									],
								};
							};
							
							return [
								getNode('Zoom In Limit', 'zoomInLimit', LIMITS.static, 500, 0),
								getNode('Zoom Out Limit', 'zoomOutLimit', LIMITS.static, 80),
								getNode('Pan Limit', 'panLimit', LIMITS.static, 50),
								{
									label: 'Snap Pan Limit',
									get: (_, configs) => ({snapPanLimit: Object.assign(...configs)}),
									children: ((hideId) => [
										{
											...typeNode,
											value: LIMITS.fit,
											options: [LIMITS.none, LIMITS.fit],
											onUpdate: (value) => ({hide: {[hideId]: value !== LIMITS.fit}}),
										},
										{...fitNode, value: 0, hideId},
									])(getHideId()),
								},
							];
						})(),
						{
							label: 'Active Effects',
							get: (_, configs) => {
								const {overlayKill, overlayHide, ...config} = Object.assign(...configs);
								
								return {
									active: {
										overlayRule: overlayKill && [overlayHide ? 'display' : 'pointer-events', 'none'],
										...config,
									},
								};
							},
							children: [
								{
									label: 'Pause Video?',
									value: false,
									get: ({value: pause}) => ({pause}),
								},
								{
									label: 'Hide Glow?',
									value: false,
									get: ({value: hideGlow}) => ({hideGlow}),
									hideId: glowHideId,
								},
								...((hideId) => [
									{
										label: 'Disable Overlay?',
										value: true,
										get: ({value: overlayKill}, configs) => Object.assign({overlayKill}, ...configs),
										onUpdate: (value) => ({hide: {[hideId]: !value}}),
										children: [
											{
												label: 'Hide Overlay?',
												value: false,
												get: ({value: overlayHide}) => ({overlayHide}),
												hideId,
											},
										],
									},
								])(getHideId()),
							],
						},
						
					],
				},
				{
					label: 'Glow',
					value: true,
					onUpdate: (value) => ({hide: {[glowHideId]: !value}}),
					get: ({value: on}, configs) => {
						if (!on) {
							return {};
						}
						
						const {turnover, ...config} = Object.assign(...configs);
						const sampleCount = Math.floor(config.fps * turnover);
						
						// avoid taking more samples than there's space for
						if (sampleCount > config.size) {
							const fps = config.size / turnover;
							
							return {
								glow: {
									...config,
									sampleCount: config.size,
									interval: 1000 / fps,
									fps,
								},
							};
						}
						
						return {
							glow: {
								...config,
								interval: 1000 / config.fps,
								sampleCount,
							},
						};
					},
					children: [
						(() => {
							const [seed, getChild] = (() => {
								const options = ['blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'];
								const ids = {};
								const hide = {};
								
								for (const option of options) {
									ids[option] = getHideId();
									
									hide[ids[option]] = true;
								}
								
								const min0Amount = {
									label: 'Amount (%)',
									value: 100,
									predicate: (value) => value >= 0 || 'Amount must be positive',
									inputAttributes: {min: 0},
								};
								
								const max100Amount = {
									label: 'Amount (%)',
									value: 0,
									predicate: (value) => {
										if (value < 0) {
											return 'Amount must be positive';
										}
										
										return value <= 100 || 'Amount may not exceed 100%';
									},
									inputAttributes: {min: 0, max: 100},
								};
								
								const getScaled = (value) => `calc(${value}px/var(${VAR_ZOOM}))`;
								
								const root = {
									label: 'Function',
									options,
									value: options[0],
									get: ({value}, configs) => {
										const config = Object.assign(...configs);
										
										switch (value) {
											case options[0]:
												return {
													filter: config.blurScale ? `blur(${config.blur}px)` : `blur(${getScaled(config.blur)})`,
													blur: {
														x: config.blur,
														y: config.blur,
														scale: config.blurScale,
													},
												};
											
											case options[3]:
												return {
													filter: config.shadowScale ?
													`drop-shadow(${config.shadow} ${config.shadowX}px ${config.shadowY}px ${config.shadowSpread}px)` :
													`drop-shadow(${config.shadow} ${getScaled(config.shadowX)} ${getScaled(config.shadowY)} ${getScaled(config.shadowSpread)})`,
													blur: {
														x: config.shadowSpread + Math.abs(config.shadowX),
														y: config.shadowSpread + Math.abs(config.shadowY),
														scale: config.shadowScale,
													},
												};
											
											case options[5]:
												return {filter: `hue-rotate(${config.hueRotate}deg)`};
										}
										
										return {filter: `${value}(${config[value]}%)`};
									},
									onUpdate: (value) => ({hide: {...hide, [ids[value]]: false}}),
								};
								
								const children = {
									'blur': [
										{
											label: 'Distance (px)',
											value: 0,
											get: ({value}) => ({blur: value}),
											predicate: (value) => value >= 0 || 'Distance must be positive',
											inputAttributes: {min: 0},
											hideId: ids.blur,
										},
										{
											label: 'Scale?',
											value: false,
											get: ({value}) => ({blurScale: value}),
											hideId: ids.blur,
										},
									],
									'brightness': [
										{
											...min0Amount,
											hideId: ids.brightness,
											get: ({value}) => ({brightness: value}),
										},
									],
									'contrast': [
										{
											...min0Amount,
											hideId: ids.contrast,
											get: ({value}) => ({contrast: value}),
										},
									],
									'drop-shadow': [
										{
											label: 'Colour',
											input: 'color',
											value: '#FFFFFF',
											get: ({value}) => ({shadow: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Horizontal Offset (px)',
											value: 0,
											get: ({value}) => ({shadowX: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Vertical Offset (px)',
											value: 0,
											get: ({value}) => ({shadowY: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Spread (px)',
											value: 0,
											predicate: (value) => value >= 0 || 'Spread must be positive',
											inputAttributes: {min: 0},
											get: ({value}) => ({shadowSpread: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Scale?',
											value: true,
											get: ({value}) => ({shadowScale: value}),
											hideId: ids['drop-shadow'],
										},
									],
									'grayscale': [
										{
											...max100Amount,
											hideId: ids.grayscale,
											get: ({value}) => ({grayscale: value}),
										},
									],
									'hue-rotate': [
										{
											label: 'Angle (deg)',
											value: 0,
											get: ({value}) => ({hueRotate: value}),
											hideId: ids['hue-rotate'],
										},
									],
									'invert': [
										{
											...max100Amount,
											hideId: ids.invert,
											get: ({value}) => ({invert: value}),
										},
									],
									'opacity': [
										{
											...max100Amount,
											value: 100,
											hideId: ids.opacity,
											get: ({value}) => ({opacity: value}),
										},
									],
									'saturate': [
										{
											...min0Amount,
											hideId: ids.saturate,
											get: ({value}) => ({saturate: value}),
										},
									],
									'sepia': [
										{
											...max100Amount,
											hideId: ids.sepia,
											get: ({value}) => ({sepia: value}),
										},
									],
								};
								
								return [
									{...root, children: Object.values(children).flat()}, (id, ...values) => {
										const replacements = [];
										
										for (const [i, child] of children[id].entries()) {
											replacements.push({...child, value: values[i]});
										}
										
										return {
											...root,
											value: id,
											children: Object.values({...children, [id]: replacements}).flat(),
										};
									},
								];
							})();
							
							return {
								label: 'Filter',
								get: (_, configs) => {
									const scaled = {x: 0, y: 0};
									const unscaled = {x: 0, y: 0};
									
									let filter = '';
									
									for (const config of configs) {
										filter += config.filter;
										
										if ('blur' in config) {
											const target = config.blur.scale ? scaled : unscaled;
											
											target.x = Math.max(target.x, config.blur.x);
											target.y = Math.max(target.y, config.blur.y);
										}
									}
									
									return {filter, blur: {scaled, unscaled}};
								},
								children: [
									getChild('saturate', 150),
									getChild('brightness', 150),
									getChild('blur', 25, false),
								],
								seed,
							};
						})(),
						{
							label: 'Update',
							childPredicate: ([{value: fps}, {value: turnover}]) => fps * turnover >= 1 || `${turnover} second turnover cannot be achieved at ${fps} hertz`,
							children: [
								{
									label: 'Frequency (Hz)',
									value: 15,
									predicate: (value) => {
										if (value > 144) {
											return 'Update frequency may not be above 144 hertz';
										}
										
										return value >= 0 || 'Update frequency must be positive';
									},
									inputAttributes: {min: 0, max: 144},
									get: ({value: fps}) => ({fps}),
								},
								{
									label: 'Turnover Time (s)',
									value: 3,
									predicate: (value) => value >= 0 || 'Turnover time must be positive',
									inputAttributes: {min: 0},
									get: ({value: turnover}) => ({turnover}),
								},
								{
									label: 'Reverse?',
									value: false,
									get: ({value: doFlip}) => ({doFlip}),
								},
							],
						},
						{
							label: 'Size (px)',
							value: 50,
							predicate: (value) => value >= 0 || 'Size must be positive',
							inputAttributes: {min: 0},
							get: ({value}) => ({size: value}),
						},
						{
							label: 'End Point (%)',
							value: 103,
							predicate: (value) => value >= 0 || 'End point must be positive',
							inputAttributes: {min: 0},
							get: ({value}) => ({end: value / 100}),
						},
					].map((node) => ({...node, hideId: glowHideId})),
				},
				{
					label: 'Interfaces',
					children: [
						{
							label: 'Crop',
							get: (_, configs) => ({crop: Object.assign(...configs)}),
							children: [
								{
									label: 'Colours',
									get: (_, configs) => ({colour: Object.assign(...configs)}),
									children: [
										{
											label: 'Fill',
											get: (_, [colour, opacity]) => ({fill: `${colour}${opacity}`}),
											children: [
												{
													label: 'Colour',
													value: '#808080',
													input: 'color',
													get: ({value}) => value,
												},
												{
													label: 'Opacity (%)',
													value: 40,
													predicate: (value) => {
														if (value < 0) {
															return 'Opacity must be positive';
														}
														
														return value <= 100 || 'Opacity may not exceed 100%';
													},
													inputAttributes: {min: 0, max: 100},
													get: ({value}) => Math.round(255 * value / 100).toString(16),
												},
											],
										},
										{
											label: 'Shadow',
											value: '#000000',
											input: 'color',
											get: ({value: shadow}) => ({shadow}),
										},
										{
											label: 'Border',
											value: '#ffffff',
											input: 'color',
											get: ({value: border}) => ({border}),
										},
									],
								},
								{
									label: 'Handle Size (%)',
									value: 6,
									predicate: (value) => {
										if (value < 0) {
											return 'Size must be positive';
										}
										
										return value <= 50 || 'Size may not exceed 50%';
									},
									inputAttributes: {min: 0, max: 50},
									get: ({value}) => ({handle: value / 100}),
								},
							],
						},
						{
							label: 'Crosshair',
							get: (value, configs) => ({crosshair: Object.assign(...configs)}),
							children: [
								{
									label: 'Outer Thickness (px)',
									value: 3,
									predicate: (value) => value >= 0 || 'Thickness must be positive',
									inputAttributes: {min: 0},
									get: ({value: outer}) => ({outer}),
								},
								{
									label: 'Inner Thickness (px)',
									value: 1,
									predicate: (value) => value >= 0 || 'Thickness must be positive',
									inputAttributes: {min: 0},
									get: ({value: inner}) => ({inner}),
								},
								{
									label: 'Inner Diameter (px)',
									value: 157,
									predicate: (value) => value >= 0 || 'Diameter must be positive',
									inputAttributes: {min: 0},
									get: ({value: gap}) => ({gap}),
								},
								((hideId) => ({
									label: 'Text',
									value: true,
									onUpdate: (value) => ({hide: {[hideId]: !value}}),
									get: ({value}, configs) => {
										if (!value) {
											return {};
										}
										
										const {translateX, translateY, ...config} = Object.assign(...configs);
										
										return {
											text: {
												translate: {
													x: translateX,
													y: translateY,
												},
												...config,
											},
										};
									},
									children: [
										{
											label: 'Font',
											value: '30px "Harlow Solid", cursive',
											predicate: isCSSRule.bind(null, 'font'),
											get: ({value: font}) => ({font}),
										},
										{
											label: 'Position (%)',
											get: (_, configs) => ({position: Object.assign(...configs)}),
											children: ['x', 'y'].map((label) => ({
												label,
												value: 0,
												predicate: (value) => Math.abs(value) <= 50 || 'Position must be on-screen',
												inputAttributes: {min: -50, max: 50},
												get: ({value}) => ({[label]: value + 50}),
											})),
										},
										{
											label: 'Offset (px)',
											get: (_, configs) => ({offset: Object.assign(...configs)}),
											children: [
												{
													label: 'x',
													value: -6,
													get: ({value: x}) => ({x}),
												},
												{
													label: 'y',
													value: -25,
													get: ({value: y}) => ({y}),
												},
											],
										},
										(() => {
											const options = ['Left', 'Center', 'Right'];
											
											return {
												label: 'Alignment',
												value: options[2],
												options,
												get: ({value}) => ({align: value.toLowerCase(), translateX: options.indexOf(value) * -50}),
											};
										})(),
										(() => {
											const options = ['Top', 'Middle', 'Bottom'];
											
											return {
												label: 'Baseline',
												value: options[0],
												options,
												get: ({value}) => ({translateY: options.indexOf(value) * -50}),
											};
										})(),
										{
											label: 'Line height (%)',
											value: 90,
											predicate: (value) => value >= 0 || 'Height must be positive',
											inputAttributes: {min: 0},
											get: ({value}) => ({height: value / 100}),
										},
									].map((node) => ({...node, hideId})),
								}))(getHideId()),
								{
									label: 'Colours',
									get: (_, configs) => ({colour: Object.assign(...configs)}),
									children: [
										{
											label: 'Fill',
											value: '#ffffff',
											input: 'color',
											get: ({value: fill}) => ({fill}),
										},
										{
											label: 'Shadow',
											value: '#000000',
											input: 'color',
											get: ({value: shadow}) => ({shadow}),
										},
									],
								},
							],
						},
					],
				},
			],
		};
	})(),
	userStyles: [],
	defaultStyle: {
		headBase: '#c80000',
		headButtonExit: '#000000',
		borderHead: '#ffffff',
		borderTooltip: '#c80000',
		width: Math.min(90, screen.width / 16),
		height: 90,
	},
};

export default config;
