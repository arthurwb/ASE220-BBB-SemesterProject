//id of the jsonBlob page
const documentID = 'Posts';
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
    let cookie = document.cookie.split("=")[1]
    let username = "no username";
    if (cookie) {
        api.GET_USER(cookie, function(response) {
            $("#username").text(response.username);
        });
    } else {
        $("#username").text("Not signed in");
    }

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

function search() {
    let type = parseInt($("#inputGroupSelect01").val()) || null;
    const item = $("#form1").val() || null;

    $("#backbutton").addClass("d-none");
    $("#nextbutton").addClass("d-none");

    $("#paginiationButtons").html(`<button type="button" id="backbutton" onclick="location.href = '/';" class="btn btn-sm btn-outline-secondary" style="margin: 20px;">Back</button>`);

    console.log(item)

    switch(type) {
        case 1:
            axios({
                method: 'get',
                url: '/api/data/search?song='+item,
                    validateStatus:()=>true
            })
                .then(function (response) {
                    $('#postContainer').empty();

                    // loop through each post in the response and create an HTML element to display it
                    response.data.forEach(function(response) {
                        const postHTML = `
                        <div class="row">
                            <div class="card col-12 border-success mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                                <div class="card-header bg-transparent border-success">${response.username}</div>
                                <div class="card-body text-success">
                                    <h5 class="card-title">${response.title}</h5>
                                    <p class="card-text">${response.rating} out of 10</p>
                                </div>
                                <div class="card-footer bg-transparent border-success">
                                    ${response.timestamp}
                                    <a class="btn btn-primary" style="float: right;" onclick="location.href ='post?id=${response.id}';">View Post</a>
                                </div>
                            </div>
                        </div>`;
                        $('#postContainer').append(postHTML);
                    });
                })
                .catch(function (error) {
                console.log(error);
            });
            break;
        case 2:
            axios({
                method: 'get',
                url: '/api/data/search?album='+item,
                    validateStatus:()=>true
            })
            .then(function (response) {
                $('#postContainer').empty();

                // loop through each post in the response and create an HTML element to display it
                response.data.forEach(function(response) {
                    const postHTML = `
                    <div class="row">
                        <div class="card col-12 border-success mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                            <div class="card-header bg-transparent border-success">${response.username}</div>
                            <div class="card-body text-success">
                                <h5 class="card-title">${response.title}</h5>
                                <p class="card-text">${response.rating} out of 10</p>
                            </div>
                            <div class="card-footer bg-transparent border-success">
                                ${response.timestamp}
                                <a class="btn btn-primary" style="float: right;" onclick="location.href ='post?id=${response.id}';">View Post</a>
                            </div>
                        </div>
                    </div>`;
                    $('#postContainer').append(postHTML);
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            break;
        case 3:
            axios({
                method: 'get',
                url: '/api/data/search?artist='+item,
                    validateStatus:()=>true
            })
            .then(function (response) {
                $('#postContainer').empty();

                // loop through each post in the response and create an HTML element to display it
                response.data.forEach(function(response) {
                    const postHTML = `
                    <div class="row">
                        <div class="card col-12 border-success mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                            <div class="card-header bg-transparent border-success">${response.username}</div>
                            <div class="card-body text-success">
                                <h5 class="card-title">${response.title}</h5>
                                <p class="card-text">${response.rating} out of 10</p>
                            </div>
                            <div class="card-footer bg-transparent border-success">
                                ${response.timestamp}
                                <a class="btn btn-primary" style="float: right; background-color: #fd9f57;" onclick="location.href ='post?id=${response.id}';">View Post</a>
                            </div>
                        </div>
                    </div>`;
                    $('#postContainer').append(postHTML);
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            break;
    }
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
    let username = "username error";
    api.GET_USER(document.cookie.split("=")[1], function(response) {
        username = response.username;
    });
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
            api.PUT(documentID, newData, -1, "post");
            alert("Post Created");
            document.location.reload();
        });
    } else {
        alert("Input not valid")
    }
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
api.GET(documentID, async function(response) {  
    numOfPosts = response.data.length;
    var counter = 0;
    while (counter < postPerPage && response.data[index] + 1) {

        //axios request to set id
        await axios.get(`${api.endpoint}getuserid/Users/${response.data[index].username}`,{}).then(function(res){
            //template for creating a new post
            let userData;
            console.log(typeof res.data[0]._id)
            if (typeof res.data[0]._id === "undefined") { 
                userData = 0 
            } else { 
                userData = res.data[0]._id 
            }
            var newPost = `
            <div class="row">
                <div class="card col-12 border-dark mb-3" style="margin-top: 2em; margin-bottom: 2em; margin-right: 0; background: #dddddd; right: 0;">
                <button class="card-header bg-transparent border-dark" onclick="location.href = 'profile?id=${userData}'">${response.data[index].username}</button>
                    <div class="card-body text-dark" ">
                        <h5 class="card-title">${response.data[index].title}</h5>
                        <p class="card-text">${response.data[index].rating} out of 10</p>
                    </div>
                    <div class="card-footer bg-transparent border-dark">
                        ${response.data[index].timestamp}
                        <a class="btn btn-primary" style="float: right;" onclick="location.href ='post?id=${response.data[index].id}';">View Post</a>
                    </div>
                </div>
            </div>`;
            //adds new post to page
            document.querySelector("#postContainer").innerHTML += newPost;
        }).catch(function(error){
            console.log("axios error" + error);
        });
        counter++;
        index++
    }

    //logic for determing the page number of the next page and previous page
    var elements = document.getElementById("paginiationButtons");
    if (getAllUrlParams().page > 1) {
        page = parseInt(getAllUrlParams().page) + 1;
        back_page = parseInt(getAllUrlParams().page) - 1;
    }
    else {
        var page = 2;
    }

    //adds the back button as long as the page is not the first page
    if (back_page > 0) {
        elements.innerHTML += `<button type="button" id="backbutton" onclick="location.href = '/?page=${back_page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px;">Previous</button>`
    }
    // again below is mainly just for the formating of the buttons so that they always exist in one place and dont shift
    else{
        elements.innerHTML += `<button type="button" id="backbutton" onclick="location.href = '/?page=${back_page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px; visibility:hidden;">Previous</button>`
    }

    //adds the next button to the page
    if (numOfPosts > (page * postPerPage) - postPerPage){
        elements.innerHTML += `<button type="button" id="nextbutton" onclick="location.href = '/?page=${page}';" class="btn btn-sm btn-outline-secondary" style="margin: 20px;">Next</button>`
    }
});