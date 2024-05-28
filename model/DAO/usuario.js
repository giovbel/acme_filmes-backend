/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
 * aqui realizamos o CRUD (Create, Read, Update, Delete) ultilizando a linguagem SQL
 * Data: 11/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * *********************************************************************************/

//import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//instância da classe prisma client
const prisma = new PrismaClient();

//função para inserir novo usuário no banco de dados
const insertUsuario = async function (dadosUsuario){

    try {
        
        let sql = `INSERT INTO tbl_usuario (nome,
                                            email, 
                                            senha
                                        ) values(
                                          '${dadosUsuario.nome}',  
                                          '${dadosUsuario.email}',
                                          '${dadosUsuario.senha}'
                                        )`

        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado){
            return resultado
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//função para atualizar um usuário no banco de dados
const updateUsuario = async function (id, dadosUsuario){

    try{

        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}',
                                          email = '${dadosUsuario.email}',
                                          senha = '${dadosUsuario.senha}'
                                          where id = ${id}`
    console.log(sql)
        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado){
            return true
        } else {
        return false
    }

    }catch(error){
        console.log(error)
        return false
    }
    
}

//função para deletar um usuário no banco de dados
const deleteUsuario = async function (idUsuario){

    try {
        let sql = `delete from tbl_usuario where id = ${idUsuario}`
        let resultado = await prisma.$executeRawUnsafe(sql)

        if (resultado) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//função para listar todos os usuários no banco de dados
const selectAllUsuarios = async function (){

    try {

        let sql = `select * from tbl_usuario`
        let rsUsuarios = await prisma.$queryRawUnsafe(sql)

        return rsUsuarios

    } catch (error) {
        console.log(error)
        return false
    }
}

//função para listar dados de um usuario com base no id
const selectUsuarioById = async function (id){

   try {

     let sql = `select * from tbl_usuario where id = ${id}`
     let rsUsuario = await prisma.$queryRawUnsafe(sql)

     return rsUsuario
   } catch (error) {
    return false
   }
}

//função para listar dados do ultimo usuario adicionado com base no id
const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    let id

    result.forEach( idUsuario => {
        id = Number(idUsuario.id)
    })


    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        console.log(error)
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuarios,
    selectUsuarioById,
    selectLastInsertId
}
