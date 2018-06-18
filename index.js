// set up.....

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

// functions

function craigslistGet(body) {
  const $ = cheerio.load(body);
  const rows = $('li.result-row');
  const results = [];

  rows.each((index, element) => {
    const result = $(element);
    const title = result.find('.result-title').text();
    let url = result.find('.result-title.hdrlnk').attr('href');

    results.push({
      title,
       url
     });
  });
  return results;
}

function numbeoGet(body) {
  const results = [];
  const $ = cheerio.load(body);
  const table = $('table.data_wide_table tr');
  
  const meal = $(table[1]).text();
  const cappuccino = $(table[6]).text();
  
  results.push({
    meal,
    cappuccino});

  return results;

}


// routes


// app.get('/search/:location/:job', (request, response) => {
//   // todo refractor
//   const { location, job } = request.params;

//   const cl = `https://${location}.craigslist.org/search/jjj?query=${job}`;
//   Promise.all([
//     fetch(cl)
//       .then(response => response.text()),
//     fetch(reddit)
//       .then(res => res.json())
//   ]).then(results => { // results is an array with the results of both fetch calls
//     const body = results[0];
//     const clJson = craigslistGet(body);

//     const redditJson = results[1].data.children.map(({data}) => ({
//       title: data.title,
//       url: data.url
//     }));
  

//     response.json({
//       redditJson,
//       clJson
//     });
//   });
// });

// Route for reddit
app.get('/search/reddit/:subreddit/:job', (request, response ) => {
  const { subreddit, job } = request.params;
  const reddit = `https://www.reddit.com/r/${subreddit}/search.json?q=${job}&restrict_sr=1`;

  fetch(reddit)
    .then(res => res.json())
    .then(results => {
      const body = results;
      const redditJson = results.data.children.map(({data}) => ({
        title: data.title,
        url: data.url
      }));

      response.json({
        redditJson
      });
    });
});

app.get('/search/citydata/:city', (request, response) => {
  const { city } = request.params;
  const numbeo = `https://www.numbeo.com/cost-of-living/in/${city}`

  fetch(numbeo)
    .then(response => response.text())
    .then(results => {
  
      
      const body = results;
      const numbeoJson = numbeoGet(body);
    
      response.json({
        numbeoJson
      });
    });
});


// handling random url routes

app.use((request, response, next) => {
  const error = new Error('not found');
  response.status(404);
  next(error);
});

app.use((error, request, response, next) => {
  response.status(response.statusCode || 500);
  response.json({
    message: error.message
  });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
