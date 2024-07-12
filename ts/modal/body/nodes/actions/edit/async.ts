let id: number = 0;
let count: number = 0;
let lastResolvedId: number = 0;
let lastRejectedId: number = 0;

function countDown() {
	if (--count === 0) {
		id = 0;
		lastResolvedId = 0;
		lastRejectedId = 0;
	}
}

export function start() {
	count++;
	
	return ++id;
}

export function resolve(id): boolean {
	const isNew = lastResolvedId < id;
	
	if (isNew) {
		lastResolvedId = id;
	}
	
	countDown();
	
	return isNew;
}

export function reject(id): boolean {
	const isNew = lastRejectedId < id;
	
	if (isNew) {
		lastRejectedId = id;
	}
	
	countDown();
	
	return isNew;
}

export function isOngoing() {
	return count > 0;
}
