module.exports.formatResponse = (responseCode, responeBody) => {
    const response = {
		statusCode: responseCode,
		body: JSON.stringify(responeBody), // need to set everything in the body
		headers: {
			'Content-Type': 'application/json',
		}
	};
	console.log("response::::",response)
	return response
};