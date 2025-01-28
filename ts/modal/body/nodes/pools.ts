const pools = [];

export function get(node) {
	return [...(pools[node.poolId] ?? [node])];
}

export function add(id, node) {
	pools[id] ??= [];
	
	pools[id].push(node);
}

export function remove(id, node) {
	pools[id].splice(pools[id].indexOf(node), 1);
}
