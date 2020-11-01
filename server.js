'use strict';

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');


require('dotenv').config();
const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use('/public',express.static('public'));


app.set('view engine', 'ejs');

// app.get('/location', handelGettingPeopleData);
// app.get('/weather', handelWeather);
// app.get('/trails', handelTrails);
// app.get('/movies', handelMovies);
// app.get('/yelp',handelRust);
// app.get('/*',handelError);



app.get('/hello', hello);
function hello(request,response){
  response.render('pages/index.ejs');
}



app.get('/', search);
function search(request,response){
  response.render('pages/searches/new.ejs');
}





app.listen(PORT, () => {
  console.log(`The App Port is ${PORT}`);
});
