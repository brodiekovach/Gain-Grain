# Sprint 3
#### Brodie kovach, brodiekovach, Gain & Grain

### What I planned to do:
* Saved Meals and Workouts display pages [gh-41](https://github.com/utk-cs340-fall24/Gain-Grain/issues/41)
* User added weight to exercises in calendar display [gh-43](https://github.com/utk-cs340-fall24/Gain-Grain/issues/43)
* URL parsing for recipes with ingredients list [gh-48](https://github.com/utk-cs340-fall24/Gain-Grain/issues/48)

### What I did not do:
* I completed all I wanted to this sprint

### What problems I encountered:
* The only problem I encountered was parsing the recipe websites for the ingredients and it only works for the domains that are listed in the code

### Issues I worked on:
* [gh-41](https://github.com/utk-cs340-fall24/Gain-Grain/issues/41)
* [gh-43](https://github.com/utk-cs340-fall24/Gain-Grain/issues/43)
* [gh-48](https://github.com/utk-cs340-fall24/Gain-Grain/issues/48)

### Files I worked on:
* gain-grain/src/app/calendar/page.js
* gain-grain/src/app/calendar/modal.css
* gain-grain/src/app/dashboard/calendar/style.css
* gain-grain/src/app/savedMeals/page.js
* gain-grain/src/app/savedMeals/savedMeals.css
* gain-grain/src/app/savedWorkouts/page.js
* gain-grain/src/app/savedMeals/savedWorkouts.css
* gain-grain/utils/recipeScrape/domainConfig.js
* gain-grain/utils/recipeScrape/recipeScraper.js
* gain-grain/src/app/api/meals/recipes/route.js

### What I accomplished:

First, I got saved user meals and workouts to display on the corresponding pages as well as drop downs to show the information with them, and some styling to make it look nicer.

Then, I allowed users to add weights to each exercise on thet calendar. This is for manually made and imported from saved workouts. Since weights change a lot, I wanted to make the workouts save without them and then the user can populate that after they add it to the day.

Last, I got the url parsing to successfully extract name, ingredients, and calories. The ingredients is saved in a list split by name and amount for later integration with an automatic shopping list
