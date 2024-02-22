var acmeFilmes = require('../modulo/filmes.js');

//função listar todos os filmes

const getListaDeFilmes = function(){

    let filmes = acmeFilmes.filmes.filmes


    filmJson = {}
    filmArray = []

    filmJson.filmes = filmArray
    
    filmes.forEach(function(filmes){
        filmArray.push(filmes)
    })

    return filmJson
}

console.log(getListaDeFilmes())

//função dar um filme com base no id dele

const getDadosFilme = function (id){
    let filmes = acmeFilmes.filmes.filmes;
    let idFilme = parseInt(id);
    let jsonFilmes = {}
    let status = false;

    filmes.forEach(function (filmes){

        if(idFilme == filmes.id){
           jsonFilmes.id = filmes.id
           jsonFilmes.nome = filmes.nome
           jsonFilmes.sinopse = filmes.sinopse
           jsonFilmes.duracao = filmes.duracao
           jsonFilmes.data_lancamento = filmes.data_lancamento
           jsonFilmes.data_relancamento = filmes.data_relancamento
           jsonFilmes.foto_capa = filmes.foto_capa
           jsonFilmes.valor_unitario = filmes.valor_unitario

            status = true
        }
    })

if(status)
    return jsonFilmes;
else
    return false
}

//função dar um filme com base no nome?

const getDadosFilmeNome = function (nome){
    let filmes = acmeFilmes.filmes.filmes;
    let nomeFilme = nome;
    let jsonFilmes = {}
    let status = false;

    filmes.forEach(function (filme){

        if(nomeFilme == filme.nome){
           jsonFilmes.id = filme.id
           jsonFilmes.nome = filme.nome
           jsonFilmes.sinopse = filme.sinopse
           jsonFilmes.duracao = filme.duracao
           jsonFilmes.data_lancamento = filme.data_lancamento
           jsonFilmes.data_relancamento = filme.data_relancamento
           jsonFilmes.foto_capa = filme.foto_capa
           jsonFilmes.valor_unitario = filme.valor_unitario

            status = true
        }
    })
}

console.log(getDadosFilmeNome("Frankewennie"))
// console.log(getDadosFilme("2"))

module.exports = {
    getListaDeFilmes,
    getDadosFilme,
    getDadosFilmeNome
}