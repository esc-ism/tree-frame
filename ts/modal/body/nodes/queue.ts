const queue = [];

// No idea if this works on all machines/browsers
export function onceVisualsUpdate(_callback) {
	return new Promise((resolve) => {
		const callback = resolve(_callback());
		
		if (queue.push(callback) > 1) {
			return;
		}
		
		// Wait for update to start
		requestAnimationFrame(() => {
		// Wait for everything else to update
			window.setTimeout(() => {
				for (const callback of queue) {
					callback();
				}
				
				queue.length = 0;
			}, 0);
		});
	});
}
