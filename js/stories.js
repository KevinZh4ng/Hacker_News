"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  //console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  //checks to see if current user is logged in
  const star = Boolean(currentUser); 

  return $(`
      <li id="${story.storyId}">
      <div>
        ${showDelete ? `<span class="trash"> <i class="fas fa-trash-alt"></i></span>`: ""}
        ${star ? getStar(story, currentUser):""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

function getStar(story, user){
  const fav = user.isFavorite(story);
  const type = fav ? "fas" : "far";
  return `<span class="star"><i class="${type} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Function for submitting a story
async function submitStory() {
  console.log("Debug for Submitting Stories");

  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  const user = currentUser.username;

  const story = await storyList.addStory(currentUser, title, author, url);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $submitForm.hide();
}

$submitForm.on("submit", submitStory);

async function deleteStory(e){
  console.debug("deleteStory");
  let story = $(e.target).closest("li");
  let storyID = story.attr("id");
  await storyList.deleteStory(currentUser, storyID);
  await loadUsersStories();
}

$myStoriesList.on("click", ".trash", deleteStory);

function loadUsersStories(){
  $myStoriesList.empty();
  console.log(currentUser.ownStories.length);
  if(currentUser.ownStories.length === 0){
    $myStoriesList.append("<h4>User hasn't created any Stories yet!</h4>")
  }
  else{
    for(let s of currentUser.ownStories){
      let story = generateStoryMarkup(s, true);
      $myStoriesList.append(story);
    }
  }
}

function loadFavorites(){
  $favoriteStoriesList.empty();
  if(currentUser.favorites.length === 0){
    $favoriteStoriesList.append("<h4>No Favorites</h4>")
  }
  else{
    for(let s of currentUser.favorites){
      let story = generateStoryMarkup(s, false);
      $favoriteStoriesList.append(story);
    }
  }
}

async function setFavorites(evt){
  const target = $(evt.target);
  let favStory = $(target).closest("li");
  console.log(favStory);
  const storyID = favStory.attr("id");
  const story = storyList.stories.find(s => {return s.storyId === storyID});

  if(target.hasClass("fas")){
    await currentUser.deleteStory(story)
    target.closest("i").toggleClass("far fas");
  }
  else{
    await currentUser.addStory(story)
    target.closest("i").toggleClass("fas far");
  }

}

$storiesLists.on("click", ".star", setFavorites);