/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
 * aqui realizamos o CRUD (Create, Read, Update, Delete) ultilizando a linguagem SQL
 * Data: 25/04/2024
 * Autora: Giovanna
 * Versão: 1.0
 * *********************************************************************************/

//import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//instância da classe prisma client
const prisma = new PrismaClient();

//função para inserir novo diretor no banco de dados
const insertDiretor = async function (dadosDiretor){

    try {
        
        let falecimento

        if (dadosDiretor.data_falecimento != null && 
            dadosDiretor.data_falecimento != "" && 
            dadosDiretor.data_falecimento != undefined){

            falecimento = `'${dadosDiretor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let sql
            sql = `INSERT INTO tbl_diretor (nome, 
                                            nome_artistico, 
                                            data_nascimento, 
                                            data_falecimento, 
                                            biografia,
                                            foto
                                        ) values(
                                           '${dadosDiretor.nome}', 
                                           '${dadosDiretor.nome_artistico}', 
                                           '${dadosDiretor.data_nascimento}', 
                                            ${falecimento}, 
                                           '${dadosDiretor.biografia}',
                                            ${foto}
        )`
        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado){
            return resultado
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const insertNacioDiretor = async function(idDiretor, idNacionalidade){

    try {

        let sql = `INSERT INTO tbl_diretor_nacionalidade (diretor_id, 
                                                          nacionalidade_id
                                                    ) values(
                                                       '${idDiretor}', 
                                                        ${idNacionalidade}
                                                    )`;

        let resultado = await prisma.$executeRawUnsafe(sql)  

        if(resultado)
        return true
        else
        return false

    }catch(error){
        console.log(error)
        return false
    }
}

//função para atualizar um diretor no banco de dados
const updateDiretor = async function (id, dadosDiretor){

    try{

        let falecimento
        if (dadosDiretor.data_falecimento != null && dadosDiretor.data_falecimento != "" && dadosDiretor.data_falecimento != undefined){
            falecimento = `'${dadosDiretor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let sql = `update tbl_diretor set nome = '${dadosDiretor.nome}',
                                          nome_artistico = '${dadosDiretor.nome_artistico}', 
                                          data_nascimento = '${dadosDiretor.data_nascimento}',
                                          data_falecimento = ${falecimento},
                                          biografia = '${dadosDiretor.biografia}',
                                          foto = ${foto}
                                          where id = ${id}`

        


        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado)
        return true
        else
        return false
                                  
    }catch(error){
        console.log(error)
        return false
    }
}

const updateNacionalidadeDiretor = async function (idDiretor, idNacionalidade, idNacionalidadeAntes){

    try{

        let sql = `update tbl_nacionalidade_diretor set 
                                            nacionalidade_id = ${idNacionalidade}
                                            where diretor_id = ${idDiretor} 
                                            and nacionalidade_id = ${idNacionalidadeAntes}`


        let resultado = await prisma.$executeRawUnsafe(sql)

        if(resultado)
        return true
        else
        return false

    }catch(error){
        console.log(error)
        return false
    }
}

const deleteDiretor = async function (idDiretor){

    try {
        let sql = `delete from tbl_diretor where id = ${idDiretor}`

        let resultado = await prisma.$executeRawUnsafe(sql)
       
        if (resultado)
        return true
        else
        return false
    
    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteNacionalidadeDiretor = async function (idDiretor) {

    try {
        let sql = `delete from tbl_diretor_nacionalidade where diretor_id = ${idDiretor}`

        let resultado = await prisma.$executeRawUnsafe(sql)
     
        if (resultado)
        return true
        else
        return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAllDiretores = async function (){

    try {
        let sql = `select * from tbl_diretor`
        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        return rsDiretores
    } catch (error) {
        console.log(error)
        return false
    }
}


const selectDiretorById = async function (id){

    try {
      let sql = `select * from tbl_diretor where id = ${id}`
      let rsDiretor = await prisma.$queryRawUnsafe(sql)
 
      return rsDiretor
       } catch (error) {
     return false
    }
 }

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_diretor limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idDiretor => {
        id = Number(idDiretor.id)
    })


    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        console.log(error)
        return false
    }
}


const selectByFilmeDiretor = async (idFilme) =>{

    try{

        let sql = `select tbl_diretor.id, tbl_diretor.nome, tbl_diretor.nome_artistico, tbl_diretor.data_nascimento, 
                   tbl_diretor.data_falecimento, tbl_diretor.biografia, tbl_diretor.foto from tbl_diretor 
                    inner join tbl_diretor_filme on tbl_diretor.id=tbl_diretor_filme.diretor_id 
                    inner join tbl_filme on tbl_diretor_filme.filme_id=tbl_filme.id where tbl_filme.id = ${idFilme};`

        let resultado = await prisma.$queryRawUnsafe(sql)
    if(resultado){
        return resultado
    }else {
        return false
    }
    }catch(error){
        return false
    }
}

module.exports = {
    insertDiretor,
    insertNacioDiretor,
    updateDiretor,
    updateNacionalidadeDiretor,
    deleteDiretor,
    deleteNacionalidadeDiretor,
    selectAllDiretores,
    selectDiretorById,
    selectByFilmeDiretor,
    selectLastInsertId
}