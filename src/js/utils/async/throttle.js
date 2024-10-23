export function throttle(func, limit) {
	let inThrottle = false

	return function() {
		if (!inThrottle) {
			func.apply(this, arguments)
			inThrottle = true

			setTimeout(function() {
				inThrottle = false
			}, limit)
		}
	}
}
