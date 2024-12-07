export const TOOLTIP_CLASS = 'tooltip';

export const TOOLTIP_CONTAINER_CLASS = 'tooltip-container';

export const TOOLTIP_TOP_CLASS = 'tooltip-above';

export const TOOLTIP_BOTTOM_CLASS = 'tooltip-below';

export const TOOLTIP_REVERSE_CLASS = 'tooltip-reverse';

export const TOOLTIP_ANIMATION: [Array<Keyframe>, KeyframeAnimationOptions] = [
	[
		// keyframes
		{opacity: 1},
		{opacity: 1},
		{opacity: 0},
	], {duration: 2000},
];

export const TOOLTIP_ANIMATION_FAST: [Array<Keyframe>, KeyframeAnimationOptions] = [
	[
		// keyframes
		{opacity: 1},
		{opacity: 0},
	], {duration: 1000},
];
