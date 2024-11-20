let count: number = 0;

export function isUnresolved() {
	return count > 0;
}

export async function getPredicatePromise(_response: any) {
	count++;
	
	try {
		const response = await _response;
		
		count--;
		
		return typeof response === 'string' ? Promise.reject(response) : Promise[response ? 'resolve' : 'reject']();
	} catch (response) {
		count--;
		
		if (response instanceof Error) {
			return Promise.reject(response.message);
		}
		
		return Promise.reject(typeof response === 'string' ? response : undefined);
	}
}
