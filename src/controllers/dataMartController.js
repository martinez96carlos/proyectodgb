const pool = require('../database/connectiondm');

const getPrueba = async (req,res) => {
    const response = await pool.query(`
    select *
    from pruebas;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}

module.exports = {
    getPrueba
}