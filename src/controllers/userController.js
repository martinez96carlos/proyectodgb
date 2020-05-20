const pool = require('../database/connection');


const getUser = async (req,res) => {
    const {email, pass}= req.headers;
    console.log(req.body);
    // const tipog = true;
    // const tipor = false;
    const generador = await pool.query(`
                select 
                generator_id ,
                generator_first_name ,
                generator_second_name ,
                generator_first_lastname ,
                generator_second_lastname ,
                generator_born_date ,
                generator_gender ,
                generator_email ,
                generator_rate ,
                generator_phone ,
                generator_place ,
                generator_picture_url
                from generators where generator_email = $1 and generator_password = $2;
                `,[email,pass],(error, generador, fields) => {
        if (generador.rows[0]){
            generador.rows[0].generator = true;
            res.status(200).json(generador.rows[0]);
        } else {      
            const recolector = pool.query(`
                                select 
                                recolector_id ,
                                recolector_first_name ,
                                recolector_second_name ,
                                recolector_first_lastname ,
                                recolector_second_lastname ,
                                recolector_born_date ,
                                recolector_gender ,
                                recolector_email ,
                                recolector_phone ,
                                recolector_ci ,
                                recolector_city ,
                                recolector_picture_url
                                from recolectors where recolector_email = $1 and recolector_password = $2
                                `, [email,pass],(error, recolector, fiels)=>{
                if (recolector.rows[0]){
                    // recolector.rows[0]["generator"] = false;
                    recolector.rows[0].generator = false;
                    res.status(200).json(recolector.rows[0]);
                } else { 
                    res.json({status: 'Verificar datos , usuario no encontrado'});
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
    const response = await pool.query('select * from recolectors where recolector_email = $1 or recolector_ci = $2',[recolector_email,recolector_ci],(error, response, fields) => {
        if(response.rows[0]){
            res.json('Ya existe el usuario o ci');
        }else {
            const register = pool.query(`
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
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,1,'Eco Recolectoras del Norte','') returning recolector_email;
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
                recolector_city],(error, register, fields) => {
                if (!error){
                    register.rows[0].generator = false;
                    res.status(200).json([false]);
                } else {
                    res.json({status: 'Registro fallido, revise los datos'})
                }
            });
            }
    })
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
    const response = await pool.query('select * from generators where generator_email = $1 or generator_ci = $2',[generator_email, generator_ci],(error, response, fields) => {
            if(response.rows[0]){
                res.json('Ya existe el usuario o ci');
            }else {
                const register = pool.query(`
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
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0.0,'',1) returning generator_email;
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
                    generator_ci],(error, register, fields) => {
                    if (!error){
                        register.rows[0].generator = true;
                    res.status(200).json([true]);
                    } else {
                        res.json({status: 'Registro fallido, revise los datos'})
                    }
                });
    }
    })
}

// const registerGe =async (req,res) => {} ;

module.exports = {
    getUser, createRecolector ,createGenerator
}