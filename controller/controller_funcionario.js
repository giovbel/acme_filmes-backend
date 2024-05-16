/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de diretores
 * Data: 18/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const funcionariosDAO = require('../model/DAO/funcionario.js');

//função para inserir um novo funcionario
const setInserirnovoFuncionario = async function (dadosFuncionario, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoFuncionarioJSON = {}

            if (dadosFuncionario.nome == "" || dadosFuncionario.nome == undefined || dadosFuncionario.nome == null || dadosFuncionario.nome.length > 100 ||
                dadosFuncionario.email == "" || dadosFuncionario.email == undefined || dadosFuncionario.email == null || dadosFuncionario.email.length > 45 ||
                dadosFuncionario.senha == "" || dadosFuncionario.senha == undefined || dadosFuncionario.senha == null || dadosFuncionario.senha.length > 45 ||
                dadosFuncionario.telefone == "" || dadosFuncionario.telefone == undefined || dadosFuncionario.telefone == null || dadosFuncionario.telefone.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                    let novoFuncionario = await funcionariosDAO.insertFuncionario(dadosFuncionario)
                    let idnovoFuncionario = await funcionariosDAO.selectLastInsertId()

                    if (novoFuncionario) {
                        novoFuncionarioJSON.Funcionario = dadosFuncionario
                        novoFuncionarioJSON.Funcionario.id = idnovoFuncionario
                        novoFuncionarioJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFuncionarioJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFuncionarioJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFuncionarioJSON 
                    } else {
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

const setAtualizarFuncionario = async function (idFuncionario, dadosFuncionario, contentType){

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idFuncionario == "" || idFuncionario == undefined || isNaN(idFuncionario)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                return message.ERROR_INVALID_ID
            } else {

                if (dadosFuncionario.nome == "" || dadosFuncionario.nome == undefined || dadosFuncionario.nome == null || dadosFuncionario.nome.length > 100 ||
                dadosFuncionario.email == "" || dadosFuncionario.email == undefined || dadosFuncionario.email == null || dadosFuncionario.email.length > 45 ||
                dadosFuncionario.senha == "" || dadosFuncionario.senha == undefined || dadosFuncionario.senha == null || dadosFuncionario.senha.length > 45 ||
                dadosFuncionario.telefone == "" || dadosFuncionario.telefone == undefined || dadosFuncionario.telefone == null || dadosFuncionario.telefone.length > 45

                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                        let funcionarioAtualizado = await funcionariosDAO.updateFuncionario(idFuncionario, dadosFuncionario)
                        let funcionarioAtualizadoJSON = {}

                        if (funcionarioAtualizado){
                            funcionarioAtualizadoJSON.Funcionario = dadosFuncionario
                            funcionarioAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            funcionarioAtualizadoJSON.stlatus_code = message.SUCCESS_UPDATED_ITEM.status_code
                            funcionarioAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return funcionarioAtualizadoJSON
                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
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

const setExcluirFuncionario = async function (idFuncionario) {

    try {

        if (idFuncionario == "" || idFuncionario == undefined || isNaN(idFuncionario)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {
            let funcionarioDeletado = await funcionariosDAO.deleteFuncionario(idFuncionario)

            if (funcionarioDeletado) {
                return message.SUCCESS_DELETED_ITEM 
            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER 
    }
}

const getListarFuncionarios = async function () {

    try {

        let funcionariosJSON = {}
        let dadosFuncionarios = await funcionariosDAO.selectAllFuncionarios()

        if (dadosFuncionarios) {
            if (dadosFuncionarios.length > 0) {
                funcionariosJSON.Funcionarios = dadosFuncionarios
                funcionariosJSON.quantidade = dadosFuncionarios.length
                funcionariosJSON.status_code = 200

                return funcionariosJSON
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

const getBuscarFuncionario = async (idFuncionario) =>{

    try {

        if (idFuncionario == "" || idFuncionario == undefined || isNaN(idFuncionario)) {    

            return message.ERROR_INVALID_ID
        } else {
            let funcionarioJSON = {}
            let dadosFuncionario = await funcionariosDAO.selectFuncionarioById(idFuncionario)

            if (dadosFuncionario) {

                if (dadosFuncionario.length > 0) {

                    funcionarioJSON.Funcionario = dadosFuncionario
                    funcionarioJSON.status_code = 200

                    return funcionarioJSON

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
    setInserirnovoFuncionario,
    setAtualizarFuncionario,
    setExcluirFuncionario,
    getListarFuncionarios,
    getBuscarFuncionario
}