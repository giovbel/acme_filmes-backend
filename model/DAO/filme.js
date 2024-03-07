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
const insertFilme = async function(dadosFilme) {

  let sql;

  try {

    if(dadosFilme.data_relancamento != '' && 
      dadosFilme.data_relancamento != null && 
      dadosFilme.data_relancamento != undefined){

    
    
  sql = `insert into tbl_filme (nome, 
                                    sinopse,
                                    duracao,
                                    data_lancamento,
                                    data_relancamento,
                                    foto_capa,
                                    valor_unitario
                                  ) values(
                                    '${dadosFilme.nome}',
                                    '${dadosFilme.sinopse}',
                                    '${dadosFilme.duracao}',
                                    '${dadosFilme.data_lancamento}',
                                    '${dadosFilme.data_relancamento}',
                                    '${dadosFilme.foto_capa}',
                                    '${dadosFilme.valor_unitario}'
    )`;

    }else{
              sql = `insert into tbl_filme (nome, 
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario
                                    ) values(
                                           '${dadosFilme.nome}',
                                           '${dadosFilme.sinopse}',
                                           '${dadosFilme.duracao}',
                                           '${dadosFilme.data_lancamento}',
                                           null,
                                           '${dadosFilme.foto_capa}',
                                           '${dadosFilme.valor_unitario}'
)`;
      }

    //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados (insert, update e delete)
    //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

    let result = await prisma.$executeRawUnsafe(sql);

    if(result)
      return true;
    else 
      return false;
      
    }  catch (error) {
      //console.log(error)
      return false;
    }
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

   return rsFilme;
   
 }  catch (error){
  console.log(error)
   return false
 }

}

//função para o id inserido
const selectLastInsertId = async function() {
  try{
    
 let sql = `select cast(last_insert_id() as decimal) as id from tbl_filme limit 1`

 let rsId = await prisma.$queryRawUnsafe(sql)

 let idInsert

 rsId.forEach(id => {
  idInsert = id.id
 });

 if(rsId.length > 0)
   return idInsert;
 else
   return false;
   
 } catch (error){
   return false
 }
}

module.exports ={
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectLastInsertId
}