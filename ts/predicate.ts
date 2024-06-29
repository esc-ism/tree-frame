async function getPredicateResponse(response: any) {
	try {
		return await response;
	} catch ({message}) {
		throw message;
	}
}

export async function getPredicatePromise(_response: any) {
	const response = await getPredicateResponse(_response);
	
	if (typeof response === 'string') {
		throw response;
	} else if (response) {
		return;
	}
	
	throw null;
}
