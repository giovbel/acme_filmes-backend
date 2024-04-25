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

const insertNacao = async (dadosNacio) => {

    let sql

    try {
        if (dadosNacio.data_relancamento != null && 
            dadosNacio.data_relancamento != "" && 
            dadosNacio.data_relancamento != undefined) {

            
            sql = `INSERT INTO tbl_nacionalidade (gentilico, 
                                         sigla,
                                         bandeira
                                         ) values (
                                          '${dadosNacio.gentilico}',
                                          '${dadosNacio.sigla}'
                                        )`
        } else {

            sql = `INSERT INTO tbl_nacionalidade (gentilico,
                                         sigla, 
                                         bandeira
                                       ) values ( 
                                        '${dadosNacio.gentilico}',
                                        '${dadosNacio.sigla}',
                                        '${dadosNacio.bandeira}'
                                        )`
        }

        let resultado = await prisma.$executeRawUnsafe(sql)
        
        if (resultado) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateNacio = async (idNacio, dadosNacio) => {

    let sql

    try {
        if (dadosNacio.data_relancamento != null && 
            dadosNacio.data_relancamento != "" && 
            dadosNacio.data_relancamento != undefined) {

            sql = `update tbl_nacionalidade set nome = '${dadosNacio.nome}',
                                                gentilico = '${dadosNacio.gentilico}',
                                                sigla = '${dadosNacio.sigla}'
                                                where id = ${idNacio}`

        } else {
            sql = `update tbl_nacionalidade set nome = '${dadosNacio.nome}',
                                            sigla = '${dadosNacio.sigla}',
                                            bandeira = '${dadosNacio.bandeira}'
                                            where id = ${idNacio}`
        }

        let resultado = await prisma.$executeRawUnsafe(sql)

        if (resultado) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const deleteNacio = async (id) => {

    try {
        let sql = `delete from tbl_nacionalidade where id=${id}`

        let resultado = await prisma.$executeRawUnsafe(sql)

        if (resultado) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllNacio = async () => {

    try {

        let sql = `select * from tbl_nacionalidade`
        let resultado = await prisma.$queryRawUnsafe(sql)

        if (resultado){
            return resultado
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectNacioById = async (id) => {
    try {

        let sql = `select * from tbl_nacionalidade where id = ${id}`
        let resultado = await prisma.$queryRawUnsafe(sql)

        if (resultado){
            return resultado
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectLastInsertId = async function () {

    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_nacionalidade limit 1`
        let resultado = await prisma.$queryRawUnsafe(sql)
        let id

        resultado.forEach(idNacio => {
            id = Number(idNacio.id)
        })

    if (id) {
        return id
    } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAtorByAtorNacio = async function () {

    try {
        
        let sql = `select tbl_nacionalidade.id, tbl_nacionalidade.gentilico, tbl_nacionalidade.sigla, tbl_nacionalidade.bandeira from tbl_nacionalidade 
        inner join tbl_ator_nacionalidade on tbl_nacionalidade.id=tbl_ator_nacionalidade.id 
        inner join tbl_ator on tbl_ator_nacionalidade.ator_id= tbl_ator.id where tbl_ator.id = ${idAtor};
        `
        let resultado = await prisma.$queryRawUnsafe(sql)

        if (resultado){
            return resultado
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}



module.exports = {
    insertNacao,
    updateNacio,
    deleteNacio,
    selectAllNacio,
    selectNacioById,
    selectLastInsertId,
    selectAtorByAtorNacio
}