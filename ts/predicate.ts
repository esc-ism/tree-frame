export async function getPredicatePromise(_response: any) {
	return await _response
		.catch((response) => response instanceof Error ? Promise.reject(response.message) : Promise.reject(typeof response === 'string' ? response : undefined))
		.then((response) => typeof response === 'string' ? Promise.reject(response) : Promise[response ? 'resolve' : 'reject']());
}
