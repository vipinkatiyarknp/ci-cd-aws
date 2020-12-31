const databaseManager = require('/opt/databaseManager');
const resFormatter = require('/opt/responseFormatter');
const jwtDecoder = require('/opt/jwtDecoder');
const prefModel = require('/opt/prefModel');
const responseCodes = require('/opt/responseCodes');;
function saveItem(event) {
	const { key, value } = JSON.parse(event.body);
	const username = jwtDecoder.decodeJwt(event.headers.Authorization).sub;
	const prefObj = prefModel.generateCreatePrefModel(username,key,value);
	console.log("prefObj>>>", prefObj)
	return databaseManager.saveItem(prefObj).then(response => {
		console.log("response in Lambda function", response);
		return resFormatter.formatResponse(response.statusCode ? response.statusCode : responseCodes.OK, response);
	});
}

exports.handler = (event) => {
	console.log("EVT", event);
	return saveItem(event);
}
