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
const diretoresDAO = require('../model/DAO/diretor.js');
const controllerNacionalidade = require('../controller/controller_nacionalidade.js')

//função para inserir um novo diretor
const setInserirNovoDiretor = async function (dadosDiretor, contentType) {

    try {

    //validação de content-type (apenas a application/json)
    if (String(contentType).toLowerCase() == 'application/json') {

    //cria o objeto JSON paa devolver os dados  criados na requisição
    let novoDiretorJSON = {}

    //validação de campos obrigatórios ou com digitação inválida
    if (dadosDiretor.nome == "" || dadosDiretor.nome == undefined || dadosDiretor.nome == null || dadosDiretor.nome.length > 80 ||
        dadosDiretor.nome_artistico == "" || dadosDiretor.nome_artistico == undefined || dadosDiretor.nome_artistico == null || dadosDiretor.nome_artistico.length > 18 ||
        dadosDiretor.data_nascimento == "" || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length > 15  ||
        dadosDiretor.biografia == "" || dadosDiretor.biografia == undefined || dadosDiretor.biografia == null || 
        dadosDiretor.nacionalidade.length == 0
    ) {

        return message.ERROR_REQUIRED_FIELDS
    
    } else {

        let validateFalecimento = false

        //validação da data de falecimento (ela não é obrigatória no BD)
        if (dadosDiretor.data_falecimento != null &&
            dadosDiretor.data_falecimento != "" && 
            dadosDiretor.data_falecimento != undefined) {

            //validação para ver se a data está com a qtde de digitos correta
            if (dadosDiretor.data_falecimento.length != 10){
                    return message.ERROR_REQUIRED_FIELDS //400
            }else {
                validateFalecimento = true
            }      
        } else {
            validateFalecimento = true
        }

        //validaçao para verificar se a variável booleana é verdadeira
        if(validateFalecimento){

            //encaminha os dados do diretor para o DAO inserir no banco de dados
            let novoDiretor = await diretoresDAO.insertDiretor(dadosDiretor)
            console.log(novoDiretor)
            let idNovoDiretor = await diretoresDAO.selectLastInsertId()
            
            let novaNacionalidadeDiretor 

                dadosDiretor.nacionalidade.forEach(async idNacionalidade =>{
                if(!isNaN(idNacionalidade)){
                novaNacionalidadeDiretor = await diretoresDAO.insertNacioDiretor(idNovoDiretor, idNacionalidade)
                }
                else {
                    return message.ERROR_INVALID_VALUE
                }                
            })

            //validação para verificar se o DAO inseriu os dados do BD
            let diretorInserido = await diretoresDAO.selectDiretorById(idNovoDiretor)

                //Cria o JSON de retorno dos dados (201)
                if (novoDiretor) {
                    novoDiretorJSON.diretor = diretorInserido
                    novoDiretorJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoDiretorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoDiretorJSON.message = message.SUCCESS_CREATED_ITEM.message
    
                    return novoDiretorJSON //201
                } else {

                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }
        }
} else {
    return message.ERROR_CONTENT_TYPE //415
}
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

//função para atualizar um diretor
const setAtualizarDiretor = async function (idDiretor, dadosDiretor, contentType){

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                return message.ERROR_INVALID_ID  //400
        } else {
            if (dadosDiretor.nome == ""            || dadosDiretor.nome == undefined            || dadosDiretor.nome == null            || dadosDiretor.nome.length > 80            ||
                dadosDiretor.nome_artistico == ""  || dadosDiretor.nome_artistico == undefined  || dadosDiretor.nome_artistico == null  || dadosDiretor.nome_artistico.length > 18  ||
                dadosDiretor.data_nascimento == "" || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length > 15 ||
                dadosDiretor.biografia == ""       || dadosDiretor.biografia == undefined       || dadosDiretor.biografia == null 
            ){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let nacionalidadesAntigas = await controllerNacionalidade.getNacionalidadeByDiretor(idDiretor)
                let diretorAtualizado = await diretoresDAO.updateDiretor(idDiretor, dadosDiretor)

                        let count = 0
                        let nacionalidadeDiretorAtualizada
                        nacionalidadesAntigas.forEach(async nacionalidadeAntiga =>{
                            nacionalidadeDiretorAtualizada = await diretoresDAO.updateNacionalidadeDiretor(idDiretor, dadosDiretor.nacionalidade[count], nacionalidadeAntiga.id)
                            count ++
                        })


                        let dadosDiretorAtualiazado = await getBuscarDiretor(idDiretor)

                        let diretorAtualizadoJSON = {}

           
                        if (diretorAtualizado){
                            diretorAtualizadoJSON.diretor = dadosDiretorAtualiazado.diretor
                            diretorAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            diretorAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            diretorAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return diretorAtualizadoJSON
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

const setExcluirDiretor = async function (idDiretor) {

    console.log(idDiretor)
    try {

        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let nacionalidadeDiretorDeletada = await diretoresDAO.deleteNacionalidadeDiretor(idDiretor)
            let diretorDeletado = await diretoresDAO.deleteDiretor(idDiretor)

            if (diretorDeletado && nacionalidadeDiretorDeletada) {
                return message.SUCCESS_DELETED_ITEM 
            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER 
    }
}


const getListarDiretores = async function () {

    try {

        let diretoresJSON = {};
        let dadosDiretores = await diretoresDAO.selectAllDiretores();

        await Promise.all(dadosDiretores.map(async (diretor) => {
            let nacionalidadeDiretor = await controllerNacionalidade.getNacionalidadeByDiretor(diretor.id);
            diretor.nacionalidade = nacionalidadeDiretor;
        }));
        
        if (dadosDiretores) {

            if (dadosDiretores.length > 0) {

                diretoresJSON.diretores = dadosDiretores;
                diretoresJSON.quantidade = dadosDiretores.length;
                diretoresJSON.status_code = 200;

                return diretoresJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER;
    }
}

const getBuscarDiretor = async (idDiretor) =>{

    try {
        
        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let diretorJSON = {}
            let dadosDiretor = await diretoresDAO.selectDiretorById(idDiretor)
        
            if (dadosDiretor) {

                if (dadosDiretor.length > 0) {
                    diretorJSON.diretor = dadosDiretor
                    dadosDiretor[0].nacionalidade = await controllerNacionalidade.getNacionalidadeByDiretor(idDiretor);
                    diretorJSON.status_code = 200

                return diretorJSON
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

const getDiretorPorFilme = async (idFilme)=>{
    
    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let diretorArray = []
            let dadosDiretores = await diretoresDAO.selectByFilmeDiretor(idFilme)

            await Promise.all(dadosDiretores.map(async (diretor) => {
                let nacionalidadeDiretor = await controllerNacionalidade.getNacionalidadeByDiretor(diretor.id);
                diretor.nacionalidade = nacionalidadeDiretor;
            }));

            dadosDiretores.forEach(diretor =>{
                diretorArray.push(diretor)
            })

            if (dadosDiretores) {
                if (dadosDiretores.length > 0) {
                    return diretorArray

                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }
    } catch (error) {
        console.log(error)
        return [message.ERROR_INTERNAL_SERVER]
    }
}


module.exports = {
    setInserirNovoDiretor,
    setAtualizarDiretor,
    setExcluirDiretor,
    getListarDiretores,
    getBuscarDiretor,
    getDiretorPorFilme
}