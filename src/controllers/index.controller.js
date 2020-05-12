//conectarse a la base de datos importar pool del modulo de postgresql
const {Pool} = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'databaseTest3',
    port: '5432'
})

const getUser = async (req,res)=>{
    const response = await pool.query('SELECT * FROM recolectors');
    // console.log(response.rows);
    res.status(200).json(response.rows);
}
const getSolid = async (req,res) =>{
    const response = await pool.query(`SELECT * FROM solids`);
    res.status(200).json(response.rows);
}






module.exports = {
    getUser,
    getSolid
}