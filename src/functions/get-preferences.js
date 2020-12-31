const databaseManager = require('/opt/databaseManager');
const resFormatter = require('/opt/responseFormatter');
const jwtDecoder = require('/opt/jwtDecoder');
const responseCodes = require('/opt/responseCodes');;
function getAllPreferences(event) {
	const username = jwtDecoder.decodeJwt(event.headers.Authorization).sub;
	return databaseManager.getAllItems(username).then(response => {
		return resFormatter.formatResponse(response.statusCode ? response.statusCode : responseCodes.OK, response);
	});
}

exports.handler = (event) => {
	return getAllPreferences(event);
}
