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

    
    
  sql = `insert into tbl_filme (    nome, 
                                    sinopse,
                                    duracao,
                                    data_lancamento,
                                    data_relancamento,
                                    foto_capa,
                                    foto_fundo,
                                    valor_unitario,
                                    classificacao_id,
                                    genero_id,
                                    nacionalidade_id
                                  ) values(
                                    '${dadosFilme.nome}',
                                    '${dadosFilme.sinopse}',
                                    '${dadosFilme.duracao}',
                                    '${dadosFilme.data_lancamento}',
                                    '${dadosFilme.data_relancamento}',
                                    '${dadosFilme.foto_capa}',
                                    '${dadosFilme.foto_fundo}',
                                    '${dadosFilme.valor_unitario}',
                                     ${dadosFilme.classificacao_id},
                                     ${dadosFilme.genero_id},
                                     ${dadosFilme.nacionalidade_id}
    )`;

    }else{
              sql = `insert into tbl_filme (nome, 
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            foto_fundo,
                                            valor_unitario,
                                            classificacao_id,
                                            genero_id,
                                            nacionalidade_id
                                    ) values(
                                      '${dadosFilme.nome}',
                                      '${dadosFilme.sinopse}',
                                      '${dadosFilme.duracao}',
                                      '${dadosFilme.data_lancamento}',
                                       null,
                                      '${dadosFilme.foto_capa}',
                                      '${dadosFilme.foto_fundo}',
                                      '${dadosFilme.valor_unitario}',
                                       ${dadosFilme.classificacao_id},
                                       ${dadosFilme.genero_id},
                                       ${dadosFilme.nacionalidade_id}
)`;
      }

      console.log(sql)

    //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados (insert, update e delete)
    //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

    let result = await prisma.$executeRawUnsafe(sql);

    if(result)
      return true;
    else 
      return false;
      
    }  catch (error) {
      console.log(error)
      return false;
    }
}

//função para atualizar um filme no banco de dados
const updateFilme = async function(id,dadosAtualizados) {

  console.log(dadosAtualizados)

  let sql

  if(dadosAtualizados.data_relancamento != '' && 
  dadosAtualizados.data_relancamento != null && 
  dadosAtualizados.data_relancamento != undefined){

  sql = `update tbl_filme set     nome = '${dadosAtualizados.nome}', 
                                  sinopse = '${dadosAtualizados.sinopse}', 
                                  duracao = '${dadosAtualizados.duracao}',
                                  data_lancamento = '${dadosAtualizados.data_lancamento}',
                                  data_relancamento =  '${dadosAtualizados.data_relancamento}',
                                  foto_capa =  '${dadosAtualizados.foto_capa}',
                                  foto_fundo = '${dadosAtualizados.foto_fundo}',
                                  valor_unitario =  ${dadosAtualizados.valor_unitario},
                                  classificacao_id = ${dadosAtualizados.classificacao_id},
                                  genero_id = ${dadosAtualizados.genero_id},
                                  nacionalidade_id = ${dadosAtualizados.nacionalidade_id}
                                  where id = ${id}`
  } else {
     sql = `update tbl_filme set nome = '${dadosAtualizados.nome}', 
                                  sinopse = '${dadosAtualizados.sinopse}', 
                                  duracao = '${dadosAtualizados.duracao}',
                                  data_lancamento = '${dadosAtualizados.data_lancamento}',
                                  data_relancamento =  null,
                                  foto_capa =  '${dadosAtualizados.foto_capa}',
                                  foto_fundo = '${dadosAtualizados.foto_fundo}',
                                  valor_unitario =  ${dadosAtualizados.valor_unitario},
                                  classificacao_id = ${dadosAtualizados.classificacao_id},
                                  genero_id = ${dadosAtualizados.genero_id},
                                  nacionalidade_id = ${dadosAtualizados.nacionalidade_id}
                                  where id = ${id}`
  }

   let rsFilme = await prisma.$queryRawUnsafe(sql);
  
    if(rsFilme)
        return rsFilme;
   else
      return false;
}

//função para excluir um filme no banco de dados
const deleteFilme = async function(id) {
  try {
    let sql = `delete from tbl_filme where id = ${id}`

  let rsFilme = await prisma.$queryRawUnsafe(sql);

  if(rsFilme)
    return rsFilme;
  else
    return false;
  } catch (error) {
    console.log(error)
    return false
  }

}

//função para listar todos os filmes do banco de dados
const selectAllFilmes = async function() {

    let sql = `select tbl_filme.id as id, tbl_filme.nome as nome, tbl_filme.sinopse as sinopse, tbl_filme.duracao as duracao, tbl_filme.data_lancamento as data_lancamento, 
    tbl_filme.data_relancamento as data_relancamento, tbl_filme.foto_capa as foto_capa,  tbl_filme.foto_fundo as foto_fundo, tbl_filme.valor_unitario as valor_unitario,
    tbl_nacionalidade.gentilico as nacionalidade, tbl_classificacao.nome as classificacao, tbl_genero.nome as genero from tbl_filme 
    join tbl_nacionalidade on tbl_filme.nacionalidade_id =  tbl_nacionalidade.id
    join tbl_classificacao on tbl_filme.classificacao_id = tbl_classificacao.id
    join tbl_genero on tbl_filme.genero_id = tbl_genero.id`

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

const insertAtorFilme = async function(idAtor, idFilme) {

  let sql;

  try {

    sql = `insert into tbl_ator_filme ( ator_id,
                                        filme_id
                             ) values (
                                     ${idAtor},
                                     ${idFilme}
    )`

    //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados (insert, update e delete)
    //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

    let result = await prisma.$executeRawUnsafe(sql);

    if(result)
      return true;
    else 
      return false;
      
    }  catch (error) {
      console.log(error)
      return false;
    }
}

const insertDiretorFilme = async function(idDiretor, idFilme) {

  let sql;

  try {

    sql = `insert into tbl_diretor_filme ( diretor_id,
                                          filme_id
                             ) values (
                                     ${idDiretor},
                                     ${idFilme}
    )`

    //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados (insert, update e delete)
    //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

    let result = await prisma.$executeRawUnsafe(sql);

    if(result)
      return true;
    else 
      return false;
      
    }  catch (error) {
      console.log(error)
      return false;
    }
}

const deleteAtorFilme = async function(id) {
  
  let sql = `delete from tbl_ator_filme where filme_id = ${id}`

  let rsFilmeAtor = await prisma.$queryRawUnsafe(sql);

  if(rsFilmeAtor)
    return rsFilmeAtor;
  else
    return false;
}

const deleteDiretorFilme = async function(id) {
  
  let sql = `delete from tbl_diretor_filme where filme_id = ${id}`

  let rsFilmeDiretor = await prisma.$queryRawUnsafe(sql);
  console.log(rsFilmeDiretor)

  if(rsFilmeDiretor)
    return rsFilmeDiretor;
  else
    return false;
}

module.exports ={
    insertFilme,
    insertAtorFilme,
    insertDiretorFilme,
    updateFilme,
    deleteFilme,
    deleteAtorFilme,
    deleteDiretorFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectLastInsertId
}