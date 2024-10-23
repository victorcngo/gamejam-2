export const parseTime = (timeString) => {
	const [ hours, minutes, seconds ] = timeString.split(":").map(parseFloat)
	return hours * 3600 + minutes * 60 + seconds
}
