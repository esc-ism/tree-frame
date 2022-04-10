import {TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS} from './consts';

import {ELEMENT_CLASSES} from '../../../consts';

import {BACKGROUND_IMAGE_SIZE} from '../../../../data/css';

import {addRule} from '../../../../../../css';
import {INVALID_CLASS} from '../consts';

export default function generate() {
    addRule(`.${TOOLTIP_CONTAINER_CLASS}`, [
        ['position', 'absolute'],
        ['text-align', 'center'],
        ['top', '102%'],
        ['z-index', '2'],
        ['margin-left', `-${BACKGROUND_IMAGE_SIZE}`],
        ['width', '100%'],
        ['pointer-events', 'none']
    ]);

    addRule(`.${TOOLTIP_CLASS}`, [
        ['margin', '0 auto'],
        ['background-color', 'var(--base)'],
        ['color', 'var(--contrast)'],
        ['font-size', '0.9em'],
        ['padding', '3px 8px'],
        ['border-radius', '1em'],
        ['width', '10em'],
        ['outline', 'solid 2px var(--contrast)']
    ]);

    // Don't show when the input's valid or there's no hint to give
    addRule(
        [`.${TOOLTIP_CLASS}:not(.${INVALID_CLASS} *)`, `.${TOOLTIP_CLASS}:empty`],
        ['display', 'none']
    );

    addRule(`.${TOOLTIP_CLASS}::after`, [
        ['content', '\'\''],
        ['white-space', 'pre'],
        ['position', 'absolute'],
        ['bottom', '100%'],
        ['left', '50%'],
        ['margin-left', '-0.5em'],
        ['border-width', '0.5em'],
        ['border-style', 'solid'],
        ['border-color', 'transparent transparent var(--contrast) transparent']
    ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, ['position', 'relative']);
}
