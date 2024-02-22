/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
 * aqui realizamos o CRUD (Create, Read, Update, Delete) ultilizando a linguagem SQL
 * Data: 01/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * *********************************************************************************/

//import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//instância da classe prisma client
const prisma = new PrismaClient();

//função para inserir novo filme no banco de dados
const insertFilme = async function() {

}

//função para atualizar um filme no banco de dados
const updateFilme = async function() {

}

//função para excluir um filme no banco de dados
const deleteFilme = async function() {

}

//função para listar todos os filmes do banco de dados
const selectAllFilmes = async function() {

    let sql = 'select * from tbl_filme'

    //$queryRawUnsafe()
    //$queryRaw('select * from tbl_filme where nome = '+ variavel)

    let rsFilmes = await prisma.$queryRawUnsafe(sql);

    if(rsFilmes.length > 0)
      return rsFilmes;
    else
      return false;

}

//função para buscar um filme do banco de dados pelo id
const selectByIdFilme = async function(id) {

  try{
     //para buscar um filme pelo id
  let sql = `select * from tbl_filme where id = ${id}`

  //caminha o script sql para o banco de dados
  let rsFilme = await prisma.$queryRawUnsafe(sql)

  if(rsFilme.length > 0)
    return rsFilme;
  else
    return rsFilme;
    
  } catch (error){
    return false
  }

 
}

//função para buscar um filme do banco de dados pelo nome 
const selectByNomeFilme = async function(nome) {

  let nomeFilme = nome.replaceAll('"','')

  try{
    //para buscar um filme pelo nome
 let sql = `select * from tbl_filme where nome like "${nomeFilme}%"`

//caminha o script sql para o banco de dados
 let rsFilme = await prisma.$queryRawUnsafe(sql)

 console.log(rsFilme)
   return rsFilme;
   
 }  catch (error){
  console.log(error)
   return false
 }

}

module.exports ={
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme
}