import type {Node} from '../types';
import {PoolBranchError} from '../errors';

export function validatePools(breadcrumbs: Array<string>, node: Node, ancestorPools: Array<Array<string>> = []) {
    if ('poolId' in node) {
        if (node.poolId in ancestorPools)
            throw new PoolBranchError(ancestorPools[node.poolId], breadcrumbs, node.poolId);

        // Slice maintains empty entries, so the 'in' operator still works
        ancestorPools = ancestorPools.slice();

        ancestorPools[node.poolId] = breadcrumbs;
    }

    if ('children' in node) {
        // Recurse
        for (const [i, child] of node.children.entries()) {
            validatePools([...breadcrumbs, 'children', i.toString()], child, ancestorPools);
        }
    }
}
