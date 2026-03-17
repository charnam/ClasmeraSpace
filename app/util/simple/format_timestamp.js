
function format_timestamp(total) {
	const seconds = total % 60;
	const minutes = Math.floor(total / 60) % 60;
	const hours = Math.floor(total / 60 / 60);
	
	const hours_str = hours.toString();
	const minutes_str = minutes.toString().padStart(2, "0");
	const seconds_str = seconds.toString().padStart(2, "0");
	
	if(hours > 0) {
		return `${hours_str}:${minutes_str}:${seconds_str}`;
	} else {
		return `${minutes_str}:${seconds_str}`;
	}
}

export default format_timestamp;