//id of the jsonBlob page
const documentID = '1082748833116733440';
// 1082748833116733440

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
    $("#create-post-button").addClass("d-none").removeClass("d-block");

    // Show the form
    $("#postForm").addClass("d-block").removeClass("d-none");
}

function submitForm() {
    // Your code to handle form submission goes here
    createPost();
    console.log('Form submitted!');
    $("#create-post-button").addClass("d-block").removeClass("d-none");
    $("#postForm").addClass("d-none").removeClass("d-block");
}

function cancelForm() {
    $("#create-post-button").addClass("d-block").removeClass("d-none");
    $("#postForm").addClass("d-none").removeClass("d-block");
}

function displaySuccessMessage() {
    console.log('Post successfully added!');
}

// used to test the validation of a new post
function validation(username, title, review, rating) {
    let response;
    if (rating < 0 || rating > 10) {
        response = false
    } else if (username == "") {
        response = false
    } else if (title == "") {
        response = false
    } else if (review == "") {
        response = false
    } else {
        response = true
    }

    return response;
}

function createPost() {
    // Get the form input values
    const username = $("#username").val();
    const artist = $("#artist").val() || null;
    const album = $("#album").val() || null;
    const song = $("#song").val() || null;
    const rating = $("#rating").val() || null;
    const title = $("#title").val();
    const review = $("#review").val();
    const timestamp = getCurrentDateTime();
    const comments = [];
    let isValid = validation(username, title, review, rating);

    if (isValid) {
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
            comments,
            };

            // Send an UPDATE request
            api.UPDATE(documentID, newData, displaySuccessMessage());
        });
    } else {
        alert("Input not valid")
    }
  }    

//appends cards to index page
api.GET(documentID, function(response) {  
    for (i = 0; i < response.data.length; i++) {
        //template for creating a new post
        var newPost = `
        <div class="row">
            <div class="card col-12 border-success mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                <div class="card-header bg-transparent border-success">${response.data[i].username}</div>
                <div class="card-body text-success">
                    <h5 class="card-title">${response.data[i].title}</h5>
                    <p class="card-text">${response.data[i].rating} out of 10</p>
                </div>
                <div class="card-footer bg-transparent border-success">
                    ${response.data[i].timestamp}
                    <a class="btn btn-primary" style="float: right;" onclick="location.href ='post.html?id=${response.data[i].id}';">View Post</a>
                </div>
            </div>
        </div>`;

        //adds new post to page
        document.querySelector(".col-10").innerHTML += newPost;
    }
});