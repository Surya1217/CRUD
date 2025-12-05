// import express from 'express';
// import bodyParser from 'body-parser';
// import pg from 'pg';
// import axios from 'axios';

// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON bodies
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(express.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// // PostgreSQL client setup  


// const db = new pg.Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'books',
//   password: '1217',
//   port: 5432,
// });  


// db.connect();

// //route to home page
// app.get('/', async (req, res) => {
//     const result = await db.query('SELECT * FROM books order by id ASC ');
//     const books = result.rows;
//     res.render('index', { books, booktoedit: null });
// });

// //sample route view to demonstrate fetching a book by ID and rendering it
// app.get('/books/:id', async (req, res) => {
//     const bookId = req.params.id;
//     try {
//       const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
//       if (result.rows.length > 0){ 
//         const book = result.rows[0];
//         res.render('view', { book });
//       } else {
//         res.status(404).send("Book not found");
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error fetching book");
//     }
// });
// // Sample route edit to demonstrate fetching a book by ID and rendering it
// // app.post('/edit', async (req, res) => {
// //     const editedId = req.query.editedId;
// //     let booktoedit = null;
// //     if (editedId) {
// //       try { 
// //         const result = await db.query('SELECT * FROM books WHERE id = $1', [editedId]);
// //         if (result.rows.length > 0){ 
// //           booktoedit = result.rows[0];
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         res.status(500).send("Error fetching book to edit");  
// //       }
// //     }
// //     const allBooksResult = await db.query('SELECT * FROM books order by id ASC ');
// //     const books = allBooksResult.rows;
// //     res.render('index', { books, booktoedit });
// // });
// app.get('/edit', async (req, res) => {
//   const editedId = req.query.editedId;
//   if (!editedId) {
//     return res.redirect('/');  // or show error
//   }
//   try {
//     const result = await db.query(
//       'SELECT * FROM books WHERE id = $1',
//       [editedId]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send("Book not found");
//     }
//     const booktoedit = result.rows[0];
//     res.render('edit', { book: booktoedit });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching book to edit");
//   }
// });


// // Route to add, update, delete books
// app.post('/add', async (req, res) => {
//   try { 
//     const { title, author,rating,notes,finished_date} = req.body;
//     await db.query('INSERT INTO books (title, author, rating, notes, finished_date) VALUES ($1, $2, $3, $4, $5)', [title, author, rating, notes, finished_date,]);
//     res.redirect('/');
// } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding book");
//   }   
// });

// app.post('/update', async (req, res) => {
//   try {
//     const { id, title, author, rating, notes, finished_date } = req.body;
//     if (!id) {
//       return res.status(400).send("Missing book ID");
//     }
//     await db.query(
//       `UPDATE books
//        SET title = $1,
//            author = $2,
//            rating = $3,
//            notes = $4,
//            finished_date = $5
//        WHERE id = $6`,
//       [title, author, rating, notes, finished_date, id]
//     );
//     res.redirect('/');  // Or redirect to the book detail page, e.g. `/book/${id}`
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating book");
//   }
// });


// app.post('/delete/:id', async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     await db.query('DELETE FROM books WHERE id = $1', [bookId]);
//     res.redirect('/');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting book");
//   }
// });

// //  Open Library API Search
// app.get("/search", async (req, res) => {
//   const { q } = req.query;
//   if (!q) return res.render("search", { results: [], query: "" });

//   try {
//     const response = await axios.get("https://openlibrary.org/search.json", {
//       params: { title: q, limit: 10 },
//     });

//     res.render("search", {
//       results: response.data.docs || [],
//       query: q,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error searching books");
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// index.js
import express from 'express';
import { Client } from 'pg';
import path from 'path';

const app = express();
const PORT = 3000;

// Adjust these as per your Postgres setup:
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'books',     // your database name
  password: '1217',  // your password
  port: 5432,
});

db.connect();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home / list all books
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY id ASC');
    const books = result.rows;
    res.render('index', { books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
});

// View single book details
app.get('/book/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];
    res.render('view', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching book");
  }
});

// Show edit form
app.get('/edit', async (req, res) => {
  const editedId = req.query.editedId;
  if (!editedId) {
    return res.redirect('/');
  }
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [editedId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];
    res.render('edit', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching book to edit");
  }
});

// Handle edit (update)
app.post('/update', async (req, res) => {
  try {
    const { id, title, author, rating, notes, finished_date } = req.body;
    if (!id) {
      return res.status(400).send("Missing book ID");
    }
    await db.query(
      `UPDATE books
       SET title = $1,
           author = $2,
           rating = $3,
           notes = $4,
           finished_date = $5
       WHERE id = $6`,
      [title, author, rating, notes, finished_date, id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

// Add new book
app.post('/add', async (req, res) => {
  try {
    const { title, author, rating, notes, finished_date } = req.body;
    await db.query(
      `INSERT INTO books (title, author, rating, notes, finished_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [title, author, rating || null, notes || '', finished_date || null]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// Delete book
app.post('/delete/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.query('DELETE FROM books WHERE id = $1', [bookId]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
