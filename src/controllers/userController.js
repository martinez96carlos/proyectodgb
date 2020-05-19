const pool = require('../database/connection');


const getUser = async (req,res) => {
    const {email, pass}= req.body;
    console.log(req.body);
    // const tipog = true;
    // const tipor = false;
    const generador = await pool.query(`
                select 
                generator_id id,
                generator_first_name nombre,
                generator_second_name segundo_nombre,
                generator_first_lastname apellido_paterno,
                generator_second_lastname apellido_materno,
                generator_born_date fecha_nacimiento,
                generator_gender genero,
                generator_email correo,
                generator_phone telefono,
                generator_place tipo_domicilio
                from generators where generator_email = $1 and generator_password = $2;
                `,[email,pass],(error, generador, fields) => {
        if (generador.rows[0]){
            res.status(200).json([generador.rows[0],true]);
        } else {      
            const recolector = pool.query(`
                                select 
                                recolector_id id,
                                recolector_first_name nombre,
                                recolector_second_name segundo_nombre,
                                recolector_first_lastname apellido_paterno,
                                recolector_second_lastname apellido_materno,
                                recolector_born_date fecha_nacimiento,
                                recolector_gender genero,
                                recolector_email correo,
                                recolector_phone telefono,
                                recolector_ci cedula,
                                recolector_city ciudad
                                from recolectors where recolector_email = $1 and recolector_password = $2
                                `, [email,pass],(error, recolector, fiels)=>{
                if (recolector.rows[0]){
                    res.status(200).json([recolector.rows[0],false]);
                } else { 
                    res.json({status: 'No existe ese usuario'});
                    console.log(error);
                }
            }); 
        }
    });
}

const createRecolector = async (req,res) => {
    const {recolector_first_name,
        recolector_second_name,
        recolector_first_lastname,
        recolector_second_lastname,
        recolector_born_date,
        recolector_gender,
        recolector_email,
        recolector_password,
        recolector_phone,
        recolector_ci,
        recolector_city} = req.body;
    console.log(req.body);
    const response = await pool.query(`
    insert into recolectors(
        recolector_first_name,
        recolector_second_name,
        recolector_first_lastname,
        recolector_second_lastname,
        recolector_born_date,
        recolector_gender,
        recolector_email,
        recolector_password,
        recolector_phone,
        recolector_ci,
        recolector_city,
        recolector_state,
        recolector_group,
        recolector_picture_url)
    values
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,1,'Eco Recolectoras del Norte','') returning recolector_id;
    `,[recolector_first_name,
        recolector_second_name,
        recolector_first_lastname,
        recolector_second_lastname,
        recolector_born_date,
        recolector_gender,
        recolector_email,
        recolector_password,
        recolector_phone,
        recolector_ci,
        recolector_city],(error, response, fields) => {
        if (!error){
        res.status(200).json([response.rows[0],false]);
        } else {
            console.log(error);
        }
    });
}

const createGenerator = async (req,res) => {
    const {generator_first_name,
        generator_second_name,
        generator_first_lastname,
        generator_second_lastname,
        generator_born_date,
        generator_gender,
        generator_email,
        generator_password,
        generator_phone,
        generator_place,
        generator_ci} = req.body;
    console.log(req.body);
    const response = await pool.query(`
    insert into generators(
        generator_first_name,
        generator_second_name,
        generator_first_lastname,
        generator_second_lastname,
        generator_born_date,
        generator_gender,
        generator_email,
        generator_password,
        generator_phone,
        generator_place,
        generator_ci,
        generator_rate,
        generator_picture_url,
        generator_state)
    values
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,'',1) returning generator_id;
    `,[ generator_first_name,
        generator_second_name,
        generator_first_lastname,
        generator_second_lastname,
        generator_born_date,
        generator_gender,
        generator_email,
        generator_password,
        generator_phone,
        generator_place,
        generator_ci],(error, response, fields) => {
        if (!error){
        res.status(200).json([response.rows[0],true]);
        } else {
            console.log(error);
        }
    });
}

// const registerGe =async (req,res) => {} ;

module.exports = {
    getUser, createRecolector ,createGenerator
}