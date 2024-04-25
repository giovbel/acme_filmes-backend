/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de nacionalidade
 * Data: 18/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const nacionalidadeDAO = require('../model/DAO/nacionalidade.js');

//função para inserir uma nova nacionalidade
const setInserirNovaNacio = async function (dadosNacio, contentType) {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let nacioAtualizadoJSON = {}

            if (dadosNacio.gentilico == "" || dadosNacio.gentilico == undefined || dadosNacio.gentilico == null || dadosNacio.gentilico.length > 50 ||
                dadosNacio.sigla == "" || dadosNacio.sigla == undefined || dadosNacio.sigla == null || dadosNacio.sigla.length > 3
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let validateStatus = false

                if (dadosNacio.data_relancamento != null && 
                    dadosNacio.data_relancamento != "" && 
                    dadosNacio.data_relancamento != undefined) {

                    if (dadosPais.data_relancamento.length != 500)
                        return message.ERROR_REQUIRED_FIELDS //400
                    else
                        validateStatus = true
                } else {
                    validateStatus = true
                }

                if(validateStatus){
                
                let novaNacio = await paisesDAO.insertPais(dadosNacio)
                let novoId = await paisesDAO.selectLastInsertId()

                if (novaNacio) {

                    nacioAtualizadoJSON.pais = dadosNacio
                    nacioAtualizadoJSON.pais.id = novoId
                    nacioAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    nacioAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    nacioAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return nacioAtualizadoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
                }else{
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
               } else {
                return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para atualizar uma nacionlidade
const setAtualizarNacio = async function (dadosNacio, id) {

}

module.exports = {
    setInserirNovaNacio,
    setAtualizarNacio
}