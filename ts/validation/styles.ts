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
            case 'leafShowBorder':
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

            // Colours
            default:
                if (typeof value !== 'string')
                    throw new TypeError([...breadcrumbs, key], typeof value, ['string']);
        }
    }

    return true;
}
