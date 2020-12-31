const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();
const DYNAMODB_TABLE_NAME = process.env.TABLE_NAME;
const responseCodes = require('/opt/responseCodes');
module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveItem = (item) => {
	// https://stackoverflow.com/questions/39451505/how-to-return-the-inserted-item-in-dynamodb

	// https://stackoverflow.com/questions/54697041/how-to-set-dynamodb-read-consistency-in-cloudformation
	const params = {
		TableName: DYNAMODB_TABLE_NAME,
		Item: item,
		//ConditionExpression: 'attribute_not_exists(p_key) AND attribute_not_exists(username)',
		//ReturnValues: 'ALL_OLD'
	};
	return dynamo
		.put(params)
		.promise()
		.then((response) => {
			const res = {
				//HACK::: AS DYNAMODB DOES NOT SUPPORT TO RETURN VALUES AFTER INSERTING THE RECORDS
				// key: response.Attributes['p_key'],
				// value: response.Attributes['p_value']
				key: item['p_key'],
				value: item['p_value']
			}
			return res;
		}).catch(error => {
			return error;
		});
};
module.exports.getAllItems = (username) => {
	// https://forums.aws.amazon.com/thread.jspa?threadID=92159
	// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.ReadData.Scan.html
	const params = {
		TableName: DYNAMODB_TABLE_NAME,
		ProjectionExpression: "p_key, p_value",
		FilterExpression: 'username = :un',
		ExpressionAttributeValues: {
			':un': username
		}
	};

	return dynamo
		.scan(params)
		.promise()
		.then(result => {
			console.log('DYNAMODB RESULT', result)
			return result.Items;
		}).catch(error => {
			return error;
		});
};

module.exports.getItem = (username, prefKey) => {
	console.log('GET>>>>>>>>>', prefKey)
	const params = {
		TableName: DYNAMODB_TABLE_NAME,
		ProjectionExpression: "p_key, p_value",
		FilterExpression: 'username = :un and p_key= :pid',
		ExpressionAttributeValues: {
			':un': username,
			':pid': prefKey
		}
	};

	return dynamo
		.scan(params)
		.promise()
		.then(result => {
			if (result && result.Items && result.Items.length) {
				const res = {
					key: result.Items[0]['p_key'],
					value: result.Items[0]['p_value']
				}
				return res;
			} else {
				return {
					statusCode: responseCodes.NOT_FOUND,
					error: 'Does not found any record'
				}
			}

		}).catch(error => {
			return error;
		});
};

module.exports.deleteItem = (username, prefKey) => {
	// https://stackoverflow.com/questions/49740072/empty-data-object-when-deleting-item-from-dynamodb
	const params = {
		Key: {
			'p_key': prefKey,
			username: username

		},
		TableName: DYNAMODB_TABLE_NAME
	};

	return dynamo.delete(params).promise();
};

module.exports.updateItem = (item) => {
	// https://stackoverflow.com/questions/41873769/how-to-prevent-creating-a-new-item-in-updateitem-if-the-item-does-not-exist
	const params = {
		TableName: DYNAMODB_TABLE_NAME,
		ConditionExpression: 'attribute_exists(p_key) AND attribute_exists(username)',
		Key: {
			"p_key": item['p_key'],
			"username": item.username,
		},
		UpdateExpression: `set p_value=:itemValue,last_modified_date=:modifiedDate`,
		ExpressionAttributeValues: {
			":itemValue": item['p_value'],
			":modifiedDate": item['last_modified_date']
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then((response) => {
			if (response) {
				const res = {
					key: response.Attributes['p_key'],
					value: response.Attributes['p_value']
				}
				return res;
			}

		}).catch(error => {
			console.log("ERROR", error)
			return {
				statusCode: responseCodes.BAD_REQUEST,
				error: 'Does not found any record to update'
			}
		});
};
