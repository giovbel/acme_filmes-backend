/**************************************************************
 * Objetivo: Arquivo para realizar as requisições de filmes
 * Data: 30/01/2024
 * Autora: Giovanna
 * Versão: 1.0
 ************************************************************/

/**
 * Para realizar a integração com o Banco De Dados devemos utilizar uma das seguintes bibliotecas:
 *      - SEQUILIZE  - É a biblioteca mais antiga
 *      - PRISMA ORM - É a biblioteca mais atual (utilizaremos no projeto)
 *      - FASTFY ORM - É a biblioteca mais atual
 * 
 *      Para a instalação do PRISMA ORM:
 *          npm install prisma --save  - responsável pela conexão com o banco
 *          npm install @prisma/client --save  - responsável por executar scripts SQL no banco
 *          npx prisma init - responsável por iniciar o prisma no projeto
 * 
 * *************/

//import das bibliotecas para criar a API
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nextTick } = require('process');


//criando um objeto app para manipular as requisições da API
const app = express();



//funçaio para manipular as restrições da API (HEADER)
app.use((request, response, next) =>{
    //permite especificar quem poderá acessar a API ('*' = liberar acesso público, 'IP' = liberar acesso apenas para aquela máquina)
    response.header('Access-Control-Allow-Origin', '*')


    //Permite especificar como a API, será requisitada (GET, POST, PUT e DELETE)
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')

    request.header('Content-Type', 'application/json')

    //ativa as configurações de permissão no cors
    app.use(cors());


    next();
})

//********************************import dos arquivos de controller do projeto***************************************

const controllerFilmes = require('./controller/controller_filme.js')
const controllerGeneros = require('./controller/controller_genero.js')
const controllerClassificacoes = require('./controller/controller_classificacao.js')
const controllerUsuarios = require('./controller/controller_usuario.js')
const controllerAtores = require('./controller/controller_ator.js')
const controllerNacionalidade = require('./controller/controller_nacionalidade.js')
const controllerDiretor = require('./controller/controller_diretor.js')
const controllerFuncionario = require('./controller/controller_funcionario.js')


//********************************************************************************************************************

//criando um objeto para controlar a chegada dos dados da requisição em formato json
const bodyParserJSON = bodyParser.json()



//********************************ENDPOINTS DE FILME***************************************

//EndPoints: Versão 1.0 que retorna os arquivos de filmes
//Período de utilização 01/2024 até 02/2024
app.get('/v1/acmeFilmes/filmes', cors(), async function(request, response, next){

    let controllerFilmes = require('./controller/functions.js')
    
    let listaFilmes = controllerFilmes.getListaDeFilmes();
    
    if(listaFilmes){
     response.json(listaFilmes);
     response.status(200);
    }else{
        response.status(404);
    }
    next()
})

//Endpoints: Versão 2.0 - retorna os dados de filme do banco de dados
app.get('/v2/acmeFilmes/filmes', cors(), async function(request,response){

    let dadosFilme = await controllerFilmes.getListarFilmes(); 

    response.status(dadosFilme.status_code) 
    response.json(dadosFilme)
})

//EndPoints: Lista dados dos Filmes pelo id
// app.get('/v1/acmeFilmes/filme/:idFilme', cors(), async function(request, response, next){
    
//     let idFilme = request.params.idFilme;
//     let controllerFilmes = require('./controller/functions.js')
//     let filmeById = controllerFilmes.getDadosFilme(idFilme);
    
//     if(filmeById){
//      response.json(filmeById);
//      response.status(200);
//     }else{
//         response.status();
//     }
//     next()
// })

//EndPoints: Lista dados dos Filmes pelo nome
app.get('/v2/acmeFilmes/filmes/filtro', cors(), async function(request, response, next){
    
    let nomeFilme = request.query.nome; 
    let dadosFilme = await controllerFilmes.getBuscarFilmeNome(nomeFilme); 

    response.status(dadosFilme.status_code) 
    response.json(dadosFilme)
})

//EndPoints: Retorna os dados filtrando pelo id
app.get('/v2/acmeFilmes/filme/:id', cors(), async function(request, response, next){
    
    let idFilme = request.params.id; //receber o id do filme
    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme); //encaminha o id para a controller buscar o filme

    response.status(dadosFilme.status_code) //retorno
    response.json(dadosFilme)
})

app.post('/v2/acmeFilmes/filme', cors(), bodyParserJSON, async function (request, response){

    //recebe o content type (ele mostra o tipo de dados) da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body;

    //encaminha os dados para o controller enviar para o DAO
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})

app.delete('/v2/acmeFilmes/filme/:id', cors(), async function (request, response){

    let idFilme = request.params.id;
    let filmeDeletado = await controllerFilmes.setExcluirFilme(idFilme); 

    console.log(filmeDeletado)

    response.status(filmeDeletado.status_code) 
    response.json(filmeDeletado)
})

app.put('/v2/acmeFilmes/filme/:id', cors(), bodyParserJSON, async function (request, response){

    let idFilme = request.params.id;
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let filmeAtualizado = await controllerFilmes.setAtualizarFilme(dadosBody,idFilme, contentType); 

    response.json(filmeAtualizado)
    response.status(filmeAtualizado.status_code)
})

//********************************ENDPOINTS DE GÊNERO***************************************

//Endpoints: retorna a lista de generos do banco de dados
app.get('/v2/AcmeFilmes/generos', cors(), async function (request, response){

    let listaDeGeneros = await controllerGeneros.getListarGeneros()

    if(listaDeGeneros){
        response.json(listaDeGeneros)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro para retornar generos pelo id 
app.get('/v2/AcmeFilmes/genero/:id', cors(), async function (request, response){

    let idGenero = request.params.id
    let genero = await controllerGeneros.getBuscarGenero(idGenero)

    if(genero){
        response.json(genero)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro para adicionar um novo genero
app.post('/v2/AcmeFilmes/genero', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultadoNovoGenero = await controllerGeneros.setInserirNovoGenero(dadosBody, contentType)

    response.json(resultadoNovoGenero)
})

//Endpoints: filtro para atualizar um genero
app.put('/v2/AcmeFilmes/genero/:id', cors(), bodyParserJSON, async  function(request, response){

    let idGenero = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let generoAtualizado = await controllerGeneros.setAtualizarGenero(idGenero, dadosBody, contentType)

    response.json(generoAtualizado)
    response.status(generoAtualizado.status_code)
})


//Endpoints: filtro para excluir um genero
app.delete('/v2/AcmeFilmes/genero/:id', cors(), bodyParserJSON, async function(request, response){

    let idGenero = request.params.id
    let generoDeletado = await controllerGeneros.setExcluirGenero(idGenero)

    response.json(generoDeletado)
    response.status(generoDeletado.status_code)
})

//********************************ENDPOINTS DE CLASSIFICAÇÃO***************************************

//Endpoints: retorna a lista de classificacoes do banco de dados
app.get('/v2/AcmeFilmes/classificacoes', cors(), async (request, response) =>{

    let listaDeClassificacoes = await controllerClassificacoes.getListarClassificacoes()

    if(listaDeClassificacoes){
        response.json(listaDeClassificacoes)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: retorna dados da classificacoes pelo id
app.get('/v2/AcmeFilmes/classificacoes/:id', cors(), async function (request, response){

    let idClassificacao = request.params.id
    let classificacao = await controllerClassificacoes.getBuscarClassificacao(idClassificacao)

    if(classificacao){
        response.json(classificacao)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }

})

//Endpoints: filtro para adicionar uma nova classificacao
app.post('/v2/AcmeFilmes/classificacoes', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultadoDadosNovaClassificacaco = await controllerClassificacoes.setInserirNovaClassificacao(dadosBody, contentType)
    
    response.status(resultadoDadosNovaClassificacaco.status_code)
    response.json(resultadoDadosNovaClassificacaco)
})

//Endpoints: filtro para atualizar uma nova classificacao
app.put('/v2/AcmeFilmes/classificacoes/:id', cors(), bodyParserJSON, async function(request, response){

    let idClassificacao = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let classificacaoAtualizada = await controllerClassificacoes.setAtualizarClassificacao(dadosBody,idClassificacao, contentType)

    response.json(classificacaoAtualizada)
    response.status(classificacaoAtualizada.status_code)
})

//Endpoints: filtro para deletar uma classificacao
app.delete('/v2/AcmeFilmes/classificacoes/:id', cors(), bodyParserJSON, async function(request, response){

    let idClassificacao = request.params.id
    let classificacaoDeletada = await controllerClassificacoes.setExcluirClassificacao(idClassificacao)

    response.json(classificacaoDeletada)
    response.status(classificacaoDeletada.status_code)
})

//********************************ENDPOINTS DE USUÁRIOS***************************************

//Endpoints: retorna a lista de usuarios do banco de dados
app.get('/v2/AcmeFilmes/usuarios', cors(), async (request, response) =>{

    let listaDeUsuarios = await controllerUsuarios.getListarUsuarios()
    
    if(listaDeUsuarios){
        response.json(listaDeUsuarios)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: retorna a lista dados do usuário com base no id
app.get('/v2/AcmeFilmes/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id
    let dadosUsuario = await controllerUsuarios.getBuscarUsuario(idUsuario)

        response.status(dadosUsuario.status_code)
        response.json(dadosUsuario)
})

//Endpoints: filtro para adicionar um novo usuário
app.post('/v2/AcmeFilmes/usuario', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultDadosNovoUsuario = await controllerUsuarios.setInserirNovoUsuario(dadosBody, contentType)
    
    response.status(resultDadosNovoUsuario.status_code)
    response.json(resultDadosNovoUsuario)
})

//Endpoints: filtro para atualizar um usuário
app.put('/v2/AcmeFilmes/usuario/:id', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let usuarioAtualizado = await controllerUsuarios.setAtualizarUsuario(idUsuario, dadosBody, contentType)

    response.json(usuarioAtualizado)
    response.status(usuarioAtualizado.status_code)
})

//Endpoints: filtro para deletar um usuário
app.delete('/v2/AcmeFilmes/usuario/:id', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.params.id
    let usuarioDeletado = await controllerUsuarios.setExcluirUsuario(idUsuario)

    response.json(usuarioDeletado)
    response.status(usuarioDeletado.status_code)
})

//********************************ENDPOINTS DE ATOR***************************************

//Endpoints: retorna a lista de atores do banco de dados
app.get('/v2/AcmeFilmes/atores', cors(), async (request, response) =>{

    let allAtores = await controllerAtores.getListarAtores()

    if(allAtores){
        response.json(allAtores)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro para retornar ator pelo id 
app.get('/v2/AcmeFilmes/ator/:id', cors(), async function (request, response) {

    let idAtor = request.params.id
    let dadosAtor = await controllerAtores.getBuscarAtor(idAtor)
        response.status(dadosAtor.status_code)
        response.json(dadosAtor)
})

//Endpoints: filtro para adicionar um novo ator
app.post('/v2/AcmeFilmes/ator', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultDadosNovoAtor = await controllerAtores.setInserirNovoAtor(dadosBody, contentType)
    
    response.status(resultDadosNovoAtor.status_code)
    response.json(resultDadosNovoAtor)
})

//Endpoints: filtro para atualizar um ator
app.put('/v2/AcmeFilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){

    let idAtor = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let atorAtualizado = await controllerAtores.setAtualizarAtor(idAtor, dadosBody, contentType)

    response.json(atorAtualizado)
    response.status(atorAtualizado.status_code)
})

//Endpoints: filtro para deletar um ator
app.delete('/v2/AcmeFilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){

    let idAtor = request.params.id
    let atorDeletado = await controllerAtores.setExcluirAtor(idAtor)

    response.json(atorDeletado)
    response.status(atorDeletado.status_code)
})


//********************************ENDPOINTS DE NACIONALIDADE***************************************

//Endpoints: retorna a lista de nacionalidades do banco de dados
app.get('/v2/AcmeFilmes/nacionalidades', cors(), async (request, response) =>{

    let allNacio = await controllerNacionalidade.getListarNacio()

    if(allNacio){
        response.json(allNacio)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro para retornar nacionalidade pelo id 
app.get('/v2/AcmeFilmes/nacionalidade/:id', cors(), async function (request, response){

    let idNacio = request.params.id
    let nacionalidade = await controllerNacionalidade.getBuscarNacio(idNacio)

    if(nacionalidade){
        response.json(nacionalidade)
        response.status(200)
    }else{
        response.json({erro:'Os dados não foram encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro para adicionar uma nova nacionalidade
app.post('/v2/AcmeFilmes/nacionalidade', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultDadosNovaNacio = await controllerNacionalidade.setInserirNovaNacio(dadosBody, contentType)
    
    response.status(resultDadosNovaNacio.status_code)
    response.json(resultDadosNovaNacio)
})

//Endpoints: filtro para atualizar uma nacionalidade
app.put('/v2/AcmeFilmes/nacionalidade/:id', cors(), bodyParserJSON, async function(request, response){

    let idNacio = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let nacioAtualizada = await controllerNacionalidade.setAtualizarNacio(idNacio, dadosBody, contentType)

    response.json(nacioAtualizada)
    response.status(nacioAtualizada.status_code)
})

//Endpoints: filtro para deletar uma nacionalidade
app.delete('/v2/AcmeFilmes/nacionalidade/:id', cors(), bodyParserJSON, async function(request, response){

    let idNacio = request.params.id
    let nacioDeletada = await controllerNacionalidade.setExcluirNacio(idNacio)

    response.json(nacioDeletada)
    response.status(nacioDeletada.status_code)
})


//********************************ENDPOINTS DE DIRETOR***************************************

//Endpoints: retorna a lista de diretores do banco de dados
app.get('/v2/AcmeFilmes/diretores', cors(), async (request, response) =>{

    let listaDeDiretores = await controllerDiretor.getListarDiretores()

    if(listaDeDiretores){
        response.json(listaDeDiretores)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }
})

//Endpoints: filtro retorna diretor pelo id
app.get('/v2/AcmeFilmes/diretor/:id', cors(), async function (request, response) {

    let idDiretor = request.params.id

    let dadosDiretor = await controllerDiretor.getBuscarDiretor(idDiretor)
        response.status(dadosDiretor.status_code)
        response.json(dadosDiretor)
})

//Endpoints: filtro para adicionar um novo diretor
app.post('/v2/AcmeFilmes/diretor', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultDadosNovoDiretor = await controllerDiretor.setInserirNovoDiretor(dadosBody, contentType)
    
    response.status(resultDadosNovoDiretor.status_code)
    response.json(resultDadosNovoDiretor)
})

//Endpoints: filtro para atualizar um diretor
app.put('/v2/AcmeFilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){

    let idDiretor = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let diretorAtualizado = await controllerDiretor.setAtualizarDiretor(idDiretor, dadosBody, contentType)

    response.json(diretorAtualizado)
    response.status(diretorAtualizado.status_code)
})

//Endpoints: filtro para excluir um diretor
app.delete('/v2/AcmeFilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){

    let idDiretor = request.params.id
    let diretorDeletado = await controllerDiretor.setExcluirDiretor(idDiretor)

    response.json(diretorDeletado)
    response.status(diretorDeletado.status_code)
})

//********************************ENDPOINTS DE FUNCIONARIO***************************************

app.get('/v2/AcmeFilmes/funcionarios', cors(), async (request, response) =>{

    let listaDeFuncionarios = await controllerFuncionario.getListarFuncionarios()

    if(listaDeFuncionarios){
        response.json(listaDeFuncionarios)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }
})

app.get('/v2/AcmeFilmes/funcionario/:id', cors(), async function (request, response) {

    let idFuncionario = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFuncionario = await controllerFuncionario.getBuscarFuncionario(idFuncionario)
        response.status(dadosFuncionario.status_code)
        response.json(dadosFuncionario)
})

app.post('/v2/AcmeFilmes/funcionarios', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')
    let dadosBody = request.body
    let resultDadosNovoFuncionario = await controllerFuncionario.setInserirnovoFuncionario(dadosBody, contentType)
    
    response.status(resultDadosNovoFuncionario.status_code)
    response.json(resultDadosNovoFuncionario)
})

app.put('/v2/AcmeFilmes/funcionario/:id', cors(), bodyParserJSON, async function(request, response){

    let idFuncionario = request.params.id
    let contentType = request.header('content-type')
    let dadosBody = request.body
    let funcionarioAtualizado = await controllerFuncionario.setAtualizarFuncionario(idFuncionario, dadosBody, contentType)

    response.json(funcionarioAtualizado)
    response.status(funcionarioAtualizado.status_code)
})

app.delete('/v2/AcmeFilmes/funcionario/:id', cors(), bodyParserJSON, async function(request, response){

    let idFuncionario = request.params.id
    let funcionarioDeletado = await controllerFuncionario.setExcluirFuncionario(idFuncionario)

    response.json(funcionarioDeletado)
    response.status(funcionarioDeletado.status_code)
})


//******************************************************************************************/
app.listen('8080', function(){
    console.log('API funcionando!!!')
})