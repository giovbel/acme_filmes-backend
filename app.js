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
    response.header('Access-Control-Allow-Methods', 'GET')

    //ativa as configurações de permissão no cors
    app.use(cors());


    next();
})

//********************************import dos arquivos de controller do projeto***************************************

const controllerFilmes = require('./controller/controller_filme.js')

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

app.listen('8080', function(){
    console.log('API funcionando!!!')
})