_**Project is still in development**_

# Context

Kcalculator is an app that makes tracking your food intake easier. The main functionalities include:

- Managing ingredients
- Managing recipes (combination of ingredients) using:
  - Self managed ingredients
  - Ingredients managed by [OpenFoodFacts API](https://nl.openfoodfacts.org/) (using barcode scanner)
- Tracking daily nutrition intake using:
  - Self managed ingredients
  - Ingredients managed by [OpenFoodFacts API](https://nl.openfoodfacts.org/)
  - Self managed recipes

# Technologies

## Frontend

- HTML
- CSS + Tailwind
- JavaScript/TypeScript + Angular

## Backend

- **Notion**: Notion is a free note taking app, that is used to store the users food data (daily intake, ingredients, recipes etc.). The user authorizes kcalculator to access their OWN Notion resources using OAuth2.0. A notion account is required
- **Node.js (Express.js) API**:
  - Session based authentication: retrieves Notion OAuth2.0 JWT and creates a session using the JWT data
  - Fetches and returns food data from Notion API using the users JWT
