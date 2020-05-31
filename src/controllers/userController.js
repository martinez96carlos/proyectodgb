const pool = require('../database/connection');
const bcrypt = require('bcrypt');



const verificador = (bodyPass,dbPass) => {
    // console.log(bodyPass);
    // console.log(dbPass);
    const resultado = bcrypt.compareSync(bodyPass, dbPass)
    // contra = bcrypt.compare(bodyPass, dbPass, function(err, result) {
    //     return result;
    // });
    return resultado;
}

const getUser = async (req,res) => {
    const {email, pass}= req.headers; 
    const passwordge = await  pool.query('select generator_password from generators where generator_email = $1 ', [email], (error, passwordge, fields) => {
        if(!error) {
            if(passwordge.rows[0]){
                const contrage = verificador(pass,passwordge.rows[0].generator_password);
                // console.log(contrage);
                if(contrage == true){
                    // res.json('exito');
                     const generador = pool.query(`
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
                            generator_ci,
                            generator_place ,
                            generator_picture_url
                            from generators where generator_email = $1 and generator_password = $2;
                            `,[email,passwordge.rows[0].generator_password],(error, generador, fields) => {
                                if (generador.rows[0]){
                                    generador.rows[0].generator = true;
                                    res.status(200).json(generador.rows[0]);
                                    console.log('inicio de sesion');
                                } else {
                                    res.json({status: 'Verificar datos, son erroneos'});
                                    console.log('Verificar datos, son erroneos');
                                }
                            });
                }else{
                    res.json('Password mala');
                }
                
            } else {
                const passwordre = pool.query(`select recolector_password from recolectors where recolector_email = $1 `, [email], (error, passwordre, fields) => {
                    if(!error){
                        if(passwordre.rows[0]){
                            const contrare  = verificador(pass,passwordre.rows[0].recolector_password)
                            // console.log(contrare);
                            if(contrare == true){
                                // res.json('exito');
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
                                recolector_picture_url,
                                recolector_rate
                                from recolectors where recolector_email = $1 and recolector_password = $2
                                `, [email,passwordre.rows[0].recolector_password],(error, recolector, fiels)=>{
                                        if (recolector.rows[0]){
                                            recolector.rows[0].generator = false;
                                            res.status(200).json(recolector.rows[0]);
                                            console.log('inicio de sesion')
                                        } else { 
                                            res.json({status: 'Verificar datos, son erroneos'});
                                            console.log('Verificar datos, son erroneos');
                                        }
                                    }); 
                            }else{
                                res.json('Password mala');
                            }
                        } else {
                            res.json({status: 'No existe usuario'})
                        }
                    }else{
                        console.log('No se pudo obtener datos de usuarios');
                    }
                });
            }
        }else{
            console.log('ocurrio un error en el login');
        }
    });
}

//antiguo get user
// const getUser = async (req,res) => {
//     const {email, pass}= req.headers;  
//     const generador = await pool.query(`
//                 select 
//                 generator_id ,
//                 generator_first_name ,
//                 generator_second_name ,
//                 generator_first_lastname ,
//                 generator_second_lastname ,
//                 generator_born_date ,
//                 generator_gender ,
//                 generator_email ,
//                 generator_rate ,
//                 generator_phone ,
//                 generator_place ,
//                 generator_picture_url
//                 from generators where generator_email = $1 and generator_password = $2;
//                 `,[email,pass],(error, generador, fields) => {
//         if (generador.rows[0]){
//             generador.rows[0].generator = true;
//             res.status(200).json(generador.rows[0]);
//         } else {      
//             const recolector = pool.query(`
//                                 select 
//                                 recolector_id ,
//                                 recolector_first_name ,
//                                 recolector_second_name ,
//                                 recolector_first_lastname ,
//                                 recolector_second_lastname ,
//                                 recolector_born_date ,
//                                 recolector_gender ,
//                                 recolector_email ,
//                                 recolector_phone ,
//                                 recolector_ci ,
//                                 recolector_city ,
//                                 recolector_picture_url
//                                 from recolectors where recolector_email = $1 and recolector_password = $2
//                                 `, [email,pass],(error, recolector, fiels)=>{
//                 if (recolector.rows[0]){
//                     recolector.rows[0].generator = false;
//                     res.status(200).json(recolector.rows[0]);
//                 } else { 
//                     res.json({status: 'Verificar datos , datos erroneos'});
//                     console.log(error);
//                 }
//             }); 
//         }
//     });
// }

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
    const hashedPassword =  await bcrypt.hash(recolector_password, 10);
    const response = await pool.query('select * from recolectors where recolector_email = $1 or recolector_ci = $2'
        ,[recolector_email,recolector_ci],(error, response, fields) => {
        // console.log(hashedPassword);
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
                recolector_picture_url,
                recolector_rate)
            values
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,1,'Eco Recolectoras del Norte','',0.0) returning recolector_email;
            `,[recolector_first_name,
                recolector_second_name,
                recolector_first_lastname,
                recolector_second_lastname,
                recolector_born_date,
                recolector_gender,
                recolector_email,
                hashedPassword,
                recolector_phone,
                recolector_ci,
                recolector_city],(error, register, fields) => {
                if (!error){
                    register.rows[0].generator = false;
                    res.status(200).json([false]);
                } else {
                    res.json({status: 'Registro fallido, revise los datos'})
                    console.log('registro fallido de recolector');
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
    const hashedPassword = await bcrypt.hash(generator_password, 10);
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
                    hashedPassword,
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

const editGenerator = async (req,res)=>{
   const {id} = req.headers;
   const {
    generator_first_name,
    generator_second_name,
    generator_first_lastname,
    generator_second_lastname,
    generator_born_date,
    generator_gender,
    generator_email,
    generator_password,
    generator_phone,
    generator_ci,
    generator_place,
    generator_picture_url
    } = req.body;
    console.log(req.body);
    console.log(req.headers.id);
    const hashedPassword =  await bcrypt.hash(generator_password, 10);
    const response = await pool.query('select * from generators where generator_email = $1 or generator_ci =$2;'
    ,[generator_email,generator_ci],(error, response, fields) => {
        if(!error){
            if(response.rows[0]){
                const idgenerator = response.rows[0].generator_id;
                if(idgenerator != id){
                    res.json({status: 'Elige otro correo o CI, uno de ellos o los dos ya estan registrados'});
                    console.log('Otro correo o CI');
                } else {
                    const update = pool.query(`
                    update generators set 
                        generator_first_name = $2,
                        generator_second_name = $3,
                        generator_first_lastname = $4,
                        generator_second_lastname = $5,
                        generator_born_date = $6,
                        generator_gender = $7,
                        generator_email = $8,
                        generator_phone = $9,
                        generator_ci = $10,
                        generator_place = $11,
                        generator_picture_url = $12,
                        generator_password = $13
                    where 
                        generator_id = $1;
                    `
                    ,[  id,
                        generator_first_name,
                        generator_second_name,
                        generator_first_lastname,
                        generator_second_lastname,
                        generator_born_date,
                        generator_gender,
                        generator_email,
                        generator_phone,
                        generator_ci,
                        generator_place,
                        generator_picture_url,
                        hashedPassword]
                    ,(error, update, fields) => {
                        if(!error){
                            res.json({status: 'Datos actualizados correctamente'});
                            console.log('Datos actualizados');
                        }else{
                            console.log(error);
                        }
                    
                    });
                }
            } else {
              res.json({status:'Ocurrio un error, revisa tus datos nuevamente'});
            }
        } else {
            console.log(error);
        }
    });
}

const editRecolector = async (req,res)=>{
    const {id} = req.headers;
    const {
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
        recolector_picture_url
     } = req.body;
     console.log(req.body);
     console.log(req.headers.id);
     const hashedPassword =  await bcrypt.hash(recolector_password, 10);
     const response = await pool.query('select * from recolectors where recolector_email = $1 or recolector_ci =$2;'
     ,[recolector_email,recolector_ci],(error, response, fields) => {
         if(!error){
             if(response.rows[0]){
                 const idrecolector = response.rows[0].recolector_id;
                 if(idrecolector != id){
                     res.json({status: 'Elige otro correo o CI, uno de ellos o los dos ya estan registrados'});
                     console.log('Otro correo o CI');
                 } else {
                     const update = pool.query(`
                     update recolectors set 
                        recolector_first_name = $2,
                        recolector_second_name = $3,
                        recolector_first_lastname = $4,
                        recolector_second_lastname = $5,
                        recolector_born_date = $6,
                        recolector_gender = $7,
                        recolector_email = $8,
                        recolector_phone = $9,
                        recolector_ci = $10,
                        recolector_city = $11,
                        recolector_picture_url = $12,
                        recolector_password = $13
                     where 
                         recolector_id = $1;
                     `
                     ,[  id,
                        recolector_first_name,
                        recolector_second_name,
                        recolector_first_lastname,
                        recolector_second_lastname,
                        recolector_born_date,
                        recolector_gender,
                        recolector_email,
                        recolector_phone,
                        recolector_ci,
                        recolector_city,
                        recolector_picture_url,
                        hashedPassword]
                     ,(error, update, fields) => {
                         if(!error){
                             res.json({status: 'Datos actualizados correctamente'});
                             console.log('Datos actualizados');
                         }else{
                             console.log(error);
                         }
                     });
                 }
             } else {
               res.json({status:'Ocurrio un error, revisa tus datos nuevamente'});
             }
         } else {
             console.log(error);
         }
     });
 }



module.exports = {
    getUser, createRecolector ,createGenerator, editGenerator, editRecolector
}