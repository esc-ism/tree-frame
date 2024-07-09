async function getPredicateResponse(response: any) {
	try {
		return await response;
	} catch ({message}) {
		throw message;
	}
}

export function getPredicatePromise(_response: any) {
	return getPredicateResponse(_response)
		.catch(() => Promise.reject())
		.then((response) => typeof response === 'string' ? Promise.reject(response) : Promise[response ? 'resolve' : 'reject']());
}
