//id of the jsonBlob page
const documentID = 'Posts';
// 1082748833116733440

//gets id
const id = getAllUrlParams().id;

//appends data to post page
api.GET(documentID, function(response) {  
    for (i = 0; i < response.data.length; i++) {
        if (id == response.data[i].id) {
            var post = response.data[i];

            $("#title").text(post.title);
            $("#user").html(`
            <button style="display: inline-block;" onclick="location.href='profile?username=${post.username}';">
                <img src="images/account.png" height="20px" width="20px" style="vertical-align: middle;">
                <span style="display: inline-block; margin-left: 10px; vertical-align: middle;">${post.username}</span>
            </button>
            `)
            $("#posted").text(`Posted on ${post.timestamp}`);
            $("#song").text(`Song - ${post.song}`);
            $("#artist").text(`Artist - ${post.artist}`);
            $("#album").text(`Album - ${post.album}`);
            $("#rating").text(`Rating - ${post.rating} out of 10`);
            $("#review").text(`Review - ${post.review}`);
            post.comments.forEach(comment => {
                $("#post-comments").append(`
                <div class="border rounded p-2 mb-1">
                    <p><b>${comment.commentUsername}</b></p>
                    <p>${comment.commentText}</p>
                </div>
                `);
            });
            if (document.cookie.split("=")[1] == post.username) {
                console.log("display delete button");
                console.log(document.cookie.split("=")[1]);
                console.log(post.username);
                $("#deleteHolder").html(`<button id="post-delete-button" type="button" class="btn btn-error d-block" onclick="deletePost()">Delete Post</button>`);
            } else {
                console.log("else");
                console.log(document.cookie.split("=")[1]);
                console.log(post.username);
            }
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
    const commentUsername = document.cookie.split("=")[1] ?? "";
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
        $("#username").text(document.cookie.split("=")[1]);
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