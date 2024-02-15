/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo responsável pela interação com o banco de dados
const filmesDAO = require('../model/DAO/filme.js');

//função para inserir um novo filme
const setInserirNovoFilme = async function() {

}

//função para atualizar um filme
const setAtualizarFilme = async function() {

}

//função para excluir um filme
const setExcluirFilme = async function() {

}

//função para listar todos os filmes
const getListarFilmes = async function() {

    //cria um objeto JSON
    let filmesJSON = {};

    //chama a função do DAO que retorna os filmes do BD
    let dadosFilmes = await filmesDAO.selectAllFilmes() //-> pede pro filmesDAO trazer todos os filmes do banco

    //validação para verificar se o DAO retonou dados
    if(dadosFilmes){
        //criar o JSON 
        filmesJSON.filmes = dadosFilmes;
        filmesJSON.quantidade = dadosFilmes.length;
        filmesJSON.status_code = 200
        
        return filmesJSON
    }else{
        return false
    }
}

//função para buscar um filme pelo nome ?
const getBuscarFilme = async function() {

    //cria um objeto JSON
    let filmesJSON = {};

    //chama a função do DAO que retorna os filmes do BD
    let dadosFilmes = await filmesDAO.selectAllFilmes()
    
    //validação para verificar se o DAO retonou dados
    if(dadosFilmes){
        //criar o JSON 
        filmesJSON.filmes = dadosFilmes;
        filmesJSON.quantidade = dadosFilmes.length;
        filmesJSON.status_code = 200
        
        return filmesJSON
    }else{
        return false
    }
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme
}