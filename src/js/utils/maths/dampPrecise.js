import { lerpPrecise } from "./lerpPrecise"

// NOTE - Set a limit to prevent too many decimals
export const dampPrecise = (a, b, smoothing, dt, limit) => {
	return lerpPrecise(a, b, 1 - Math.exp(-smoothing * 0.05 * dt), limit)
}
