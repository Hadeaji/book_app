'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


require('dotenv').config();
const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use('/public',express.static('public'));


app.set('view engine', 'ejs');



app.get('/', indexRender);
function indexRender(req, res) {
  res.render('pages/index');
}
app.get('/form', formRender);
app.post('/searches', searchFunction);
app.get('/*',handelError);


function formRender(req, res) {
  res.render('pages/searches/new.ejs');
}



function Book(item) {
  if(item.title){
    this.title = item.title;
  }else{this.title = 'Not found';}
  if(item.imageLinks.thumbnail){
    this.image = item.imageLinks.thumbnail;
  }else{this.image = `https://i.imgur.com/J5LVHEL.jpg`;}
  if(item.authors){
    this.authors = item.authors;
  }else{this.authors = 'Not found'; }
  if(item.description){
    this.description = item.description;
  }else{this.description ='Not found'; }
}



function searchFunction(req, res) {
  let q = '';
  if (req.body.search[1] === 'title') { q = `+intitle:${req.body.search[0]}`; }
  if (req.body.search[1] === 'author') { q = `+inauthor:${req.body.search[0]}`; }

  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => res.render('pages/searches/show', { searchResults: results }));
}

function handelError(req,res){
  res.render('pages/error');
}

app.listen(PORT, () => {
  console.log(`The App Port is ${PORT}`);
});
