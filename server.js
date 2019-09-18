'use strict';
//server
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');

require('dotenv').config();

const app = express();

app.use(cors());
const PORT= process.env.PORT || 3000

//error helper function
function Error(err) {
  this.status = 500;
  this.responseText = 'Sorry, something went wrong.';
  // this.error = err;
}

//getting information from geodata reulsts
function Location(searchQuery, formatted_address, lat, long) {
  this.search_query = searchQuery;
  this.formatted_query = formatted_address;
  this.latitude = lat;
  this.longitude = long;
}
// Location- get data
app.get('/location', getLocation);

function getLocation(searchQuery, request, response){
  let geocodeurl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GOOGLE}`
  superAgent.get(geocodeurl)
    .then(responsefromAgent => {
      console.log(responsefromAgent);
      // const formatted_address = responsefromAgent.body.results[0].formatted_address;
      // const lat = responsefromAgent.body.results[0].geometry.location.lat;
      // const long = responsefromAgent.body.results[0].geometry.location.lng;
      // const location = new Location(searchQuery, formatted_address, lat, long)
      response.status(200).send(location);
    // })
    // .catch(error => {
    //   Error(error, response)
    // })
    })
}

//Location constructor object


// Weather

// app.get('/weather', weatherData => {

//   function weatherData(request, response) {
//     let searchQuery = request.query.data;

//     let URL = `https://api.darksky.net/forecast/${process.env.DARKSKY}/${latitude},${longitude}`
//     superAgent.get(URL)
//       .then(data =>{
//         let weatherDataResults = data.body.daily.data;
//         let dailyArray = weatherDataResults.map(day => {
//           return new Forecast(day);
//         })
//         response.send(weatherDataResults);
//       })
//       .catch(error => console.log(error));

//     const weatherDataResults = require(URL);
//     const forecast = new Forecast(searchQuery, weatherDataResults);

//     response.status(200).send(forecast);
//   } catch (err) {
//     console.error(err);
//   }
// });


// function Forecast(searchQuery, weatherDataResults) {
//   console.log(weatherDataResults);
//   const result = [];
//   weatherDataResults.daily.data.forEach(day => {
//     const obj = {};
//     obj.forecast = day.summary;

//     const date = new Date(0);
//     date.setUTCSeconds(day.time);
//     obj.time = date.toDateString();

//     result.push(obj);
//   });
//   return result;
// }



// app.use('*', (request, response) => {
//   response.status(500).send('Sorry, something went wrong');
// });


app.listen(PORT, () => {console.log(`listening on port ${PORT}`)});
