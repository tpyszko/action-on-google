const functions = require("firebase-functions");
const fetch = require("isomorphic-fetch");
const { dialogflow, Suggestions } = require("actions-on-google");

const airvisualToken = ""
const URL = `https://api.airvisual.com/v2/nearest_city?key=${airvisualToken}`;
const app = dialogflow();

app.intent("Default Welcome Intent", conv => {
  conv.ask("Welcome to air quality checker!");
  conv.ask(`Do you want me to check air quality outside?`);
  conv.ask(new Suggestions("Yes", "No"));
});

app.intent("Default Fallback Intent", conv => {
  conv.ask(`I didn't understand`);
  conv.ask(`I'm sorry, can you try again?`);
});

app.intent("airquality", conv => {
  return fetch(URL)
    .then(response => response.json())
    .then(data => {
      const aqius = data.data.current.pollution.aqius;
      if(aqius > 0) {
        conv.ask(`Air quality is great!`);
      } else if (aqius > 50 || aqius < 100) {
        conv.ask(`Be careful - air quality is not so good`);
      } else {
        conv.ask(`Hey! Stay home today!`);
      }

    })
    .catch(error => conv.ask(`Sorry, we cant show you air quality now. Try it later`));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);