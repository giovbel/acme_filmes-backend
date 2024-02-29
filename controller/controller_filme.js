/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const filmeDAO = require('../model/DAO/filme.js');

//função para inserir um novo filme
const setInserirNovoFilme = async function(dadosFilme) {

    //cria o objeto JSON paa devolver os dados  criados na requisição
    let novoFilmeJSON = {};
    
    //validação de campos obrigatórios ou com digitação inválida
    if (dadosFilme.nome              == '' || dadosFilme.nome == undefined            || dadosFilme.nome.length > 80             || 
        dadosFilme.sinopse           == '' || dadosFilme.sinopse == undefined         || dadosFilme.sinopse.length > 65000       ||
        dadosFilme.duracao           == '' || dadosFilme.duracao == undefined         || dadosFilme.duracao.length > 8           ||
        dadosFilme.data_lancamento   == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento.length != 10 ||
        dadosFilme.foto_capa         == '' || dadosFilme.foto_capa == undefined       || dadosFilme.foto_capa.length > 200       ||
        dadosFilme.valor_unitario.length > 6
        ) {
            
            return message.ERROR_REQUIRED_FIELDS //400

    } else {

        if (dadosFilme.data_relacamento != null || dadosFilme.data_relacamento != '') {
            if (dadosFilme.data_relacamento.length != 10) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                validateStatus = true
            }
         } else {
                validateStatus = true
            }
        }

        //encaminha os dados do filme para o DAO inserir no banco de dados
        let novoFilme = await filmeDAO.insertFilme(dadosFilme) 

        //validação para verificar se o DAO inseriu os dados do BD
        if(novoFilme){

            //Cria o JSON de retorno dos dados (201)
            novoFilmeJSON.filme  = dadosFilme
            novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
            novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
            novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM

            return novoFilmeJSON //201
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
           
    }
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
        //criar o JSON para desenvolver o APP
        filmesJSON.filmes = dadosFilmes;
        filmesJSON.quantidade = dadosFilmes.length;
        filmesJSON.status_code = 200
        
        return filmesJSON
    }else{
        return false
    }
}

//função para buscar um filme pelo id 
const getBuscarFilme = async function(id) {

    //recebe o id do filme 
    let idFilme = id;

    //cria o objeto JSON
    let filmeJSON = {};

    //validação para verificar se o id é válido (vazio, inefiido e não numérico)
    if(idFilme == '' || idFilme == undefined || isNaN(idFilme)){
        return message.ERROR_INVALID_ID //400
    }else{
        
        //encaminha para o DAO localizar o id do filme
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        //validação para verificar se existe dados de retorno
        if(dadosFilme){

            //validação para verificar a quantidade de itens encontrado
            if(dadosFilme.length > 0){
            //cria o JSON de return
            filmeJSON.filme = dadosFilme;
            filmeJSON.status_code = 200
            return filmeJSON
            }else{
                return message.ERROR_NOT_FOUND //404
            }
           
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
    
}

//função para buscar um filme pelo nome ?
const getBuscarFilmeNome = async function(nome) {

     //recebe o id do filme 
     let nomeFilme = nome;

     //cria o objeto JSON
     let filmeJSON = {};
 
     //validação para verificar se o id é válido (vazio, inefiido e não numérico)
     if(nomeFilme == '' || nomeFilme == undefined){
         return message.ERROR_INVALID_ID //400
     }else{
         
         //encaminha para o DAO localizar o id do filme
         let dadosFilme = await filmesDAO.selectByNomeFilme(nomeFilme)
 
         //validação para verificar se existe dados de retorno
         if(dadosFilme){
 
             //validação para verificar a quantidade de itens encontrado
             if(dadosFilme.length > 0){
             //cria o JSON de return
             filmeJSON.filme = dadosFilme;
             filmeJSON.status_code = 200
             return filmeJSON
             }else{
                console.log(dadosFilme)
                 return message.ERROR_NOT_FOUND //404
             }
            
         } else {
            console.log(dadosFilme)
             return message.ERROR_INTERNAL_SERVER_DB //500
         }
     }
     
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarFilmeNome
}