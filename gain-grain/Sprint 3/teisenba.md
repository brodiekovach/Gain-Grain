# Sprint 3

Trevor Eisenbacher
trevorbacher
Gain-Grain

### What you planned to do
* Create a comments section that pops out and can accept user comments to be stored in database
* [gh-37](https://github.com/utk-cs340-fall24/Gain-Grain/issues/37)
* Create a menu for the share button on posts to share to other sites 
* [gh-38](https://github.com/utk-cs340-fall24/Gain-Grain/issues/38)
* Add functionality to count the amount of likes on a post
* [gh-40](https://github.com/utk-cs340-fall24/Gain-Grain/issues/40)

### What you did not do
* I did not finalize the comment section. Because of all the trouble Peyton and I
* had with the backend and getting the routes setup so that posts would show up on
* at least the user page, I did not have the time or an example post on the website to
* create anything more than a pop-out that slides out when the comment button is pressed.
* I did not get to work on the share button or like counts because of the need for posts
* to be retrieved from the backend first. See next section.

### What problems you encountered
* I had a ton of trouble getting the backend to work with me because this is my first time ever
* using a backend. I found out quickly that the three issues I had made for this sprint relied heavily on the
* posts being retrieved from the backend, so the functionality for the buttons on the posts had to be pushed
* back to sprint 4.

### Issues you worked on
* [gh-37](https://github.com/utk-cs340-fall24/Gain-Grain/issues/37)
* [gh-59](https://github.com/utk-cs340-fall24/Gain-Grain/issues/59)
* [gh-64](https://github.com/utk-cs340-fall24/Gain-Grain/issues/64)

### Files you worked on
* gain-grain/models/Post.js
* gain-grain/src/app/api/posts/route.js
* gain-grain/src/components/Feed.js
* gain-grain/src/utils/postModel.js
* gain-grain/src/app/post/post-blog/page.js
* gain-grain/src/app/post/post-meals/page.js
* gain-grain/src/app/post/post-workouts/page.js
* gain-grain/src/app/api/posts/get-posts/route.js
* gain-grain/src/app/page.js
* gain-grain/src/app/profile/page.js
* gain-grain/src/middleware.js
* gain-grain/src/utils/userPosts.js
* gain-grain/src/app/api/posts/get-followed-user-posts/[id]/route.js
* gain-grain/src/app/api/posts/get-followed-user-posts/route.js
* gain-grain/src/app/api/posts/get-posts/[id]/route.js
* gain-grain/src/app/api/blogs/[id]/route.js
* gain-grain/src/app/api/blogs/route.js
* gain-grain/src/app/api/delete-cookie/route.js
* gain-grain/src/app/api/exercises/saveExercise/route.js
* gain-grain/src/app/api/exercises/search/route.js
* gain-grain/src/app/api/forgot-password/send-email/route.js
* gain-grain/src/app/api/login/find-user/route.js

### What you accomplished
Overall for this sprint, I created the functionality for posts to be retrieved from the backend
depending on current user id, followed users, and followers. I also addressed several user interface 
issue and added many comments to code we already had in the repo. I also went through and cleaned up 
multiple of the apis that needed refining. 