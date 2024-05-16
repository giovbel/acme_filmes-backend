/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
 * aqui realizamos o CRUD (Create, Read, Update, Delete) ultilizando a linguagem SQL
 * Data: 11/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * *********************************************************************************/

//import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//instância da classe prisma client
const prisma = new PrismaClient();

//função para inserir nova classificação no banco de dados
const insertClassificacao = async (dadosClassificacao) => {

    try {

        let sql = `insert into tbl_classificacao ( nome, 
                                                   icone, 
                                                   nome_completo, 
                                                   descricao 
                                                   ) values (
                                                     '${dadosClassificacao.nome}', 
                                                     '${dadosClassificacao.icone}',
                                                     '${dadosClassificacao.nome_completo}',
                                                     '${dadosClassificacao.descricao}'
                                                   )`
    console.log(sql)
        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//função para atualizar uma classificação no banco de dados
const updateClassificacao = async (id, dadosAtualizados) => {
    
        let sql = `update tbl_classificacao set nome = '${dadosAtualizados.nome}',
                                                icone = '${dadosAtualizados.icone}',
                                                nome_completo = '${dadosAtualizados.nome_completo}',
                                                descricao = '${dadosAtualizados.descricao}'
                                                where id = ${id};`
    
        try {

            let resultado = await prisma.$executeRawUnsafe(sql)
    
        if(resultado) {
            return true
        } else {
            return false
        }
        } catch (error) {
            console.log(error)
            return false
    }
        
}

//função para deletar uma classificação no banco de dados
const deleteClassificacao = async (id) => {

    try {
        let sql = `delete from tbl_classificacao where id=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false
    } catch (error) {
        return false
    }

}

//função para listar todas as classificações do banco de dados
const selectAllClassificacoes = async () => {

    try {
        let sql = `select * from tbl_classificacao`
        let resultado = await prisma.$queryRawUnsafe(sql)
   
        if(resultado){
         return resultado
        } else {
         return false
        }
   
     } catch (error) {
       return false
     }
}

//função para listar dados das classificações com base no ID
const selectClassificacoesById = async (id) => {

    try{

        let sql = `select * from tbl_classificacao where id = ${id}`
        let resultado = await prisma.$queryRawUnsafe(sql)

        if(resultado)
        return resultado
        else
        return false
    }catch(error){
        console.log(error)
        return false
    }
}

//função para listar dados das classificações com base no ID do ultimo dado inserido
const selectLastInsertId = async () => {

    try{

        let sql = `select * from tbl_classificacao where id = ${id}`
        let resultado = await prisma.$queryRawUnsafe(sql)

        if(resultado)
        return resultado
        else
        return false
    }catch(error){
        return false
    }
}

const selectClassficacaoByFilme = async (id) => {

    try{

        let sql = `select tbl_classificacao.id, tbl_classificacao.nome, 
                    tbl_classificacao.nome_completo, tbl_classificacao.descricao, tbl_classificacao.icone  
                    from tbl_classificacao join tbl_filme on tbl_classificacao.id = tbl_filme.classificacao_id 
                    where tbl_filme.id = ${id}`

        let resultado = await prisma.$queryRawUnsafe(sql)

        console.log(resultado)

        if(resultado)
        return resultado
        else
        return false
    }catch(error){
        console.log(error)
        return false
    }
}

module.exports = {
    insertClassificacao,
    updateClassificacao,
    deleteClassificacao,
    selectAllClassificacoes,
    selectClassificacoesById,
    selectLastInsertId,
    selectClassficacaoByFilme
}