//id of the jsonBlob page
const documentID = 'Posts';
// 1082748833116733440

//gets id
const id = getAllUrlParams().id;

let commentProfileImg;
let commentUserId;

//appends data to post page
api.GET(documentID, async function(response) {  
    for (i = 0; i < response.data.length; i++) {
        if (id == response.data[i].id && id != 0) {
            var post = response.data[i];
            $("#title").text(post.title);
            await axios.get(`${api.endpoint}getuserid/Users/${post.username}`,{}).then(async function(res){
                profileImg = res.data[0].profileImg
                $("#user").html(`
                <button class="user-button" onclick="location.href='profile?id=${res.data[0]._id}'">
                        <img src="/images/${res.data[0].profileImg}" height="50px" width="50px" style="vertical-align: middle;">
                        <div>${post.username}</div>
                </button>
                `)
            }).catch(function(error){
                console.log("axios error" + error);
            });
            $("#posted").text(`Posted on ${post.timestamp}`);
            $("#song").text(`Song - ${post.song}`);
            $("#artist").text(`Artist - ${post.artist}`);
            $("#album").text(`Album - ${post.album}`);
            $("#rating").text(`Rating - ${post.rating} out of 10`);
            $("#review").text(`Review - ${post.review}`);
            post.comments.forEach(comment => {
                axios.get(`${api.endpoint}getuserid/Users/${comment.commentUsername}`,{}).then(function(res2){
                    commentUserId = res2.data[0]._id
                    commentProfileImg = res2.data[0].profileImg
                    $("#post-comments").append(`
                    <div class="border rounded p-2 mb-1">
                        <button class="card-button" onclick="location.href='profile?id=${commentUserId}'" style="margin-left: 0; margin-top: 0;">
                            <img src="images/${commentProfileImg}" height="45px" width="45px" style="vertical-align: middle;">
                            <div>${comment.commentUsername}</div>
                        </button>
                        <p>${comment.commentText}</p>
                    </div>
                    `);
                })
            });
            api.GET_USER(document.cookie.split("=")[1], function(response) {
                if (response.username == post.username) {
                    $("#deleteHolder").html(`<button id="post-delete-button" type="button" class="btn btn-error d-block" onclick="deletePost()">Delete Post</button>`);
                }
            });
        }
    }
});

// todo: authenticate 
function deletePost() {
    console.log(id);
    const postDelete = { id: parseInt(id) };
    api.DELETE(documentID, postDelete, function(response) {
        console.log(response);
        alert("Post Deleted");
        document.location.href = "/";
    });
}

function displaySuccessMessage() {
    console.log('Post successfully added!');
}

// used to test the validation of a new comment
function validation(commentUsername, commentText) {
    let response;

    if (commentUsername == "") {
        response = false;
    } else if (commentText == "") {
        response = false;
    } else {
        response = true;
    }

    return response;
}

async function createComment() {
    let commentUsername = $("#username").text();
    // const commentUsername = document.getElementById("username").value;
    const commentText = $("#comment-text").val();
    // const commentText = document.getElementById("comment-text").value;
    const newComment = {
        commentUsername: commentUsername,
        commentText: commentText
    }

    if (validation(commentUsername, commentText)) {
        api.PUT(documentID,newComment,id,"comment",function(putRes){
            console.log(putRes);
            displaySuccessMessage();
            // reloads the page so that you can see the new comment
            document.location.reload();
        });
    } else {
        alert("Username or comment text left empty");
    }
}

// most of this code has been taken from app.js and slightly altered
function showCreateCommentForm() {
    // Hide the original "Create New Comment" button
    $("#post-comment-button").addClass("d-none").removeClass("d-block");
    if (document.cookie.split("=")[1]) {
        api.GET_USER(document.cookie.split("=")[1], function(response) {
            $("#username").text(response.username);
        });
    } else {
        $("#username").text("Not signed in");
    }

    // Show the form
    $("#comment-form").addClass("d-block").removeClass("d-none");
}

async function commentSubmitForm() {
    createComment();
    console.log('Comment submitted!');
    $("#post-comment-button").addClass("d-block").removeClass("d-none");
    $("#comment-form").addClass("d-none").removeClass("d-block");
}

function commentCancelForm() {
    $("#post-comment-button").addClass("d-block").removeClass("d-none");
    $("#comment-form").addClass("d-none").removeClass("d-block");
}

function likePost() {
    if ($("#likeButton path").attr("liked") == "false") {
        $("#likeButton").html(`<path liked="true" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5" fill="#fd9f57"/>`)
    }
    else {
        $("#likeButton").html(`<path liked="false" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" fill="#fd9f57"/>`)
    }
    
}