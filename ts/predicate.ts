export async function getPredicatePromise(_response: any) {
	try {
		const response = await _response;
		
		return typeof response === 'string' ? Promise.reject(response) : Promise[response ? 'resolve' : 'reject']();
	} catch (response) {
		if (response instanceof Error) {
			return Promise.reject(response.message);
		}
		
		return Promise.reject(typeof response === 'string' ? response : undefined);
	}
}
