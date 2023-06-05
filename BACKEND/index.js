const express = require('express');
const app = express();
const port = 3302; //porta padrão
const mysql = require('mysql2');

app.use(express.json());

const cors = require("cors");

app.options("*", cors({ origin: 'http://172.18.137.87:19006', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "http://172.18.137.87:19006", optionsSuccessStatus: 200 }));

//Rota Default

//C - reate POST
//R - ead GET
//U - pdate PUT
//D - elete DELETE

app.get('/', (req, res) => res.json({ message: 'Funcionou a bagaça@' }));

//Rota para Listar 
app.get('/veiculos', (req, res) => {
    execSQLQuery('SELECT * FROM veiculos', res);
    // sequelize.findAll(Entidade Aluno);
})

// Rota para deletar
app.delete('/veiculos/:id', (req, res) => {
  const id = req.params.id;

  execSQLQuery(`DELETE FROM veiculos WHERE id = ${id}`, res);
});

//Rota para Listar apenas um 
app.get('/aluno/:id?', (req, res) => {
    execSQLQuery('SELECT * FROM veiculos WHERE id = ' + req.params.id, res);
})

//Rota para Cadastrar 
app.post('/veiculos', (req, res) => {
  const {date,km,gasolina} = req.body;

  console.log('req.body :>> ', req.body);

  //Converte o date Zuado para o formato do Banco
  if (km) {
    execSQLQuery(`INSERT INTO veiculos(km,gasolina) VALUES('${km}','${gasolina}')`, res);
  } else {
    execSQLQuery(`INSERT INTO veiculos(data) VALUES('${data}')`, res);
  }
  // sequelize.create(Entidade Aluno, req.body);
});

//Rota para listar 
app.get('/veiculos', (req, res) => {
  execSQLQuery('SELECT * FROM veiculos', res);
})







function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '1234',
    database : 'sys'
  });
 
  connection.query(sqlQry, (error, results, fields) => {
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('Funcionando Normalmente');
  });
}

//inicia o servidor
app.listen(port);
console.log('API funcionando!');