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
    const insertAtor = async function (dadosAtor){

        try {

            let falecimento

            if (dadosAtor.data_falecimento != null && 
                dadosAtor.data_falecimento != "" && 
                dadosAtor.data_falecimento != undefined){

                falecimento = `'${dadosAtor.data_falecimento}'`
            }else{
                falecimento = null
            }
    
            let sql = `insert into tbl_ator (nome, 
                                             nome_artistico, 
                                             data_nascimento, 
                                             data_falecimento, 
                                             biografia,
                                             foto
                                        ) values(
                                          '${dadosAtor.nome}', 
                                          '${dadosAtor.nome_artistico}', 
                                          '${dadosAtor.data_nascimento}', 
                                           ${falecimento}, 
                                          '${dadosAtor.biografia}',
                                          '${dadosAtor.foto}'
                                          )`;
        
    let resultado = await prisma.$executeRawUnsafe(sql)
    
    if(resultado) {
        return resultado
    } else {
        return false
    }
    } catch (error) {
        console.log(error)
        return false
    }
    }

const insertNacionalidadeAtor = async (idAtor, idNacio) => {
    try{
        let sql = `insert into tbl_ator_nacionalidade (ator_id,
                                                       nacionalidade_id
                                               ) values(
                                                       ${idAtor},
                                                       ${idNacio}
                                                  )`;

                                                  console.log(sql)

        let resultado = await prisma.$executeRawUnsafe(sql)

        console.log(resultado)
        if(resultado)
        return true
        else
        return false

    }catch(error){
        console.log(error)
        return false
    }
}

//função para atualizar um ator no banco de dados
const updateAtor = async (id, dadosAtor) => {

    try{
        let falecimento

        if (dadosAtor.data_falecimento != null && 
            dadosAtor.data_falecimento != "" && 
            dadosAtor.data_falecimento != undefined){

            falecimento = `'${dadosAtor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let sql = `update tbl_ator set nome = '${dadosAtor.nome}',
                                       nome_artistico = '${dadosAtor.nome_artistico}', 
                                       data_nascimento = '${dadosAtor.data_nascimento}',
                                       data_falecimento = ${falecimento},
                                       biografia = '${dadosAtor.biografia}',
                                       foto = '${dadosAtor.foto}'
                                       where id = ${id}`;


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

const updateNacionalidadeAtor = async (idNacio, idAtor) => {

    try{
        let sql = `update tbl_ator_nacionalidade set ator_id = ${idAtor},
                                                     nacionalidade_id = ${idNacio}
        `;


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

const deleteAtor = async function (idAtor){

    try {
        let sql = `delete from tbl_ator where id = ${idAtor}`
        let result = await prisma.$executeRawUnsafe(sql)
       
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllAtores = async function (){

    try {
        let sql = `select * from tbl_ator`
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAtorById = async function (id){

   try {
     let sql = `select * from tbl_ator where id = ${id}`
     let rsAtor = await prisma.$queryRawUnsafe(sql)

     return rsAtor
       } catch (error) {
    return false
   }
}

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_ator limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idAtor => {
        id = Number(idAtor.id)
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

const selectAtorByIdFilme = async (idFilme) =>{

    try{
        let sql = `select tbl_ator.id, tbl_ator.nome, tbl_ator.nome_artistico, tbl_ator.data_nascimento, 
                   tbl_ator.data_falecimento, tbl_ator.biografia, tbl_ator.foto
                    from tbl_ator inner join tbl_ator_filme on tbl_ator.id=tbl_ator_filme.ator_id 
                    inner join tbl_filme on tbl_ator_filme.filme_id=tbl_filme.id where tbl_filme.id = ${idFilme};`

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
    insertAtor,
    insertNacionalidadeAtor,
    updateAtor,
    updateNacionalidadeAtor,
    deleteAtor,
    selectAllAtores,
    selectAtorById,
    selectLastInsertId,
    selectAtorByIdFilme
}