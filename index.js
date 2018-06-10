const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

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

function redditGet(body) {
  // https://www.reddit.com/r/devopsjobs/search?q=node.js&restrict_sr=1
  const $ = cheerio.load(body);
  
}


app.get('/search/:location/:job', (request, response) => {
  const { location, job } = request.params;

  const url = `https://${location}.craigslist.org/search/jjj?query=${job}`;

  fetch(url)
    .then(response => response.text())
    .then(body => {
      const results = craigslistGet(body);
      response.json({
        results
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
