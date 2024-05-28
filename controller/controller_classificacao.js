/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados da classificacao
 * Data: 18/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const classificacaoDAO = require('../model/DAO/classificacao.js');

//função para inserir uma nova classificacao
const setInserirNovaClassificacao = async function (dadosClassificacao, contentType) {

    try {
        if(String(contentType).toLowerCase() == 'application/json'){

        let classificacaoNovaJSON = {}

        if (dadosClassificacao.nome == "" || dadosClassificacao.nome == undefined ||
            dadosClassificacao.nome == null || dadosClassificacao.nome.length > 45) {

            return message.ERROR_REQUIRED_FIELDS
        } else {
            let novaClassificacao = await classificacaoDAO.insertClassificacao(dadosClassificacao)
            let novaId = await classificacaoDAO.selectLastInsertId()

            if (novaClassificacao) {

                classificacaoNovaJSON.classificacao = dadosClassificacao
                classificacaoNovaJSON.classificacao.id = novaId
                classificacaoNovaJSON.status = message.SUCCESS_CREATED_ITEM.status
                classificacaoNovaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                classificacaoNovaJSON.message = message.SUCCESS_CREATED_ITEM.message

                return classificacaoNovaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
        }else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para atualizar uma classificação
const setAtualizarClassificacao = async function (dadosAtualizados, id, contentType) {
    try {
        let idClassificacao = id
         if (String(contentType).toLowerCase() == 'application/json') {

             if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
            
                 return message.ERROR_INVALID_ID
             }else{
 
                 if(dadosAtualizados.nome == "" || dadosAtualizados.nome == undefined || dadosAtualizados.nome == null || dadosAtualizados.nome.length > 45){
                     return message.ERROR_REQUIRED_FIELDS

                 }else{
                     let classificacaoAtualizado = await classificacaoDAO.updateClassificacao(idClassificacao, dadosAtualizados)
                     let classificacaoAtualizadoJSON = {}
 
                     if(classificacaoAtualizado){

                         classificacaoAtualizadoJSON.classificacao = dadosAtualizados
                         classificacaoAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                         classificacaoAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                         classificacaoAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message
 
                         return classificacaoAtualizadoJSON
                     }else{
                         return message.ERROR_INTERNAL_SERVER_DB
                     }
                 }
             }
         }else{
             return message.ERROR_CONTENT_TYPE
         }
     } catch (error) {
         console.log(error)
         return message.ERROR_INTERNAL_SERVER
     }
}

//função para excluir uma classificacao
const setExcluirClassificacao = async function (idClassificacao) {

    try {

        if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
            return message.ERROR_INVALID_ID
        }else{
            let classificacaoDeletada = await classificacaoDAO.deleteClassificacao(idClassificacao)

            if(classificacaoDeletada)
            return message.SUCCESS_DELETED_ITEM
            else
            return message.ERROR_INTERNAL_SERVER_DB
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//função para listar todas as classificacoes
const getListarClassificacoes = async function () {

    try {

        let classificacaoJSON = {}
        let dadosClassificacoes = await classificacaoDAO.selectAllClassificacoes()

        if (dadosClassificacoes) {

            if (dadosClassificacoes.length > 0) {
                classificacaoJSON.classificacoes = dadosClassificacoes
                classificacaoJSON.quantidade = dadosClassificacoes.length
                classificacaoJSON.status_code = 200

                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para buscar classificacao pelo id
const getBuscarClassificacao = async function (idClassificacao) {

    try {
        if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
            return message.ERROR_INVALID_ID
        } else {
            let classificacaoJSON = {}
            let dadosClassificacao = await classificacaoDAO.selectClassificacoesById(idClassificacao)

            if (dadosClassificacao) {
                if (dadosClassificacao.length > 0) {
                    classificacaoJSON.classificacao = dadosClassificacao
                    classificacaoJSON.quantidade = dadosClassificacao.length
                    classificacaoJSON.status_code = 200

                return classificacaoJSON
            } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    setInserirNovaClassificacao,
    setAtualizarClassificacao,
    setExcluirClassificacao,
    getListarClassificacoes,
    getBuscarClassificacao
}
