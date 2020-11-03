'use strict';


// Require dependencies
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
const superagent = require('superagent');
const pg = require('pg');
const methodoverride = require('method-override');
app.use(methodoverride('_method'));
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('./public'));
app.set('view engine', 'ejs');
// Reqired KEYS
const PORT = process.env.PORT;

app.get('/', indexRender);
app.post('/books', selectBook);
app.get('/books/:id', detailsButton);
app.put('/books/:update_id', updateData);
app.delete('/books/:delete_id', deleteFunction);



function updateData(req, res) {
  let id = req.params.update_id;
  let authors = req.body.authors.replace('\'', '');
  let title = req.body.title.replace('\'', '');
  let isbn = req.body.isbn;
  let image = req.body.image;
  let description = req.body.description.replace('\'', '');
  let bookshelf = req.body.bookshelf;

  let SQL = `UPDATE books SET authors =$1 ,title = $2 ,isbn= $3 ,image_url=$4 ,description=$5 ,bookshelf=$6 WHERE id = $7;`;
  let value = [authors, title, isbn, image, description, bookshelf, id];
  client.query(SQL, value)
    .then(() => {
      res.redirect(`/books/${id}`);
    });
}


function deleteFunction(req,res){
  let id = req.params.delete_id;
  client.query(`DELETE FROM books WHERE id = ${id};`).then(data => {

    res.redirect(`/`);
  });
}







function indexRender(req, res) {
  client.query(`SELECT id, authors, title, image_url FROM books`).then(data => {

    res.render('pages/index', { savedBook: data });
  });


}
function detailsButton(req, res) {
  let id = req.params.id;
  client.query(`SELECT * FROM books WHERE id = ${id}`).then(data => {

    res.render('pages/books/show', { bookDetails: data.rows });
  });
}
function selectBook(req, res) {

  let image_url = req.body.image;
  let title = req.body.title.replace('\'', '');
  let authors = req.body.authors.replace('\'', '');
  let description = req.body.description.replace('\'', '');
  let isbn = req.body.isbn;
  let bookshelf = req.body.bookshelf;
  //  let arr = [{image_url,title,authors,description,isbn,bookshelf}];
  let SQL = `INSERT INTO books(authors,title,isbn,image_url,description,bookshelf) VALUES ($1, $2,$3,$4,$5,$6) RETURNING id;`;
  let value = [authors, title, isbn, image_url, description, bookshelf];
  client.query(SQL, value)
    .then(data => {
      //  client.query(`SELECT MAX(ID) FROM books`)

      //   .then(data => {
      // console.log(`id = ${data.rows[0].max}`);
      res.redirect(`/books/${data.rows[0].id}`);
      // })

    });








}
// function insertToDatabase(obj){

// let SQL = `INSERT INTO books(authors,title,isbn,image_url,description,bookshelf) VALUES ($1, $2,$3,$4,$5,$6);`;
//    let value = [obj.authors,obj.title,obj.isbn,obj.image_url,obj.description,obj.bookshelf];
//    client.query(SQL,value);


// }
app.get('/form', formRender);
app.post('/searches', searchFunction);
app.get('/*', handelError);

function formRender(req, res) {
  res.render('pages/searches/new.ejs');
}



let regex = /^(https).*/g;
function Book(item) {
  if (item.title) {
    this.title = item.title;
  } else { this.title = 'Not found'; }


  if (item.imageLinks) {
    if (regex.test(item.imageLinks.thumbnail)) {
      this.image = item.imageLinks.thumbnail;
    } else {
      this.image = item.imageLinks.thumbnail.replace('http', 'https');
    }
  } else { this.image = `https://i.imgur.com/J5LVHEL.jpg`; }


  if (item.authors) {
    this.authors = item.authors;
  } else { this.authors = 'Not found'; }
  if (item.description) {
    this.description = item.description;
  } else { this.description = 'Not found'; }
  if (item.industryIdentifiers) {
    this.isbn = item.industryIdentifiers[0].type + ' ' + item.industryIdentifiers[0].identifier;
  }
  else { this.isbn = 'Not found'; }
  if (item.categories) {
    this.bookshelf = item.categories[0];
  }
  else { this.bookshelf = 'Not found'; }
}

function searchFunction(req, res) {

  let q = '';
  if (req.body.search[1] === 'title') { q = `+intitle:${req.body.search[0]}`;}
  if (req.body.search[1] === 'authors') { q = `+inauthor:${req.body.search[0]}`;}

  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`)

    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => res.render('pages/searches/show', { searchResults: results }));


}
function handelError(req, res) {
  res.render('pages/error');
}

// server starting function
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log('app is listning on port' + PORT);
  });
}).catch(err => {
  console.log('Sorry there is an error' + err);
});
