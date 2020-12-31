module.exports.generateCreatePrefModel = (userName, key, value) => {
    const formattedDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let prefObj = {
        p_key: key,
        p_value: value,
        created_date:  formattedDate,
        last_modified_date: formattedDate,
        username: userName
    }
    return prefObj;
};
module.exports.generateUpdatePrefModel = (userName, key, value) => {
    const formattedDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let prefObj = {
        p_key: key,
        p_value: value ? value : null,
        last_modified_date: formattedDate,
        username: userName
    }
    return prefObj;
};