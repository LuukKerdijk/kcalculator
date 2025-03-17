import "dotenv/config";
import { Client } from "@notionhq/client";
import util from "util";

export async function getAccessToken(code) {
  const clientId = "17ad872b-594c-806d-b655-0037f82b7d19";
  const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
  const redirectUri = "https://dev.kcalculator:4200";

  const apiResponse = await (
    await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    })
  ).json();

  return apiResponse;
}

export async function getDatabases(accessToken) {
  const notion = new Client({
    auth: accessToken,
  });

  let apiResponse = await notion.search({
    query: "kcalculator-appdata",
    filter: {
      value: "database",
      property: "object",
    },
  });

  let databases = {};

  apiResponse.results.forEach((db) => {
    const title = db.title[0].text.content;
    const databaseName = title.substring(title.lastIndexOf("-") + 1);

    databases[databaseName] = {
      id: db.id,
      title: db.title[0].text.content,
    };
  });

  return databases;
}

export async function getRecipes(accessToken, databaseId) {
  const notion = new Client({
    auth: accessToken,
  });

  let lastRecipesApiResponse = {
    has_more: true,
    next_cursor: undefined,
  };
  let apiResponse = [];
  let index = 1;

  while (lastRecipesApiResponse.has_more) {
    console.log(`API CALL: ${index}`);

    try {
      lastRecipesApiResponse = await notion.databases.query({
        database_id: databaseId,
        start_cursor: lastRecipesApiResponse.next_cursor,
      });
    } catch (err) {
      throw JSON.parse(err.body).message;
    }

    lastRecipesApiResponse.results.forEach((recipe) => {
      apiResponse.push(recipe);
    });

    console.log(`
      FETCH SUCCESS!, RESPONSE:
      1. total recipes: ${apiResponse.length}
      2. has_more: ${lastRecipesApiResponse.has_more}
      3. next_cursor: ${lastRecipesApiResponse.next_cursor}
    `);

    if (lastRecipesApiResponse.has_more) {
      console.log("(database has more entries, continuing fetching...)");
      index++;
    } else {
      break;
    }
  }

  let recipes = apiResponse
    .filter((recipe) => {
      return recipe.properties["sub-item"].relation.length > 1;
    })
    .map((recipe) => {
      return {
        id: recipe.id,
        name: recipe.properties.name.title[0]?.text.content,
        cover: recipe.cover,
        url: recipe.url,
        kcal: recipe.properties["kcal"].formula.number,
        protein: recipe.properties["protein"].formula.number,
        weight: recipe.properties["weight-calculated"].formula.number,
        subItemRelations: recipe.properties["sub-item"].relation,
      };
    });

  const recipesIngredients = apiResponse
    .filter((recipe) => {
      return recipe.properties["parent-item"].relation.length > 0;
    })
    .map((recipe) => {
      return {
        id: recipe.id,
        name: recipe.properties["ingredient-name"].formula.string,
        kcal: recipe.properties["kcal"].formula.number,
        protein: recipe.properties["protein"].formula.number,
        weight: recipe.properties["weight-calculated"].formula.number,
        parentItemRelation: recipe.properties["parent-item"].relation,
      };
    });

  recipes = recipes.map((recipe) => {
    recipe.ingredients = recipesIngredients.filter((recipeIngredient) => {
      return recipe.subItemRelations.find((subItemRelation) => {
        return subItemRelation.id == recipeIngredient.id;
      });
    });

    delete recipe.subItemRelations;

    recipe.ingredients.forEach((ingredient) => {
      delete ingredient.parentItemRelation;
    });

    return recipe;
  });

  //return apiResponse;
  //return recipesIngredients;
  return recipes;
}

export async function getIngredients(accessToken, databaseId) {
  const notion = new Client({
    auth: accessToken,
  });

  let ingredientsApiResponse;
  try {
    ingredientsApiResponse = await notion.databases.query({
      database_id: databaseId,
    });
  } catch (err) {
    throw JSON.parse(err.body).message;
  }

  const ingredients = ingredientsApiResponse.results.map((ingredient) => {
    return {
      id: ingredient.id,
      name: ingredient.properties.name.title[0]?.text.content,
      properties: {
        kcal: ingredient.properties["kcal/100gr"].number,
        protein: ingredient.properties["protein/100gr"].number,
        serving: ingredient.properties["serving (gr)"].number,
      },
    };
  });

  return ingredients;
}

// console.log(util.inspect(await getAccessToken("030884b3-b7aa-4ecd-9215-766c02d513c8"), false, null, true));
