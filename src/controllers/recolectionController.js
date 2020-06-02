const pool = require('../database/connection');

const getRecolectionByOrder = async (req,res) => {
    const order_id = req.params.orderid;
    const response = await pool.query(`
    select A.recolection_id id, B.solid_name residuo, A.recolection_weight peso_kg, A.order_id, C.order_rate, C.order_recolection_rate
    from recolections A, solids B, orders C
    where A.order_id = $1 and B.solid_id = A.solid_id and C.order_id = $1;`,[order_id],(error, response, fields) => {
        if (!error){
        // console.log(response);
           res.status(200).json(response.rows);
        } else {
            console.log('Error al obtener recolecciones');
        }
    });
}



const registerRecolections = (req,res) => {
    const a = req.body;
    const {orderid, rate} = req.headers;
    const largo = a.length;
    let weight, solidID, i = 0;
    console.log(largo);

    async function insertar(solid_id ,weights){
        const response =  pool.query(`
            insert into recolections (solid_id, order_id, recolection_weight, recolection_state) values ($1,$2,$3,1); `,[solid_id, orderid, weights],(error, response, fields) => {
                if (!error){
                    // res.json({status: 'Recoleccion registrada correctamente'});
                    console.log('Recoleccion registrada');
                } else {
                    res.json({status: 'Recoleccion NO registrada'});
                    console.log('Error recoleccion no registrada');
                }
            });
    }
    do{
        solidID = req.body[i].solid_id;
        weight = req.body[i].recolection_weight;
        console.log(weight,solidID);
        insertar(solidID , weight);
        i++
      
    }while(i<largo);
    //----------------------
    const update = pool.query('update orders set order_rate = $1, order_state = $3 where order_id = $2', [rate,orderid,2],(error, response, fields) => {
        if (!error){
            console.log('exito');
            res.status(200).json({status: 'Recoleccion finalizada correctamente'})
        } else {
            res.json({status: 'Recoleccion no registrada'});
            console.log('Error al actualizar orden luego de recoleccion');
        }
    });
        
}



module.exports = {
    getRecolectionByOrder,registerRecolections
}