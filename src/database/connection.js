const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'databaseTest1',
    user: 'postgres',
    password: 'admin',
    port: '5432'
});



// var parse = require('pg-connection-string').parse;
// var config = parse('postgres://mgyywgfdwefwid:67debdcd23a1e1c2e9a6ef8d48f128bb9df44807e55b3b9b7179d6b5fbd36a9d@ec2-34-197-141-7.compute-1.amazonaws.com:5432');

// const pool = new Pool({
//     connectionString: config
// });

module.exports = pool;