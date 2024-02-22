/***********************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de variáveis e constantes globais do projeto
 * Data: 22/02/2024
 * Autora: Giovanna
 * Versão: 1.0
 * ********************************************************************************************/

/*********************** MENSAGENS DE ERRO DO PROJETO ******************************/
const ERROR_INVALID_ID         = {status: false, status_code: 400, message: 'O ID encaminhando na requisiçao não é válido'}
const ERROR_NOT_FOUND          = {status: false, status_code: 404, message: 'Não foi encontrado nenhum item'}
const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição, devido a um erro no acesso ao banco de dados. Contrate o administrador da api'}

module.exports ={
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB
}
