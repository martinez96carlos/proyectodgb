//conectarse a la base de datos importar pool del modulo de postgresql
const {Pool} = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'databaseTest3',
    port: '5432'
})