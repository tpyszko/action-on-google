"use strict";
const { dialogflow, Suggestions } = require("actions-on-google");

const harmful_ingredients_list = [
  "SODIUM LAURYL SULFATE",
  "SLS",
  "SODIUM LAURETH SULFATE",
  "SLES",
  "PROPYLENE GLYCOL",
  "DIETANOLOAMINA",
  "DEA",
  "MONOETANOLOAMINA",
  "MEA",
  "TRIETHANOLMINE",
  "TEA",
  "POLYETHYLENE GLYCOL",
  "PEG",
  "POLYPROPYLENE GLYCOL",
  "PPG"
];

const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

app.intent("Default Welcome Intent", conv => {
  conv.ask(`Hi, tell me which ingredients you would like to check?`);
  conv.ask(new Suggestions("SLS", "PROPYLENE GLYCOL", "PEG"));
});

app.intent("Ingredient", (conv, { ingredients }) => {
  // check ingredients witch the list
  if (harmful_ingredients_list.includes(ingredients.toUpperCase())) {
    conv.ask(
      `${ingredients} is on the harmfull ingredients list. Avoid it. Do you want to check another ingredient?`
    );
    conv.ask(new Suggestions("Yes", "No"));
  } else {
    conv.ask(
      `I dont find ${ingredients} on the list. Do you want to check another ingredient?`
    );
    conv.ask(new Suggestions("Yes", "No"));
  }
});

app.intent("Ingredient - yes", conv => {
  conv.ask("Which ingredient you want to check?");
  conv.ask(new Suggestions("SLS", "PROPYLENE GLYCOL", "PEG"));
});

app.intent("actions_intent_NO_INPUT", conv => {
  const repromptCount = parseInt(conv.arguments.get("REPROMPT_COUNT"));
  if (repromptCount === 0) {
    conv.ask("Which ingredient do you want to check?");
  } else if (repromptCount === 1) {
    conv.ask(`Please say the name of the ingredient.`);
  } else if (conv.arguments.get("IS_FINAL_REPROMPT")) {
    conv.close(
      `Sorry we're having trouble. Let's ` + `try this again later. Goodbye.`
    );
  }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
