const pool = require('../database/connection');

const getOrders = async (req,res) => {
    const response = await pool.query(`
    select A.order_id id, A.generator_id id_generador, A.recolector_id id_recolector, A.order_date fecha,
    A.order_detail detalle, A.order_image_url url_imagen, A.order_rate calidad, A.order_latitude Latitud, A.order_longitude longitud,
    B.generator_first_name nombre_generador, B.generator_first_lastname apellido_generador, B.generator_phone telefono_generador
    from orders A, generators B
    where B.generator_id = A.generator_id and A.order_state = 1;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}
const getOrderById = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query(`
    select A.order_id id, A.generator_id id_generador, A.recolector_id id_recolector, A.order_date fecha,
    A.order_detail detalle, A.order_image_url url_imagen, A.order_rate calidad, A.order_latitude Latitud, A.order_longitude longitud,
    B.generator_first_name nombre, B.generator_first_lastname apellido, B.generator_phone
    from orders A, generators B
    where B.generator_id = A.generator_id and A.order_ID = $1;`,[id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}

const getOrderByGenerator = async (req,res) => {
    const generator_id = req.params.id;
    const response = await pool.query(`
    select A.order_id id, A.generator_id id_generador, A.recolector_id id_recolector, A.order_date fecha,
    A.order_detail detalle, A.order_image_url url_imagen, A.order_rate calidad, A.order_latitude Latitud, A.order_longitude longitud
    from orders A, generators B
    where A.generator_id = $1 and B.generator_id = $1 and A.order_state = 1;`,[generator_id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}

const createOrder = async (req,res) => {
    const {generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude} = req.body;
    console.log(req.body);
    const response = await pool.query(`
    insert into orders(generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude, order_state)
    values
    ($1,$2,$3,$4,$5,$6,1) returning order_id;
    `,[generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude],(error, response, fields) => {
        if (!error){
        res.status(200).json(response.rows);
        } else {
            console.log(error);
        }
    });
}


const deleteOrder = async (req,res) => {
    const {order_id} = req.body;
    console.log(req.body);
    const response = await pool.query(`
    update orders set order_state = 3 where order_id = $1;
    `,[order_id],(error, response, fields) => {
        if (!error){
        res.status(200).json({status: 'Orden Eliminada'});
        } else {
            console.log(error);
        }
    });
}




module.exports = {
    getOrders , getOrderById ,getOrderByGenerator, createOrder ,deleteOrder
}