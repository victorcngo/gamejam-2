// NOTE - Set a limit to prevent too many decimals
export const lerpPrecise = (start, end, t, limit = 0.001) => {
	const v = start * (1 - t) + end * t
	return Math.abs(end - v) < limit ? end : v
}
