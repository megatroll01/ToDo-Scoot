const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

// Create a new SQLite database
const db = new sqlite3.Database('todos.db');

// Create the TODO items table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS todo_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    due_date TEXT,
    priority TEXT,
    done INTEGER 
  )
`);

// API endpoints
app.get('/api/todo-items', (req, res) => {
  db.all('SELECT * FROM todo_items', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/todo-items', (req, res) => {
  const { title, description, due_date, priority, done } = req.body;
  const sql = 'INSERT INTO todo_items (title, description, due_date, priority, done) VALUES (?, ?, ?, ?, ?)';
  const values = [title, description, due_date, priority, done];

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.put('/api/todo-items/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority, done } = req.body;
  const sql = 'UPDATE todo_items SET title = ?, description = ?, due_date = ?, priority = ?, done = ? WHERE id = ?';
  const values = [title, description, due_date, priority, done, id];

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/api/todo-items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM todo_items WHERE id = ?';

  db.run(sql, id, function (err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
