# Sprint 3
* Name: Ethan Crall
* Github ID: ethancrall
* Group Name: Gain & Grain

### What I planned to do

* Profile search bar ([Issue #36](https://github.com/utk-cs340-fall24/Gain-Grain/issues/36))
* Edit profile page ([Issue #46](https://github.com/utk-cs340-fall24/Gain-Grain/issues/46))
* Other users' profile pages ([Issue #50](https://github.com/utk-cs340-fall24/Gain-Grain/issues/50))
* Cookies/User sessions ([Issue #51](https://github.com/utk-cs340-fall24/Gain-Grain/issues/51))
* Profile Page ([Issue #52](https://github.com/utk-cs340-fall24/Gain-Grain/issues/52))

### What I did not do

I did some of Issues #50 and #52, but did not fully complete them.

### What problems I encountered

I didn't encounter too many problems, just still figuring out different schema formats and backend techniques.

### Issues I worked on

* [Issue #36](https://github.com/utk-cs340-fall24/Gain-Grain/issues/36)
* [Issue #46](https://github.com/utk-cs340-fall24/Gain-Grain/issues/46)
* [Issue #50](https://github.com/utk-cs340-fall24/Gain-Grain/issues/50)
* [Issue #51](https://github.com/utk-cs340-fall24/Gain-Grain/issues/51)
* [Issue #52](https://github.com/utk-cs340-fall24/Gain-Grain/issues/52)

### Files I worked on

* gain-grain/src/app/profile/page.js
* gain-grain/src/app/profile/profile.module.css
* gain-grain/src/app/api/search-accounts/route.js
* gain-grain/src/app/search/profile/page.js
* gain-grain/src/app/search/profile/profile.module.css
* gain-grain/src/components/Navbar.js
* gain-grain/src/components/navbar.module.css
* gain-grain/src/utils/userModel.js
* gain-grain/.env.example
* gain-grain/src/app/api/profile/update-user/route.js
* gain-grain/src/app/api/profile/upload-pic/route.js
* gain-grain/src/app/edit-profile/page.js
* gain-grain/src/app/api/profile/get-user-by-username/route.js
* gain-grain/src/app/api/login/find-user/route.js
* gain-grain/src/middleware.js
* gain-grain/src/utils/auth.js
* gain-grain/src/app/api/profile/get-user-from-session/route.js
* gain-grain/src/app/notifications/page.js
* gain-grain/src/app/savedMeals/page.js
* gain-grain/src/app/savedWorkouts/page.js
* gain-grain/src/app/post/post-blog/page.js
* gain-grain/src/app/post/post-meals/page.js
* gain-grain/src/utils/userBlogs.js
* gain-grain/src/app/api/blogs/route.js
* gain-grain/src/app/post/post-workouts/page.js
* gain-grain/src/app/api/posts/post-meal/route.js
* gain-grain/src/app/api/posts/post-progress-pic/route.js
* gain-grain/src/app/api/posts/save-post/route.js
* gain-grain/src/app/post/post-progress-pictures/page.js
* gain-grain/src/utils/postModels/Post.js
* gain-grain/src/utils/userMeal.js
* gain-grain/src/utils/userPosts.js
* gain-grain/src/utils/userProgressPics.js
* gain-grain/src/app/api/profile/follow-unfollow-user/route.js
* gain-grain/src/app/api/profile/following/route.js
* gain-grain/src/app/api/notifications/dismiss-notifications/route.js
* gain-grain/src/app/api/delete-cookie/route.js

### What I accomplished

In Sprint 3, I first added the search feature on the navigation bar so users can search other
user's profiles and view them. Second, I worked on the frontend and backend for the edit profile
page so users can edit their profile information. Third, I added cookies and their verification
process so the user is required to log in everytime they visit the page to view their account 
information. This also creates a user session and makes it easy to grab the user's information. 
Lastly, I did some work on the user's profile page frontend/backend and the frontend/backend for 
other users' profile pages you can view when searching them (mainly the follow/unfollow backend).