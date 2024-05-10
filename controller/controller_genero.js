/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de genero
 * Data: 11/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const generoDAO = require('../model/DAO/genero.js');

//função para inserir um novo genero
const setInserirNovoGenero = async function (dadosGenero, contentType) {

    try {

        if(String(contentType).toLowerCase() == 'application/json'){

            let generoAtualizadoJSON = {}

            if(dadosGenero.nome == "" || dadosGenero.nome == undefined || dadosGenero.nome == null || dadosGenero.nome .length > 45){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let generoNovo = await generoDAO.insertGenero(dadosGenero)
                let idNovo = await generoDAO.selectLastInsertId()

                if(generoNovo){

                    generoAtualizadoJSON.genero = dadosGenero
                    generoAtualizadoJSON.genero.id = idNovo
                    generoAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    generoAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    generoAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return generoAtualizadoJSON
                } else {
                    message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
        
}

//função para atualizar um genero
const setAtualizarGenero = async function (idGenero, dadosGenero, contentType) {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let generoAtualizadoJSON = {}

            if (idGenero == "" || idGenero == undefined || isNaN(idGenero)) {
                return message.ERROR_INVALID_ID
            } else {

                let generoAtualizado = await generoDAO.updateGenero(idGenero, dadosGenero)

                if (generoAtualizado) {
                    generoAtualizadoJSON.genero = dadosGenero
                    generoAtualizadoJSON.genero.id = idGenero
                    generoAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                    generoAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                    generoAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message
                
                    return generoAtualizadoJSON                
                } else {
                    message.ERROR_INTERNAL_SERVER_DB
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

// Função para excluir um gênero
const setExcluirGenero = async (idGenero) => {
    try {
        if (!idGenero || idGenero.trim() === "" || isNaN(idGenero)) {
            return message.ERROR_INVALID_ID;
        } else {
            //generoDAO.deleteGenero retorna true se a exclusão for bem-sucedida
            let generoDeletado = await generoDAO.deleteGenero(idGenero);

            if (generoDeletado) {
                return message.SUCCESS_DELETED_ITEM;
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

//função para listar todos os generos
const getListarGeneros = async () => {

    try {
        let generosJSON = {}
        let dadosGenero = await generoDAO.selectAllGeneros()

        if (dadosGenero) {

            if (dadosGenero.length > 0) {
                generosJSON.generos = dadosGenero
                generosJSON.quantidade = dadosGenero.length
                generosJSON.status_code = 200

                return generosJSON
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

//função para buscar um genero pelo id 
const getBuscarGenero = async (idGenero) => {

    try {
        if (idGenero == "" || idGenero == undefined || isNaN(idGenero)) {
            return message.ERROR_INVALID_ID
        } else {
            let generoJSON = {}
            let dadosGenero = await generoDAO.selectGeneroById(idGenero)

            if (dadosGenero) {
                if (dadosGenero.length > 0) {
                    generoJSON.generos = dadosGenero
                    generoJSON.quantidade = dadosGenero.length
                    generoJSON.status_code = 200

                    return generoJSON
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
    setInserirNovoGenero,
    setAtualizarGenero,
    setExcluirGenero,
    getListarGeneros,
    getBuscarGenero
}