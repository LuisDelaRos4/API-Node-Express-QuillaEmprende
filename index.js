const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log('Error al conectar la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la bade de datos MySQL');
});

///RUTAS///

//Eventos
app.get('/get_eventos', (req, res) => {
    db.query('SELECT * FROM eventos', (error, results) => {
        if (error) throw error; {
            res.json(results);
        }
    });
});

app.get('/get_evento/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM eventos WHERE id = ?', id, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/create_evento', (req, res) => {
    const nuevoEvento = req.body;
    db.query('INSERT INTO eventos SET ?', nuevoEvento, (error, results) => {
        if (error) throw error;
        res.json({ message: 'Evento creado exitosamente', id: results.insertId });
    });
});

app.put('/update_evento/:id', (req, res) => {
    const id = req.params.id;
    const eventoActualizado = req.body;
    db.query('UPDATE eventos SET ? WHERE id = ?', [eventoActualizado, id], (error) => {
        if (error) throw error;
        res.json({ message: 'Evento actualizado exitosamente' });
    });
});

//Asistencia
app.get('/get_asistencias', (req, res) => {
    db.query('SELECT * FROM asistencias_eventos', (error, results) => {
        if (error) throw error; {
            res.json(results);
        }
    });
});

app.get('/get_asistencia/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM asistencias_eventos WHERE id = ?', id, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/create_asistencia', (req, res) => {
    const nuevaAsistencia = req.body;
    db.query('INSERT INTO asistencias_eventos SET ?', nuevaAsistencia, (error, results) => {
        if (error) throw error;
        res.json({ message: 'Asistencia creada exitosamente', id: results.insertId });
    });
});

app.put('/update_asistencia/:id', (req, res) => {
    const id = req.params.id;
    const asistenciaActualizada = req.body;
    db.query('UPDATE asistencias_eventos SET ? WHERE id = ?', [asistenciaActualizada, id], (error) => {
        if (error) throw error;
        res.json({ message: 'Asistencia actualizada exitosamente' });
    });
});

app.listen(port);