const databaseManager = require('/opt/databaseManager');
const resFormatter = require('/opt/responseFormatter');
const jwtDecoder = require('/opt/jwtDecoder');
const prefModel = require('/opt/prefModel');
const responseCodes = require('/opt/responseCodes');;
function updateItem(event) {
	let key = event.pathParameters.preferenceId;
	const { value } = JSON.parse(event.body);
	const username = jwtDecoder.decodeJwt(event.headers.Authorization).sub;
	const prefObj = prefModel.generateUpdatePrefModel(username, key, value);
	return databaseManager.updateItem(prefObj).then(response => {
		console.log("UPDATE EVENT RESPONSE", response);
		return resFormatter.formatResponse(response.statusCode ? response.statusCode : responseCodes.OK, response);
	});
}
exports.handler = (event) => {
	return updateItem(event);
}
