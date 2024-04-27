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
const setAtualizarNacio = async function (idNacio, dadosNacio, contentType) {
    
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let nacioAtualizadaJSON = {}
            if (idNacio == "" || idNacio == undefined || isNaN(idNacio)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                return message.ERROR_INVALID_ID
            } else {
                if (dadosNacio.gentilico == ""   || dadosNacio.gentilico == undefined || 
                    dadosNacio.gentilico == null || dadosNacio.gentilico.length > 50  ||
                    dadosNacio.sigla == ""       || dadosNacio.sigla == undefined     || 
                    dadosNacio.sigla == null     || dadosNacio.sigla.length > 3
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let validateStatus = false

                if (dadosNacio.bandeira != null && 
                    dadosNacio.bandeira != "" && 
                    dadosNacio.bandeira != undefined) {

                    if (dadosNacio.bandeira.length != 500){
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }           
                } else {
                    validateStatus = true
                }

                if(validateStatus){

                    let nacioAtualizada = await nacionalidadeDAO.updateNacio(idNacio, dadosNacio)

                    if (nacioAtualizada) {

                        nacioAtualizadaJSON.nacionalidade = dadosNacio
                        nacioAtualizadaJSON.nacionalidade.id = idNacio
                        nacioAtualizadaJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        nacioAtualizadaJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        nacioAtualizadaJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return nacioAtualizadaJSON
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para excluir uma nacionlidade
const setExcluirNacio = async (idNacio) => {

    try {

        if (idNacio == "" || idNacio == undefined || isNaN(idNacio)) {
            return message.ERROR_INVALID_ID
        }else{
            let nacioDeletada = await paisesDAO.deletePais(idNacio)

            if(nacioDeletada) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para listar todas as nacionalidades
const getListarNacio = async () => {

try {
    let nacionalidadesJSON = {}
    let dadosNacio = await nacionalidadeDAO.selectAllNacio()

    if (dadosNacio) {
        if (dadosNacio.length > 0) {
            nacionalidadesJSON.nacionalidade = dadosNacio
            nacionalidadesJSON.quantidade = dadosNacio.length
            nacionalidadesJSON.status_code = 200

            return nacionalidadesJSON
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

//função para buscar uma nacionalidade pelo id 
const getBuscarNacio = async (idNacio) => {

    try {
        if (idNacio == "" || idNacio == undefined || isNaN(idNacio)) {
            return message.ERROR_INVALID_ID
        } else {

            let nacionalidadesJSON = {}
            let dadosNacio = await nacionalidadeDAO.selectByIdPais(idNacio)

            if (dadosNacio) {

                if (dadosNacio.length > 0) {
                    nacionalidadesJSON.nacionalidade = dadosNacio
                    nacionalidadesJSON.quantidade = dadosNacio.length
                    nacionalidadesJSON.status_code = 200

                    return nacionalidadesJSON
                } else {
                    return message.ERROR_NOT_FOUND
            }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getNacioByAtor = async (idAtor)=>{

    try {
        if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {

            return [message.ERROR_INVALID_ID]
        } else {
            let nacioArray = []
            let dadosNacio = await nacionalidadeDAO.selectAtorByAtorNacio(idAtor)

            dadosNacio.forEach(nacionalidade =>{
                nacioArray.push(nacionalidade)
            })

            if (dadosNacio) {

                if (dadosNacio.length > 0) {
                    return nacioArray
                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }
    } catch (error) {
        return [message.ERROR_INTERNAL_SERVER]
    }
}

module.exports = {
    setInserirNovaNacio,
    setAtualizarNacio,
    setExcluirNacio,
    getListarNacio,
    getBuscarNacio,
    getNacioByAtor
}