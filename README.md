# BudgetBite
## Frontend
### Install dependencies
Run `npm install`
### Run frontend
Navigate to /frontend\
Run `npm start` 
## Backend
### Run backend
Navigate to /backend\
Run `npm install cors `
Run `npm start `
### Routes for Ingredient Lists
http://localhost:3000/recipes?q=\[ingredients\]\
http://localhost:3000/missing-ingredients?recipe_id=\[recipeId\]&q=\[ingredients\]
### POST /price

Endpoint URL: http://localhost:3000/price

**Request body example:**
```json
{
  "ingredients": ["soy sauce", "sake", "eggs"],
  "location": "Vancouver, British Columbia"
}
```

**Notes:**
- `location` is optional and defaults to `Toronto, Ontario` if not provided by user
