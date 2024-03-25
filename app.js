const express = require('express');
const { validateEvent , validateAccount} = require('./validate');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let accounts = [];
let events = [];
let id;
let eventIndex;
const SECRET_KEY = 'your-secret-key';

const client = new Client({
    user: 'cvargas',
    host: 'localhost',
    database: 'Project',
    password: '2436',
    port: 5432,
});

client.connect();

app.post('/create-account', (req, res) => {
    const accountData = req.body;
    const { error } = validateAccount(accountData);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const text = 'INSERT INTO users(email, password, name) VALUES($1, $2, $3) RETURNING *';
    const values = [accountData.email, accountData.password, accountData.name];
    client.query(text, values, (err, result) => {
        if (err) {
            console.log(err.stack);
        } else {
            const user = result.rows[0];
            res.status(200).json({ data: { id: user.id, email: user.email, password: user.password } });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];
    client.query(text, values, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({ message: 'Algo salió mal' });
            return;
        }
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ message: 'Acceso no autorizado' });
            return;
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY);
        res.status(200).json({
            data: {
                token: `${token}`,
                email: user.email,
                id: user.id
            }
        });
    });
});

app.post('/create-event', (req, res) => {
    const eventData = req.body;
    const { error } = validateEvent(eventData);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const event = {
        id: events.length + 1,
        name: eventData.name,
        date: eventData.date,
        city: eventData.city,
        participants: eventData.participants
    };
    events.push(event);
    res.json(event);
});

app.put('/:id', (req, res) => {
    id = req.params.id;
    eventIndex = events.findIndex(e => e.id === Number(id));
    if (eventIndex === -1) {
        res.status(404).json({ message: 'Evento no encontrado' });
        return;
    }
    const eventData = req.body;
    const { error } = validateEvent(eventData);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const updatedEvent = {
        ...events[eventIndex],
        ...eventData
    };
    events[eventIndex] = updatedEvent;
    res.json(updatedEvent);
});

app.delete('/:id', (req, res) => {
    id = req.params.id;
    eventIndex = events.findIndex(e => e.id === Number(id));
    if (eventIndex === -1) {
        res.status(404).json({ message: 'Evento no encontrado' });
        return;
    }
    events.splice(eventIndex, 1);
    res.json({ message: 'Evento eliminado con éxito' });
});

app.listen(3000, () => console.log('Server running on port 3000'));