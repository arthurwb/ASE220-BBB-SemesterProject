//id of the jsonBlob page
const documentID = '1082768886235152384';

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
    
    // Create a data object with the form input values
    const newData = {
        username,
        artist,
        album,
        song,
        rating,
        title,
        review,
        timestamp,
    };
    
    // Send an UPDATE request
    api.UPDATE(documentID, newData, displaySuccessMessage());
}

api.GET('1082768886235152384', function(response) {  
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
                    <a href="#" class="btn btn-primary" style="float: right;">View Post</a>
                </div>
            </div>
        </div>`;

        //adds new post to page
        document.querySelector(".col-10").innerHTML += newPost;
    }
});
