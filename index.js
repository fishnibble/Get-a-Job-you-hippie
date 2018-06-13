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


// routes


app.get('/search/:location/:job', (request, response) => {
  const { location, job } = request.params;

  const cl = `https://${location}.craigslist.org/search/jjj?query=${job}`;
  const reddit = `https://www.reddit.com/r/jobbit/search.json?q=${job}&restrict_sr=1`;

  Promise.all([
    fetch(cl)
      .then(response => response.text()),
    fetch(reddit)
      .then(res => res.json())
  ]).then(results => { // results is an array with the results of both fetch calls
    const body = results[0];
    const clJson = craigslistGet(body);

    const redditJson = results[1].data.children.map(({data}) => ({
      title: data.title,
      url: data.url
    }));
  

    response.json({
      redditJson,
      clJson
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
