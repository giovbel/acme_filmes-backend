
/* 
    npm install express --save
     é a biblioteca que vai gerenciar as requisições da 
 
    npm install body-parser --save
     é a biblioteca que vai manipular dados do corpo da requisição (POST, PUT)

    npm install cors --save
     é a biblioteca responsável pelas permissões (HEADER) de acesso das requisições
  
*/ 

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

//EndPoints: Lista todos os filmes
app.get('/v1/acmeFilmes/filmes', cors(), async function(request, response, next){
    let controleAcmeFilmes = require('./controller/functions.js')
    let listaFilmes = controleAcmeFilmes.getListaDeFilmes();
    
    if(listaFilmes){
     response.json(listaFilmes);
     response.status(200);
    }else{
        response.status();
    }
    next()
})

//EndPoints: Lista dados dos Filmes pelo id
app.get('/v1/acmeFilmes/filme/:idFilme', cors(), async function(request, response, next){
    
    let idFilme = request.params.idFilme;
    let controleAcmeFilmes = require('./controller/functions.js')
    let filmeById = controleAcmeFilmes.getDadosFilme(idFilme);
    
    if(filmeById){
     response.json(filmeById);
     response.status(200);
    }else{
        response.status();
    }
    next()
})

app.listen('8080', function(){
    console.log('API funcionando!!!')
})