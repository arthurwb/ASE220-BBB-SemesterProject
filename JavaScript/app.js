//id of the jsonBlob page
const documentID = '1082748833116733440';

//function for getting formatted timestamp
function getCurrentDateTime() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date();
    let hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const month = months[date.getMonth()];
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return hour + ":" + minute + " " + ampm + " - " + day + " " + month + " " + year;
}

function showCreatePostForm() {
    // Hide the original "Create New Post" button
    const createPostButton = document.getElementById("create-post-button");
    createPostButton.style.display = "none";

    // Show the form
    const createPostForm = document.getElementById("postForm");
    createPostForm.style.display = "block";
}

function submitForm() {
    // Your code to handle form submission goes here
    createPost();
    console.log('Form submitted!');
    document.getElementById('create-post-button').style.display = 'block';
    document.getElementById('postForm').style.display = 'none';
}

function cancelForm() {
    document.getElementById('create-post-button').style.display = 'block';
    document.getElementById('postForm').style.display = 'none';
}

function displaySuccessMessage() {
    console.log('Post successfully added!');
}

function createPost() {
    // Get the form input values
    const username = document.getElementById("username").value;
    const artist = document.getElementById("artist").value || null;
    const album = document.getElementById("album").value || null;
    const song = document.getElementById("song").value || null;
    const rating = document.getElementById("rating").value || null;
    const title = document.getElementById("title").value;
    const review = document.getElementById("review").value;
    const timestamp = getCurrentDateTime();
  
    // Get the current data from the JSON blob
    api.GET(documentID, function(response) {
      // Generate a random 6 digit number that is not already in use
      let id = Math.floor(Math.random() * 900000) + 100000;
      while (response.data.some(post => post.id === id)) {
        id = Math.floor(Math.random() * 900000) + 100000;
      }
  
      // Create a data object with the form input values and assigned ID
      const newData = {
        username,
        artist,
        album,
        song,
        rating,
        title,
        review,
        timestamp,
        id,
      };
  
      // Send an UPDATE request
      api.UPDATE(documentID, newData, displaySuccessMessage());
    });
  }    

//initilize variables
let postPerPage = 4;
let numOfPosts = 0;
var page = getAllUrlParams().page;
var validPage = true;
var index = 0;
var back_page = 0;

//checks for index page without params
if (page == undefined) {
    page = 1;
}

if (validPage == true) {
    //gets the starting index for detail.json
    if (getAllUrlParams().page >= 2) {
      var i = 0;
      while (i < (getAllUrlParams().page - 1) * postPerPage) {
        i++;
        index++;
      }
    }
    else{
      index = 0;
    }
}

//appends cards to index page
api.GET(documentID, function(response) {  
    numOfPosts = response.data.length;
    var counter = 0;
    while (counter < postPerPage && response.data[index] + 1) {
        //template for creating a new post
        var newPost = `
        <div class="row">
            <div class="card col-12 border-success mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                <div class="card-header bg-transparent border-success">${response.data[index].username}</div>
                <div class="card-body text-success">
                    <h5 class="card-title">${response.data[index].title}</h5>
                    <p class="card-text">${response.data[index].rating} out of 10</p>
                </div>
                <div class="card-footer bg-transparent border-success">
                    ${response.data[index].timestamp}
                    <a class="btn btn-primary" style="float: right;" onclick="location.href ='post.html?id=${response.data[index].id}';">View Post</a>
                </div>
            </div>
        </div>`;

        //adds new post to page
        document.querySelector(".col-10").innerHTML += newPost;
        counter++;
        index++
    }

    //logic for determing the page number of the next page and previous page
    var elements = document.getElementsByTagName("body");
    if (getAllUrlParams().page > 1) {
        page = parseInt(getAllUrlParams().page) + 1;
        back_page = parseInt(getAllUrlParams().page) - 1;
    }
    else {
        var page = 2;
    }

    //adds the back button as long as the page is not the first page
    if (back_page > 0) {
        elements[0].innerHTML += `<button type="button" onclick="location.href = 'index.html?page=${back_page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px;">Previous</button>`
    }
    // again below is mainly just for the formating of the buttons so that they always exist in one place and dont shift
    else{
        elements[0].innerHTML += `<button type="button" onclick="location.href = 'index.html?page=${back_page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px; visibility:hidden;">Previous</button>`
    }

    //adds the next button to the page
    if (numOfPosts > (page * postPerPage) - postPerPage){
        elements[0].innerHTML += `<button type="button" onclick="location.href = 'index.html?page=${page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px;">Next</button>`
    }
});