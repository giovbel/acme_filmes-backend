/***********************************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de atores
 * Data: 18/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * 
 * *********************************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//import do arquivo responsável pela interação com o banco de dados
const atoresDAO = require('../model/DAO/ator.js');
const controllerNacionalidade = require('../controller/controller_nacionalidade.js')

//função para inserir um novo ator
const setInserirNovoAtor = async function (dadosAtor, contentType) {

    try {

    //validação de content-type (apenas a application/json)
    if (String(contentType).toLowerCase() == 'application/json') {  

    //cria o objeto JSON paa devolver os dados  criados na requisição
    let atorNovoJSON = {}

    //validação de campos obrigatórios ou com digitação inválida
    if (dadosAtor.nome == ""           || dadosAtor.nome == undefined           || dadosAtor.nome == null            || dadosAtor.nome.length > 80            ||
        dadosAtor.nome_artistico == "" || dadosAtor.nome_artistico == undefined || dadosAtor.nome_artistico == null  || dadosAtor.nome_artistico.length > 18  ||
        dadosAtor.data_nascimento == ""|| dadosAtor.data_nascimento == undefined|| dadosAtor.data_nascimento == null || dadosAtor.data_nascimento.length > 15 ||
        dadosAtor.biografia == ""      || dadosAtor.biografia == undefined      || dadosAtor.biografia == null ||
        dadosAtor.foto == ""           || dadosAtor.foto == undefined           ||  dadosAtor.foto == null  
    ) {

       return message.ERROR_REQUIRED_FIELDS //400
    
    } else {

        let validateFalecimento = false

        //validação da data de falecimento (ela não é obrigatória no BD)
        if (dadosAtor.data_falecimento != null && 
            dadosAtor.data_falecimento != "" && 
            dadosAtor.data_falecimento != undefined) {

            //validação para ver se a data está com a qtde de digitos correta
            if (dadosAtor.data_falecimento.length != 10){
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                validateFalecimento = true
            }
        } else {
            validateFalecimento = true
        }
        
        //validaçao para verificar se a variável booleana é verdadeira
        if(validateFalecimento){
            
            //encaminha os dados do ator para o DAO inserir no banco de dados
            let novoAtor = await atoresDAO.insertAtor(dadosAtor)
            let idAtorNovo = await atoresDAO.selectLastInsertId()

            let novaNacionalidadeAtor 

            dadosAtor.nacionalidade.forEach(async idNacionalidade =>{
            if(!isNaN(idNacionalidade)){
                novaNacionalidadeAtor = await atoresDAO.insertNacionalidadeAtor( idAtorNovo, idNacionalidade)
            }
            else {
                return message.ERROR_INVALID_VALUE
            }                
        })

            //validação para verificar se o DAO inseriu os dados do BD
            let atorInserido = await atoresDAO.selectAtorById(idAtorNovo)

            if (novoAtor) {

                //Cria o JSON de retorno dos dados (201)
                atorNovoJSON.ator = atorInserido
                atorNovoJSON.status = message.SUCCESS_CREATED_ITEM.status
                atorNovoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                atorNovoJSON.message = message.SUCCESS_CREATED_ITEM.message

                return atorNovoJSON //201
            } else {
                
               return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }
    }
}else{
    return message.ERROR_CONTENT_TYPE //415
}
    }catch(error){
        console.log(error)
       return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }

}

//função para atualizar um ator
const setAtualizarAtor = async function (id,dadosAtor, contentType) {

    try {
        if(id == '' || id == undefined || isNaN(id)){
            console.log(id)
            return message.ERROR_INVALID_ID //400
        }else{
            if(dadosAtor.nome == ""                 || dadosAtor.nome == undefined            || dadosAtor.nome == null                 || dadosAtor.nome.length > 80 ||
               dadosAtor.nome_artistico == ""       || dadosAtor.nome_artistico == undefined  || dadosAtor.nome_artistico == null       || dadosAtor.nome_artistico.length > 18 || 
               dadosAtor.data_nascimento == ""      || dadosAtor.data_nascimento == undefined || dadosAtor.data_nascimento == null      || dadosAtor.data_nascimento.length > 15 || 
               dadosAtor.biografia == ""            || dadosAtor.biografia == undefined       ||  dadosAtor.biografia == null ||
               dadosAtor.foto == ""                 || dadosAtor.foto == undefined            ||  dadosAtor.foto == null  
            ){
                return message.ERROR_REQUIRED_FIELDS 
            }else{
                let dadosAtualizados = await atoresDAO.updateAtor(id, dadosAtor)
                let nacioAtualizada

                dadosAtor.nacionalidade.forEach(async nacionalidade => {
                 nacioAtualizada = await atoresDAO.updateNacionalidadeAtor(nacionalidade, id)
                });

                if(dadosAtualizados){
                    return message.SUCCESS_UPDATED_ITEM //201
            }else{
                
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }

}
 } catch (error) {
    console.log(error)
    return message.ERROR_INTERNAL_SERVER
}
}

//função para excluir um ator
const setExcluirAtor = async function (id) {

    try {
        if (id == "" || id == undefined || isNaN(id)) {

            return message.ERROR_INVALID_ID
        } else {
            let filmeDeletado = await atoresDAO.deleteAtorFilme(id)
            let nacionalidadeDeletada = await atoresDAO.deleteAtorNacionalidade(id)
        let atorDeletado = await atoresDAO.deleteAtor(id)


        if (atorDeletado) {
                return message.SUCCESS_DELETED_ITEM 
        } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER 
    }
}

//função para listar todos os atores
const getListarAtores = async function () {

    //cria um objeto JSON
    let atoresJSON = {};

    //chama a função do DAO que retorna os atores do BD
    let dadosAtores = await atoresDAO.selectAllAtores() //-> pede pro filmesDAO trazer todos os filmes do banco

    await Promise.all(dadosAtores.map(async function (ator){
        let dadosNacio = await controllerNacionalidade.getNacionalidadeByAtor(ator.id)
        ator.nacionalidade = dadosNacio
    }))

    

    //validação para verificar se o DAO retonou dados
    if (dadosAtores) {
        if (dadosAtores.length > 0) {

            atoresJSON.atores = dadosAtores;
            atoresJSON.quantidade = dadosAtores.length;
            atoresJSON.status_code = 200;

            return atoresJSON;
        } else {
            return message.ERROR_NOT_FOUND;
      }
} else {
        return false
    }
}

//função para buscar um ator pelo id 
const getBuscarAtor = async function (id) {

 //recebe o id do ator
 let idAtor = id;

 //cria o objeto JSON
 let atorJSON = {};

 //validação para verificar se o id é válido (vazio, inefiido e não numérico)
 if (idAtor == '' || idAtor == undefined || isNaN(idAtor)) {
     return message.ERROR_INVALID_ID //400
 } else {

     //encaminha para o DAO localizar o id do ator
     let dadosAtor = await atoresDAO.selectAtorById(idAtor)

     await Promise.all(dadosAtor.map(async function (ator){
        let dadosNacio = await controllerNacionalidade.getNacionalidadeByAtor(ator.id)
        ator.nacionalidade = dadosNacio
    }))

     //validação para verificar se existe dados de retorno
     if (dadosAtor) {

        if (dadosAtor.length > 0) {
            atorJSON.ator = dadosAtor
            atorJSON.status_code = 200

            return atorJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
     } else {
         return message.ERROR_INTERNAL_SERVER_DB //500
     }
 }
}

const getBuscarAtorPeloFilme = async function (idFilme) {

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {

            return [message.ERROR_INVALID_ID]
            
        } else {
            let atorArray = []
            let dadosAtores = await atoresDAO.selectAtorByIdFilme(idFilme)

            dadosAtores.forEach(ator =>{
                atorArray.push(ator)
            })

            if (dadosAtores) {

            if (dadosAtores.length > 0) {
                return atorArray
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
    setInserirNovoAtor,
    setAtualizarAtor,
    setExcluirAtor,
    getListarAtores,
    getBuscarAtor,
    getBuscarAtorPeloFilme
}