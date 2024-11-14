const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('advocacia.db');

// Criar as tabelas se não existirem
db.serialize(() => {
    // Tabela Cliente
    db.run(`
           CREATE TABLE IF NOT EXISTS Cliente (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   nome TEXT NOT NULL,
                   cpf TEXT UNIQUE NOT NULL,
                   dataNascimento DATE NOT NULL,
                   endereco TEXT NOT NULL
               )
           `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Cliente:', err);
        } else {
            console.log('Tabela Cliente criada com sucesso (ou já existe).');
        }
    });

   

    // Tabela Profissional
    db.run(`
           CREATE TABLE IF NOT EXISTS Profissional (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   nome TEXT NOT NULL,
                   cpf TEXT UNIQUE NOT NULL,
                   oab TEXT NOT NULL,
                   nascimentoProfissional DATE NOT NULL,
                   enderecoProfissional TEXT NOT NULL
               )
           `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Profissional:', err);
        } else {
            console.log('Tabela Profissional criada com sucesso (ou já existe).');
        }
    });

    // Tabela Agenda
    db.run(`
           CREATE TABLE IF NOT EXISTS Agenda (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   data TEXT NOT NULL,
                   horario TEXT NOT NULL,
                   sala TEXT NOT NULL,
                   cpf_cliente TEXT NOT NULL,
                   cpf_profissional TEXT NOT NULL,
                   FOREIGN KEY(cpf_cliente) REFERENCES Cliente(cpf),
                   FOREIGN KEY(cpf_profissional) REFERENCES Profissional(cpf)
               )
           `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Agenda:', err);
        } else {
            console.log('Tabela Agenda criada com sucesso (ou já existe).');
        }
    });
});

// Rota para cadastrar um cliente
app.post('/cadastrar-cliente', (req, res) => {
    const { nome, cpf, dataNascimento, endereco } = req.body;
    db.run("INSERT INTO Cliente (nome, cpf, dataNascimento, endereco ) VALUES (?, ?, ?, ?)", [nome, cpf, dataNascimento, endereco], function (err) {
        if (err) {
            console.error('Erro ao cadastrar cliente:', err);
            res.status(500).send('Erro ao cadastrar cliente');
        } else {
            res.send('Cliente cadastrado com sucesso!');
        }
    });
});

// Rota para cadastrar um profissional
app.post('/cadastrar-profissional', (req, res) => {
    const { nome, cpf, oab, enderecoProfissional, nascimentoProfissional } = req.body;
    db.run("INSERT INTO Profissional (nome, cpf, oab, enderecoProfissional, nascimentoProfissional ) VALUES (?, ?, ?, ?, ?)", [nome, cpf, oab, enderecoProfissional, nascimentoProfissional], function (err) {
        if (err) {
            console.error('Erro ao cadastrar profissional:', err);
            res.status(500).send('Erro ao cadastrar profissional');
        } else {
            res.send('Profissional cadastrado com sucesso!');
        }
    });
});

// Rota para cadastrar um agendamento
app.post('/cadastrar-agendamento', (req, res) => {
    const { data, horario, sala, cpf_cliente, cpf_profissional } = req.body;
    db.run("INSERT INTO Agenda (data, horario, sala, cpf_cliente, cpf_profissional) VALUES (?, ?, ?, ?, ?)", 
    [data, horario, sala, cpf_cliente, cpf_profissional], function (err) {
        if (err) {
            console.error('Erro ao cadastrar agendamento:', err);
            res.status(500).send('Erro ao cadastrar agendamento');
        } else {
            res.send('Agendamento cadastrado com sucesso!');
        }
    });
});


// Rota para consultar agendamentos
app.get('/consultar-agendamentos', (req, res) => {
    const { data, cpf_cliente, cpf_profissional, horario, sala } = req.query;

    let sql = "SELECT * FROM Agenda WHERE 1=1";
    const params = [];

    if (data) {
        sql += " AND data = ?";
        params.push(data);
    }
    if (cpf_cliente) {
        sql += " AND cpf_cliente = ?";
        params.push(cpf_cliente);
    }
    if (cpf_profissional) {
        sql += " AND cpf_profissional = ?";
        params.push(cpf_profissional);
    }
    if (horario) {
        sql += " AND horario = ?";
        params.push(horario);
    }
    if (sala) {
        sql += " AND sala = ?";
        params.push(sala);
    }

    
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar agendamentos:', err);
            return res.status(500).send('Erro ao consultar agendamentos.');
        }
        res.json(rows);
    });
});

// Rota para excluir um agendamento
app.delete('/excluir-agendamento', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM Agenda WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir agendamento:', err);
            return res.status(500).send('Erro ao excluir agendamento');
        }
        res.send('Agendamento excluído com sucesso');
    });
});

// Rota para atualizar um agendamento
app.put('/atualizar-agendamento', (req, res) => {
    const { id, data, horario, sala, cpf_cliente, cpf_profissional } = req.body;

    db.run(
        "UPDATE Agenda SET data = ?, horario = ?, sala = ?, cpf_cliente = ?, cpf_profissional = ? WHERE id = ?",
        [data, horario, sala, cpf_cliente, cpf_profissional, id],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar agendamento:', err);
                return res.status(500).send('Erro ao atualizar agendamento');
            }
            res.send('Agendamento atualizado com sucesso');
        }
    );
});

// Rota para buscar um agendamento pelo ID
app.get('/buscar-agendamento', (req, res) => {
    const { id } = req.query;
    db.get("SELECT * FROM Agenda WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar agendamento:', err);
            return res.status(500).send('Erro ao buscar agendamento');
        }
        if (!row) return res.status(404).send('Agendamento não encontrado');
        res.json(row);
    });
});



// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});