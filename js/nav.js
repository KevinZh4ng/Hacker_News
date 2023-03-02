"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */


function navAllStories(evt) {
  console.debug("navAllStories", evt);
  $storiesContainer.show();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function navSubmitStory(evt){
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
  putStoriesOnPage();
}

$navSubmission.on("click", navSubmitStory);
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
}

$navLogin.on("click", navLoginClick);


function navFavoriteClick(evt){
  console.debug("favoriteClick", evt);
  hidePageComponents();
  loadFavorites()
  $favoriteStoriesList.show();
}
$navFavorites.on("click",navFavoriteClick);

function navMyStories(evt){
  console.debug("favoriteClick", evt);
  hidePageComponents();
  loadUsersStories();
  $myStoriesList.show();
}
$navMyStories.on("click",navMyStories);

function navProfileClick(evt){
  console.debug("profileClick", evt);
  hidePageComponents();
  $storiesContainer.hide();
  $profile.show();
}

$navUserProfile.on("click",navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


