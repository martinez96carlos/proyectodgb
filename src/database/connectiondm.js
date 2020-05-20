const { Pool } = require('pg');

const pooldm = new Pool({
    host: 'localhost',
    database: 'dmtest1',
    user: 'postgres',
    password: 'admin',
    port: '5432'
});

module.exports = pooldm;
