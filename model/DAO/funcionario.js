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

//função para inserir novo funcionario no banco de dados
const insertFuncionario = async function (dadosFuncionario){
    try {
        
        let sql = `insert into tbl_funcionario (nome, 
                                                login, 
                                                senha,
                                                telefone
                                        ) values (
                                                '${dadosFuncionario.nome}', 
                                                '${dadosFuncionario.email}', 
                                                '${dadosFuncionario.senha}',
                                                '${dadosFuncionario.telefone}')`

        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado)
            return resultado
        else
            return false

    } catch (error) {
        return false
    }
}

//função para atualizar um funcionario no banco de dados
const updateFuncionario = async function (id, dadosFuncionario){
    try{

        let sql = `update tbl_funcionario set 
                                          nome = '${dadosFuncionario.nome}',
                                          email = '${dadosFuncionario.email}',
                                          senha = '${dadosFuncionario.senha}',
                                          telefone = '${dadosFuncionario.telefone}'
                                          where id = ${id}`

        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado)
        return true
        else
        return false

    }catch(error){
        return false
    }
}

//função para excluir um funcionario no banco de dados
const deleteFuncionario = async function (idFuncionario) {

    try {

        let sql = `delete from tbl_funcionario where id = ${idFuncionario}`
        let resultado = await prisma.$executeRawUnsafe(sql)

        if (resultado)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllFuncionarios = async function (){

    try {
        let sql = `select * from tbl_funcionario`

        let rsFuncionarios = await prisma.$queryRawUnsafe(sql)
        return rsFuncionarios
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectFuncionarioById = async function (idFuncionario){

    try {
 
      let sql = `select * from tbl_funcionario where id = ${idFuncionario}`
      let rsFuncionarios = await prisma.$queryRawUnsafe(sql)
 
      return rsFuncionarios
    } catch (error) {
     return false
    }
 }

 const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_funcionario limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idAdmnistrador => {
        id = Number(idAdmnistrador.id)
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
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario,
    selectAllFuncionarios,
    selectFuncionarioById,
    selectLastInsertId
}