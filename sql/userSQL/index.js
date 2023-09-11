`use strict`

const utils = require('../utils');
const config = require('../../config/db');
const mysql = require('mysql');

const createUser = async (userData) => {
    try {
        let pool = await config.sql;
        const sqlQueries = await utils.loadSqlQueries('userSQL');
    } catch (error) {
        
    }
}

module.exports = {
    createUser
}