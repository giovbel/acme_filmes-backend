/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
 * aqui realizamos o CRUD (Create, Read, Update, Delete) ultilizando a linguagem SQL
 * Data: 18/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * *********************************************************************************/

//import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//instância da classe prisma client
const prisma = new PrismaClient();

//função para inserir novo ator no banco de dados
const insertAtor = async (dadosAtor) => {

    try {

        let sql = `insert into tbl_ator (nome, 
                                        nome_artistico, 
                                        biografia,
                                        data_nascimento,
                                        data_falecimento,
                                        foto
                                    ) values (
                                        '${dadosAtor.nome}', 
                                        '${dadosAtor.nome_artistico}',
                                        '${dadosAtor.biografia}',
                                        '${dadosAtor.data_nascimento}',
                                        '${dadosAtor.data_falecimento}',
                                        '${dadosAtor.foto}'
                                    )`

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

//função para atualizar um ator no banco de dados
const updateAtor = async (id, dadosAtualizados) => {
    
    let sql = `update tbl_ator set nome = '${dadosAtualizados.nome}',
                                   nome_artistico = '${dadosAtualizados.nome_artistico}',
                                   biografia = '${dadosAtualizados.biografia}',
                                   data_nascimento = '${dadosAtualizados.data_nascimento}',
                                   data_falecimento = '${dadosAtualizados.data_falecimento}',
                                   foto = '${dadosAtualizados.foto}'
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

module.exports = {
    insertAtor,
    updateAtor
}