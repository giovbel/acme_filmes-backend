/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados do usuario
 * Data: 18/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const usuariosDAO = require('../model/DAO/usuario.js');

//função para inserir um novo usuario
const setInserirNovoUsuario = async function (dadosUsuario, contentType) {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {  

            let usuarioNovoJSON = {}

            if (dadosUsuario.nome  == "" || dadosUsuario.nome  == undefined || dadosUsuario.nome  == null || dadosUsuario.nome.length  > 80 ||
                dadosUsuario.email == "" || dadosUsuario.email == undefined || dadosUsuario.email == null || dadosUsuario.email.length > 50 ||
                dadosUsuario.senha == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null || dadosUsuario.senha.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                    let novoUsuario = await usuariosDAO.insertUsuario(dadosUsuario)
                    let idNovoUsuario = await usuariosDAO.selectLastInsertId()

                    if (novoUsuario) {
                        usuarioNovoJSON.usuario = dadosUsuario
                        usuarioNovoJSON.usuario.id = idNovoUsuario
                        usuarioNovoJSON.status = message.SUCCESS_CREATED_ITEM.status
                        usuarioNovoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        usuarioNovoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return usuarioNovoJSON 
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

//função para atualizar um usuario
const setAtualizarUsuario = async function (idUsuario, dadosUsuario, contentType){

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {

            return message.ERROR_INVALID_ID
            } else {

                if (dadosUsuario.nome == "" || dadosUsuario.nome == undefined  || dadosUsuario.nome == null  || dadosUsuario.nome.length  > 80 ||
                    dadosUsuario.email    == "" || dadosUsuario.email == undefined || dadosUsuario.email == null || dadosUsuario.email.length > 50 ||
                    dadosUsuario.senha    == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null || dadosUsuario.senha.length > 20
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                        let usuarioAtualizado = await usuariosDAO.updateUsuario(idUsuario, dadosUsuario)
                        let usuarioAtualizadoJSON = {}

                        if (usuarioAtualizado){
                            usuarioAtualizadoJSON.usuario = dadosUsuario
                            usuarioAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            usuarioAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            usuarioAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return usuarioAtualizadoJSON
                        }else{
                            return message.ERROR_INTERNAL_SERVER_DB
                        }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

//função para excluir um usuario
const setExcluirUsuario = async function (idUsuario) {

    try {
        if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {
            let usuarioDeletado = await usuariosDAO.deleteUsuario(idUsuario)

            if (usuarioDeletado) {
                return message.SUCCESS_DELETED_ITEM 
            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER 
    }
}

//função para listar todos os usuários
const getListarUsuarios = async function () {

    try {
        let usuariosJSON = {}
        let dadosUsuarios = await usuariosDAO.selectAllUsuarios()

        if (dadosUsuarios) {
            if (dadosUsuarios.length > 0) {
                usuariosJSON.usuarios = dadosUsuarios
                usuariosJSON.quantidade = dadosUsuarios.length
                usuariosJSON.status_code = 200

                return usuariosJSON
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

//função para listar dados de um usuário com base no id
const getBuscarUsuario = async (idUsuario) =>{

    try {
        if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let usuarioJSON = {}
            let dadosUsuario = await usuariosDAO.selectUsuarioById(idUsuario)

            if (dadosUsuario) {
                if (dadosUsuario.length > 0) {
        
                    usuarioJSON.usuario = dadosUsuario
                    usuarioJSON.status_code = 200

                    return usuarioJSON
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
    setInserirNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario,
    getListarUsuarios,
    getBuscarUsuario
}