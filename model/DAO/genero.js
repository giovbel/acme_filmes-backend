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

//função para inserir novo gênero no banco de dados
const insertGenero = async (dadosGenero) => {

  try {

    let sql = `insert into tbl_genero (nome) values ('${dadosGenero.nome}')`
    let resultado = await prisma.$executeRawUnsafe(sql)

    if(resultado){
     return true
    } else {
     return false
    }

 } catch (error) {
   return false
 }

}

//função para atualizar um genero no banco de dados
const updateGenero = async (idGenero, dadosGenero) => {

  let id = idGenero
  let dados = dadosGenero

  try {

    let sql = `update tbl_genero set nome = '${dados.nome}' where id = ${id}`
    let resultado = await prisma.$executeRawUnsafe(sql)

    if(resultado){
     return true
    } else {
     return false
    } 
  } catch (error) {
    return false
  }
}

//função para excluir um genero no banco de dados
const deleteGenero = async () => {

  try {

    let sql = `delete from tbl_genero where id=${id}`
    let resultado = await prisma.$executeRawUnsafe(sql)

    if(resultado){
     return true
    } else {
     return false
    } 
  } catch (error) {
    return false
  }
}

//função para listar todos os generos do banco de dados
const selectAllGeneros = async () =>{

  try {

     let sql = `select * from tbl_genero`
     let resultado = await prisma.$queryRawUnsafe(sql)

     if(resultado){
      return resultado
     } else {
      return false
     }

  } catch (error) {
    return false
  }
}

//função para buscar um genero do banco de dados pelo id
const selectGeneroById = async (id) => {

  try {

    let sql = `select * from tbl_genero where id = ${id}`
    let resultado = await prisma.$queryRawUnsafe(sql)

    if(resultado){
     return resultado
    } else {
     return false
    }

 } catch (error) {
   return false
 }
}

//função para buscar o id do ultimo genero inserido do banco de dados 
const selectLastInsertId = async () => {

  try {

    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_genero limit 1`
    let resultado = await prisma.$queryRawUnsafe(sql)

    let id
    result.forEach( idGenero => {
        id = Number(idGenero.id)
    })

    if(resultado){
     return id
    } else {
     return false
    }

 } catch (error) {
   return false
 }

}

module.exports = {
  insertGenero,
  updateGenero,
  deleteGenero,
  selectAllGeneros,
  selectGeneroById,
  selectLastInsertId
}