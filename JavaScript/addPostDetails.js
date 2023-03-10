//id of the jsonBlob page
const documentID = '1082748833116733440';
// 1082748833116733440

//gets id
const id = getAllUrlParams().id;

//appends data to post page
api.GET(documentID, function(response) {  
    for (i = 0; i < response.data.length; i++) {
        if (id == response.data[i].id) {
            var post = response.data[i];

            $("#title").text(post.title);
            $("#posted").text(`Posted by ${post.username} at ${post.timestamp}`);
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
        }
    }
});

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
    const commentUsername = document.getElementById("username").value;
    const commentText = document.getElementById("comment-text").value;
    const newComment = {
        commentUsername: commentUsername,
        commentText: commentText
    }

    if (validation(commentUsername, commentText)) {
        // collectes data from api
        api.GET(documentID, function(response) {
            for (let i = 0; i < response.data.length; i++) {
                if (id == response.data[i].id) {
                    var post = response.data[i];
                    // puts new comment after all existing comments
                    post.comments.push(newComment);

                    // pushes all data including new comment to the api
                    api.PUT(documentID,response.data,function(putRes){
                        console.log(putRes);
                        displaySuccessMessage();
                        // reloads the page so that you can see the new comment
                        document.location.reload();
                    });
                };
            }
        });
    } else {
        alert("Username or comment text left empty");
    }
}

// most of this code has been taken from app.js and slightly altered
function showCreateCommentForm() {
    // Hide the original "Create New Comment" button
    $("#post-comment-button").addClass("d-none").removeClass("d-block");

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