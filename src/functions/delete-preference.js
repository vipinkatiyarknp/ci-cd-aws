const databaseManager = require('/opt/databaseManager');
const resFormatter = require('/opt/responseFormatter');
const jwtDecoder = require('/opt/jwtDecoder');
const responseCodes = require('/opt/responseCodes');
function deleteItem(event) {
	let key = event.pathParameters.preferenceId;
	const username = jwtDecoder.decodeJwt(event.headers.Authorization).sub;
	return databaseManager.deleteItem(username, key).then(response => {
		console.log("DELETE EVENT RESPONSE", response);
		return resFormatter.formatResponse(response.statusCode ? response.statusCode : responseCodes.OK, response);
	});
}

exports.handler = (event) => {
	console.log("event", event)
	return deleteItem(event);
}
