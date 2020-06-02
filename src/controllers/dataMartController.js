const pool = require('../database/connectiondm');

// GRAFICOS GENERALES
const getVolumenPorResiduoGeneral = async (req,res) => {
    const response = await pool.query(`
    SELECT A.solid_type_name as tipo_residuo, round( CAST(COALESCE(sum(C.weight),0) as numeric), 2) as volumen
    FROM dim_solid_types A
    LEFT JOIN dim_solids B ON B.solid_type_id = A.solid_type_id
    LEFT JOIN fact_recolection C ON C.solid_id = B.solid_id
    group by A.solid_type_id`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorTipoVivienda = async (req,res) => {
    const response = await pool.query(`
    select A.generator_place, round( CAST(COALESCE(sum(B.weight),0) as numeric), 2) as volumen
    from dim_orders A
    LEFT JOIN fact_recolection B ON B.order_id = A.order_id
    group by A.generator_place;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorMes  = async (req,res) => {
    const response = await pool.query(`
    select  TO_CHAR(TO_DATE(A.mes::text, 'MM'),'Month') AS "Mes", round( CAST(COALESCE(sum(B.weight),0) as numeric), 2) as volumen
    from dim_time A
    LEFT JOIN fact_recolection B ON B.time_id = A.time_id
    group by A.mes;`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorCiudad = async (req,res) => {
    const response = await pool.query(`
    select A.city,round( CAST(COALESCE(sum(C.weight),0) as numeric), 2) as volumen
    from dim_recolector A
    LEFT JOIN dim_orders B on B.recolector_id = A.recolector_id 
    LEFT JOIN fact_recolection C on C.order_id = B.order_id
    group by A.city`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getTopFiveRecolectors = async (req,res) => {
    const response = await pool.query(`
    select A.nombre, A.apellido, A.city, round( CAST(COALESCE(sum(C.weight),0) as numeric), 2) as volumen
    from dim_recolector A
    LEFT JOIN dim_orders B ON B.recolector_id = A.recolector_id
    LEFT JOIN fact_recolection C ON C.order_id = B.order_id
    group by A.nombre, A.apellido, A.city
    limit 5`,(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorResiduoPersonal = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query(`
    SELECT A.solid_type_name as tipo_residuo,round( CAST(COALESCE(sum(C.weight),0) as numeric), 2) as volumen
    FROM dim_solid_types A
    LEFT JOIN dim_solids B ON B.solid_type_id = A.solid_type_id
    LEFT JOIN fact_recolection C ON C.solid_id = B.solid_id
    LEFT JOIN dim_orders D ON D.order_id = C.order_id
    where D.recolector_id = $1
    group by A.solid_type_id`,[id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorViviendaPersonal = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query(`
    select A.generator_place,round( CAST(COALESCE(sum(B.weight),0) as numeric), 2) as volumen
    from dim_orders A
    LEFT JOIN fact_recolection B ON B.order_id = A.order_id
    where recolector_id = $1
    group by A.generator_place;`,[id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}
const getVolumenPorMesPersonal = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query(`
    select TO_CHAR(TO_DATE(A.mes::text, 'MM'),'Month') AS "Mes", round( CAST(COALESCE(sum(B.weight),0) as numeric), 2) as volumen
    from dim_time A
    LEFT JOIN fact_recolection B ON B.time_id = A.time_id
    LEFT JOIN dim_orders C on B.order_id = C.order_id
    where C.recolector_id = $1
    group by A.mes;`,[id],(error, response, fields) => {
        if (!error){
           res.status(200).json(response.rows);
        } else {
           console.log(error);
        }
    });
}


//graficos personales




module.exports = {
    getVolumenPorResiduoGeneral,
    getVolumenPorTipoVivienda,
    getVolumenPorMes,
    getVolumenPorCiudad,
    getTopFiveRecolectors,
    getVolumenPorResiduoPersonal,
    getVolumenPorViviendaPersonal,
    getVolumenPorMesPersonal

}