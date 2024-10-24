// Retrigger a reflow for the specific element.
// We are force to assign to a variable
// to avoid chrome stripping the read instruction
// Thus non-triggering the reflow
let keep = null // eslint-disable-line no-unused-vars
export function forceReflow(el) { return keep = el.offsetHeight }
