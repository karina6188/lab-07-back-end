'use strict';
//server
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');

require('dotenv').config();

const app = express();

app.use(cors());
const PORT= process.env.PORT || 3000

//location constructor object
function Location(searchQuery, formatted_address, lat, long) {
  this.search_query = searchQuery;
  this.formatted_query = formatted_address;
  this.latitude = lat;
  this.longitude = long;
}

// Location- get data
app.get('/location', (request, response) => {
  let searchQuery = request.query.data;
  let geocodeurl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;

  superAgent.get(geocodeurl)
    .then(responsefromAgent => {
      // console.log(responsefromAgent);
      const formatted_address = responsefromAgent.body.results[0].formatted_address;
      const lat = responsefromAgent.body.results[0].geometry.location.lat;
      const long = responsefromAgent.body.results[0].geometry.location.lng;

      const location = new Location(searchQuery, formatted_address, lat, long)

      response.status(200).send(location);
    })
    .catch(error => {
      console.log('Something went wrong');
    })
})

// Weather

app.get('/weather', (request, response) => {
  let locationDataObj = request.query.data;
  let latitude = locationDataObj.latitude;
  let longitude = locationDataObj.longitude;
  console.log( `${latitude}, ${longitude}`);

  let URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;

  superAgent.get(URL)
    .then(dataFromWeather => {
      let weatherDataResults = dataFromWeather.body.daily.data;
      const dailyArray = weatherDataResults.map(day => new Forecast(day.summary, day.time));
      console.log(dailyArray);
      response.send(dailyArray);

    })
    .catch(error => {
      console.log('Something went wrong');
    })

});


function Forecast(summary, time) {
  this.forecast = summary;
  this.time = new Date(time *1000).toDateString();

  // const date = new Date(0);
  // date.setUTCSeconds(time);
  // time = date.toDateString();
}

app.use('*', (request, response) => {
  response.status(500).send('Sorry, something went wrong');
});

app.listen(PORT, () => {console.log(`listening on port ${PORT}`)});
