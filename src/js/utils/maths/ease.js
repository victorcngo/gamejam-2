export const linear = (t) => t
export const easeInQuad = (t) => t * t //pow2
export const easeOutQuad = (t) => t * (2 - t)
export const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
export const easeInCubic = (t) => t * t * t //pow3
export const easeOutCubic = (t) => (--t) * t * t + 1
export const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
export const easeInQuart = (t) => t * t * t * t // pow4
export const easeOutQuart = (t) => 1 - (--t) * t * t * t
export const easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
export const easeInQuint = (t) => t * t * t * t * t // pow5
export const easeOutQuint = (t) => 1 + (--t) * t * t * t * t
export const easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
export const easeInExpo = (t) => Math.Pow(2, 10 * (t - 1))
export const easeOutExpo = (t) => -Math.Pow(2, -10 * t) + 1
// export const easeInOutExpo = (t) => {   t *= 2.0;   r

export const eases = [
	easeOutQuint,
	easeOutQuart,
	easeOutCubic,
	easeOutQuad,
	easeOutCubic,
	easeOutQuint,
	easeOutQuart,
]

export const getEaseFromIndex = (i) => eases[i]

