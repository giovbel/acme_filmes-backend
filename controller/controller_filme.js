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
const filmesDAO = require('../model/DAO/filme.js');
const classificacaoDAO = require('../model/DAO/classificacao.js');
const generoDAO = require('../model/DAO/genero.js');
const nacionalidadeDAO = require('../model/DAO/nacionalidade.js');

const controller_ator = require('../controller/controller_ator.js')
const controller_diretor = require('../controller/controller_diretor.js')

//função para inserir um novo filme
const setInserirNovoFilme = async function (dadosFilme, contentType) {

    try{
    
    //validação de content-type (apenas a application/json)
    if (String(contentType).toLowerCase() == 'application/json'){

    //cria o objeto JSON paa devolver os dados  criados na requisição
    let novoFilmeJSON = {};

    //validação de campos obrigatórios ou com digitação inválida
    if (dadosFilme.nome == '' || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
        dadosFilme.sinopse == '' || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
        dadosFilme.duracao == '' || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
        dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
        dadosFilme.foto_capa == '' || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
        dadosFilme.foto_fundo == '' || dadosFilme.foto_fundo == undefined || dadosFilme.foto_fundo == null || dadosFilme.foto_fundo.length > 200 ||
        dadosFilme.valor_unitario.length > 6
    ) {

        return message.ERROR_REQUIRED_FIELDS //400

    } else {

        let validateStatus

        //validação da data de relancamento, ja qe ela não é obrigatória no BD
        if (dadosFilme.data_relacamento != null &&
            dadosFilme.data_relacamento != '' &&
            dadosFilme.data_relacamento != undefined) {

            //validação para ver se a data está com a qtde de digitoss correta
            if (dadosFilme.data_relacamento.length != 10) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                validateStatus = true
            }
        } else {
            validateStatus = true
        }

        //validaçao para verificar se a variável booleana é verdadeira
        if (validateStatus) {

            //encaminha os dados do filme para o DAO inserir no banco de dados
            let novoFilme = await filmesDAO.insertFilme(dadosFilme)
            let idNovoFilme = await filmesDAO.selectLastInsertId()

            let novoFilmeAtor 

            dadosFilme.ator.forEach( async (ator) => {
                novoFilmeAtor = await filmesDAO.insertAtorFilme(ator, idNovoFilme)
            });

            let novoFilmeDiretor 

            dadosFilme.diretor.forEach( async (diretor) => {
                novoFilmeDiretor = await filmesDAO.insertDiretorFilme(diretor, idNovoFilme)
            });


            
            //validação para verificar se o DAO inseriu os dados do BD
            if (novoFilme) {

                //Cria o JSON de retorno dos dados (201)
                novoFilmeJSON.filme = dadosFilme
                novoFilmeJSON.filme.id = Number(idNovoFilme)
                novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM

                return novoFilmeJSON //201
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }
    }
}else{
    return message.ERROR_CONTENT_TYPE //415
}
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
    
}

//função para atualizar um filme
const setAtualizarFilme = async function (dadosAtualizados, id, contentType) {

    try {
        if(id == '' || id == undefined || isNaN(id)){
            return message.ERROR_INVALID_ID //400
        }else{
            if(dadosAtualizados == '' || dadosAtualizados == undefined ||
               dadosAtualizados.nome == '' || dadosAtualizados.nome == undefined || dadosAtualizados.nome == null || dadosAtualizados.nome.length > 80 ||
               dadosAtualizados.sinopse == '' || dadosAtualizados.sinopse == undefined || dadosAtualizados.sinopse == null || dadosAtualizados.sinopse.length > 65000 ||
               dadosAtualizados.duracao == '' || dadosAtualizados.duracao == undefined || dadosAtualizados.duracao == null || dadosAtualizados.duracao.length > 8 ||
               dadosAtualizados.data_lancamento == '' || dadosAtualizados.data_lancamento == undefined || dadosAtualizados.data_lancamento == null || dadosAtualizados.data_lancamento.length != 10 ||
               dadosAtualizados.foto_capa == '' || dadosAtualizados.foto_capa == undefined || dadosAtualizados.foto_capa == null || dadosAtualizados.foto_capa.length > 200 ||
               dadosAtualizados.foto_fundo == '' || dadosAtualizados.foto_fundo == undefined || dadosAtualizados.foto_fundo == null || dadosAtualizados.foto_fundo.length > 200 ||
               dadosAtualizados.valor_unitario.length > 6
            ){
                return message.ERROR_REQUIRED_FIELDS 
            }else{
                let dadosAtualizado = await filmesDAO.updateFilme(id, dadosAtualizados)

                if(dadosAtualizado){
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


//função para excluir um filme
const setExcluirFilme = async function (id) {

    try {
        //validação do id
        if(id == '' || id == undefined || isNaN(id)){
            return message.ERROR_INVALID_ID //400
        }else{
            let atorDeletado = await filmesDAO.deleteAtorFilme(id)
            
            let diretorDeletado = await filmesDAO.deleteDiretorFilme(id)
            

            let filmeDeletado = await filmesDAO.deleteFilme(id)

            
            if(filmeDeletado){
                return message.SUCCESS_DELETED_ITEM //201
            }else{
                return false
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500
    }
}

//função para listar todos os filmes
const getListarFilmes = async function () {

    //cria um objeto JSON
    let filmesJSON = {};

    //chama a função do DAO que retorna os filmes do BD
    let dadosFilme = await filmesDAO.selectAllFilmes() //-> pede pro filmesDAO trazer todos os filmes do banco

    await Promise.all(dadosFilme.map(async function (filme){
        let dadosAtor = await controller_ator.getBuscarAtorPeloFilme(filme.id)
        filme.elenco = dadosAtor
    }))

    await Promise.all(dadosFilme.map(async function (filme){
        let dadosDiretor = await controller_diretor.getDiretorPorFilme(filme.id)
        filme.diretores = dadosDiretor
    }))

    await Promise.all(dadosFilme.map(async function (filme){
        let dadosClassificacao = await classificacaoDAO.selectClassficacaoByFilme(filme.id)
        filme.classificacao = [dadosClassificacao]
    }))

    await Promise.all(dadosFilme.map(async function (filme){
        let dadosGenero = await generoDAO.selectGeneroByFilme(filme.id)
        filme.genero = [dadosGenero]
    }))

    await Promise.all(dadosFilme.map(async function (filme){
        let dadosNacionalidade = await nacionalidadeDAO.selectByFilmeNacio(filme.id)
        filme.nacionalidade = [dadosNacionalidade]
    }))


    //validação para verificar se o DAO retonou dados
    if (dadosFilme) {
        //criar o JSON para desenvolver o APP
        
        filmesJSON.filmes = dadosFilme;
        filmesJSON.quantidade = dadosFilme.length;
        filmesJSON.status_code = 200

        return filmesJSON
    } else {
        return false
    }
}

//função para buscar um filme pelo id 
const getBuscarFilme = async function (id) {

    //recebe o id do filme 
    let idFilme = id;

    //cria o objeto JSON
    let filmeJSON = {};

    
    //validação para verificar se o id é válido (vazio, inefiido e não numérico)
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID //400
    } else {

        //encaminha para o DAO localizar o id do filme
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        await Promise.all(dadosFilme.map(async function (filme){
            let dadosAtor = await controller_ator.getBuscarAtorPeloFilme(filme.id)
            filme.elenco = dadosAtor
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosDiretor = await controller_diretor.getDiretorPorFilme(filme.id)
            filme.diretores = dadosDiretor
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosClassificacao = await classificacaoDAO.selectClassficacaoByFilme(filme.id)
            filme.classificacao = [dadosClassificacao]
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosGenero = await generoDAO.selectGeneroByFilme(filme.id)
            filme.genero = [dadosGenero]
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosNacionalidade = await generoDAO.selectGeneroByFilme(filme.id)
            filme.genero = [dadosNacionalidade]
        }))
    

        //validação para verificar se existe dados de retorno
        if (dadosFilme) {

            //validação para verificar a quantidade de itens encontrado
            if (dadosFilme.length > 0) {
                //cria o JSON de return
                filmeJSON.filme = dadosFilme;
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND //404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }

}

//função para buscar um filme pelo nome ?
const getBuscarFilmeNome = async function (nome) {

    //recebe o id do filme 
    let nomeFilme = nome;

    //cria o objeto JSON
    let filmeJSON = {};

    


    //validação para verificar se o id é válido (vazio, inefiido e não numérico)
    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_INVALID_ID //400
    } else {

        //encaminha para o DAO localizar o id do filme
        let dadosFilme = await filmesDAO.selectByNomeFilme(nomeFilme)

        await Promise.all(dadosFilme.map(async function (filme){
            let dadosAtor = await controller_ator.getBuscarAtorPeloFilme(filme.id)
            filme.elenco = dadosAtor
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosDiretor = await controller_diretor.getDiretorPorFilme(filme.id)
            filme.diretores = dadosDiretor
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosClassificacao = await classificacaoDAO.selectClassficacaoByFilme(filme.id)
            filme.classificacao = [dadosClassificacao]
        }))
    
        await Promise.all(dadosFilme.map(async function (filme){
            let dadosGenero = await generoDAO.selectGeneroByFilme(filme.id)
            filme.genero = [dadosGenero]
        }))
 
        //validação para verificar se existe dados de retorno
        if (dadosFilme) {

            //validação para verificar a quantidade de itens encontrado
            if (dadosFilme.length > 0) {
                //cria o JSON de return
                filmeJSON.filme = dadosFilme;
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
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