import {
    ValueError, TypeError,
    JoinedError, EmptyArrayError, NoNodeColourError
} from './errors';
import {CONTRAST_METHODS} from './types';

export function isStyles(breadcrumbs: string[], candidate: unknown): candidate is object {
    if (typeof candidate !== 'object')
        throw new TypeError(breadcrumbs, typeof candidate, ['object']);

    if (Array.isArray(candidate))
        throw new TypeError(breadcrumbs, 'array', ['object']);

    for (const [key, value] of Object.entries(candidate)) {
        switch (key) {
            // Colours
            case 'modalOutline':
            case 'headBase':
            case 'headButtonExit':
            case 'headButtonLabel':
            case 'headButtonStyle':
            case 'nodeButtonRemove':
            case 'nodeButtonCreate':
            case 'nodeButtonMove':
            case 'nodeButtonDisable':
            case 'validBackground':
            case 'invalidBackground':
            case 'tooltipOutline':
                if (typeof value !== 'string')
                    throw new TypeError([...breadcrumbs, key], typeof value, ['string']);

                break;
            // Numbers
            case 'fontSize':
                if (typeof value !== 'number')
                    throw new TypeError([...breadcrumbs, key], typeof value, ['number']);

                break;

            // Contrast methods
            case 'headContrast':
            case 'nodeContrast':
                if (typeof value !== 'string')
                    throw new TypeError([...breadcrumbs, key], typeof value, ['string']);

                if (!(CONTRAST_METHODS as readonly string[]).includes(value))
                    throw new ValueError([...breadcrumbs, key], value, CONTRAST_METHODS);

                break;

            // Booleans
            case 'isActive':
            case 'borderLeaf':
            case 'borderNode':
                if (typeof value !== 'boolean')
                    throw new TypeError([...breadcrumbs, key], typeof value, ['boolean']);

                break;

            case 'nodeBase':
                if (!Array.isArray(value))
                    throw new TypeError([...breadcrumbs, key], typeof value, ['array']);

                if (value.length === 0)
                    throw new JoinedError(
                        new NoNodeColourError(),
                        new EmptyArrayError([...breadcrumbs, key])
                    );

                for (const [i, subValue] of value.entries()) {
                    if (typeof subValue !== 'string')
                        throw new TypeError([...breadcrumbs, key, i.toString()], typeof subValue, ['string']);
                }

                break;
        }
    }

    return true;
}
