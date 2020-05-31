const pool = require('../database/connection');

const getOrders = async (req,res) => {
    const response = await pool.query(`
    select A.order_id id, A.generator_id, A.recolector_id, A.order_date ,
    A.order_detail, A.order_image_url, A.order_rate, A.order_recolection_rate, A.order_latitude , A.order_longitude , A.order_state,
    B.generator_first_name , B.generator_first_lastname , B.generator_phone 
    from orders A, generators B
    where B.generator_id = A.generator_id and A.order_state = 0  order by order_id desc;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log('Error en getOrders');
        }
    });
}

const getRecolectedOrders = async (req,res) => {
    const response = await pool.query(`
    select A.order_id id, A.generator_id, A.recolector_id, A.order_date ,
    A.order_detail, A.order_image_url, A.order_rate, A.order_recolection_rate, A.order_latitude , A.order_longitude , A.order_state,
    B.generator_first_name , B.generator_first_lastname , B.generator_phone, C.recolector_first_name, C.recolector_first_lastname
    from orders A, generators B, recolectors C
    where B.generator_id = A.generator_id and  A.recolector_id = C.recolector_id and A.order_state = 2 order by order_id desc;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log('Error en getRecolectedOrders');
        }
    });
}

const createOrder = async (req,res) => {
    const {generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude} = req.body;
    // console.log(req.body);
    const response = await pool.query(`
    insert into orders(generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude,order_rate,order_recolection_rate, order_state)
    values
    ($1,$2,$3,$4,$5,$6,0,0,0) returning order_id;
    `,[generator_id, order_date, order_detail, order_image_url, order_latitude, order_longitude],(error, response, fields) => {
        if (!error){
            res.status(200).json(response.rows[0]);
        } else {
            console.log('Error en createOrder');
        }
    });
}

// A.order_id order_id, A.generator_id id_generador, A.recolector_id id_recolector,
const getOrderById = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query(`
    select  A.order_id, A.generator_id, A.recolector_id, A.order_date ,
    A.order_detail , A.order_image_url , A.order_rate , A.order_recolection_rate, A.order_latitude , A.order_longitude ,
    B.generator_first_name , B.generator_phone 
    from orders A, generators B
    where B.generator_id = A.generator_id and A.order_ID = $1 order by A.order_id desc;`,[id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows[0]);
        } else {
            console.log('Error en obtener order by id');
        }
    });
}


// and A.order_state = 0
const getOrderByGenerator = async (req,res) => {
    const generator_id = req.params.id;
    const response = await pool.query(`
    select A.order_id id, A.generator_id , A.recolector_id , A.order_date ,
    A.order_detail , A.order_image_url , A.order_rate, A.order_recolection_rate, A.order_latitude , A.order_longitude, A.order_state,
    B.generator_first_name, B.generator_first_lastname
    from orders A, generators B
    where A.generator_id = $1 and B.generator_id = $1 order by A.order_id desc;`,[generator_id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log('Error en obtener order by generador');
        }
    });
}

const getOrderByRecolector = async (req,res) => {
    const recolector_id = req.params.id;
    const response = await pool.query(`
    select A.order_id id, A.generator_id , A.recolector_id , A.order_date ,
    A.order_detail , A.order_image_url , A.order_rate , A.order_recolection_rate, A.order_latitude , A.order_longitude, A.order_state,
    C.generator_first_name, C.generator_first_lastname, C.generator_phone
    from orders A, recolectors B, generators C
    where A.recolector_id = $1 and B.recolector_id = $1 and A.generator_id = C.generator_id order by order_id desc;`,[recolector_id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
            console.log('Error en obtener order by recolector');
        }
    });
}

const pickOrder = async (req,res) => {
    const {order_id, recolector_id} = req.body;
    // console.log(req.body);
    const response = await pool.query(`
    select * from orders where order_id = $1;
    `,[order_id],(error, response, fields) => {
    if(!error){
        // console.log(response.rows[0]);
        if (response.rows[0].order_state == 0){
            const update = pool.query(`update orders set order_state = 1, recolector_id = $2 where order_id = $1;`,[order_id, recolector_id],(error, response, fields) => {
                if (!error){
                    res.status(200).json({status: 'Ya puedes recolectar la orden'});        
                 } else {
                    res.json({status: 'Error al recolectar'});
                 }
            })
        }
        if (response.rows[0].order_state == 1){
            res.json('El pedido ya está siendo recolectado');
        }
        if (response.rows[0].order_state == 3){
            res.json('El pedido fue eliminado seleccione otro pedido');
        }
    } else {
        res.json('La orden no existe');
    }
    });
}

const cancelPick = async (req,res) => {
    const {order_id, recolector_id} = req.body;
    // console.log(req.body);
    const response = await pool.query(`select * from orders where order_id = $1`,[order_id], (error,response,fields) => {
        if(!error){
            if(response.rows[0].recolector_id == recolector_id){
                pool.query(` update orders set order_state = 0, recolector_id = null where  order_id = $1 and recolector_id = $2; `,[order_id,recolector_id],(error, response, fields) => {
                    if(!error){
                        res.json('Recolección cancelada');
                    } else {
                        res.json('Error');
                    }
                });
            }else{
                res.json('Esta recolección fue elegida por otro recolector o fue eliminada');
            }
        }
        else{
            console.log('Error al cancelar recoleccion');
        }

    });
}




const deleteOrder = async (req,res) => {
    const order_id = req.params.orderid;
    console.log(req.body);
    const response = await pool.query(`select * from orders where order_id = $1`,[order_id],(error, response, fields) => {
        if (!error){
            // console.log(response.rows);
            if(response.rows[0].order_state === 0){
                const update = pool.query(`update orders set order_state = 3 where order_id = $1;`,[order_id],(error, response, fields) => {
                    if (!error){
                        res.status(200).json({status: 'Orden eliminada'});        
                     } else {
                        res.json({status: 'Error al eliminar'});
                     }
                })
            } else {
                res.status(200).json({status: 'El pedido se esta recolectando'});
            }
        } else {
            console.log('Error al eliminar orden');
        }
    });
}

const getOrderRates = async (req,res) => {
    console.log(req.params);
    const order_id = req.params.orderid;
    const response = await pool.query(`select A.order_rate, A.order_recolection_rate from orders A WHERE A.order_id = $1 ;`,[order_id], (error,response,fields) => {
        if(!error){
            // console.log(response.rows[0]);
            res.json(response.rows[0]);
        }else{
            console.log(error);
        }
    })

}


//update orders set order_recolection_rate = $1 where order_id = $2;


const rateRecolection =  (req,res) => {
    const {order_id, recolection_rate} = req.headers;
    const verif = pool.query(`select order_state from orders where order_id = $1;`, [order_id], (error,verif,fiels) => {
        if(!error){
            if(verif.rows[0].order_state == 2){
                const response =  pool.query(`update orders set order_recolection_rate = $1 where order_id = $2;`,[recolection_rate, order_id], (error,verif,fiels) => {
                res.json({status: 'Recoleccion Calificada'});
                })
            }else{
                res.json({status: 'Error, la recoleccion no finalizo'});
            }
        } else {
            console.log(error);
        }
    })
    
}

module.exports = {
    getOrders , getOrderById ,getOrderByGenerator, createOrder ,deleteOrder, getOrderByRecolector, pickOrder, cancelPick, getRecolectedOrders, getOrderRates, rateRecolection
}