const pool = require('../database/connection');




const getRecolectionByOrder = async (req,res) => {
    const order_id = req.params.orderid;
    const response = await pool.query(`
    select A.recolection_id id, B.solid_name residuo, A.recolection_weight peso_kg, A.order_id
    from recolections A, solids B
    where A.order_id = $1 and B.solid_id = A.solid_id;`,[order_id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}


module.exports = {
    getRecolectionByOrder
}