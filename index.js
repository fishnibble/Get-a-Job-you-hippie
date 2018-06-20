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

// Parse criagslist and return JSON
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

// Parse numbeo data and return JSON
function numbeoGet(body) {
  const results = [];
  const $ = cheerio.load(body);
  const table = $('table.data_wide_table tr');
  
  const meal = $(table[1]).text();
  const cappuccino = $(table[6]).text();
  const monthlyTransportationPass = $(table[31]).text();
  const rent = [$(table[55]).text(),$(table[56]).text(),$(table[57]).text(),$(table[58]).text()];
  
  results.push({
    rent,
    monthlyTransportationPass,
    meal,
    cappuccino
  });

  return results;
}

function cleanNumbeoData(data) {
  // TODO
}

function stackOverGet(body) {
  results = [];
  const $ = cheerio.load(body);
  const jobList = $('.listResults');
  
  jobList.each((index, element) => {
    const result = $(element);
    const title = result.find('.job-details__spaced').text();
    const company = result.find('.fc-black-700').text();
    const pay = result.find(".-salary.pr16").text();    
    
    results.push({
      title,
      company,
      pay
    });
  });

  return results;
}

// routes

app.get('/search/cl/:location/:job', (request, response) => {

  const { location, job } = request.params;

  const cl = `https://${location}.craigslist.org/search/jjj?query=${job}`;

  fetch(cl)
    .then(response => response.text())
    .then(results => { 
    const body = results;
    const clJson = craigslistGet(body);

    response.json({
      clJson
    });
  });
});

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

app.get('/search/overflow/:job/:city', (request, response) =>{

  const { job, city } = request.params;
  const overflow = `https://stackoverflow.com/jobs?sort=i&q=${job}&l=${city}&d=20&u=Miles`;

  fetch(overflow)
    .then(response => response.text())
    .then(results => {
      const body = results;
      const overflowJson = stackOverGet(body);
      
      response.json({
        overflowJson
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
