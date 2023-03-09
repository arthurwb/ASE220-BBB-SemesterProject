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
            document.getElementById("title").innerText = post.title;
            document.getElementById("posted").innerText = `Posted by ${post.username} at ${post.timestamp}`
            document.getElementById("song").innerText = `Song - ${post.song}`;
            document.getElementById("artist").innerText = `Artist - ${post.artist}`;
            document.getElementById("album").innerText = `Album - ${post.album}`;
            document.getElementById("rating").innerText = `Rating - ${post.rating} out of 10`;
            document.getElementById("review").innerText = `Review - ${post.review}`;
            post.comments.forEach(comment => {
                document.getElementById("post-comments").innerHTML += `
                <div class="border rounded p-2 mb-1">
                    <p><b>${comment.commentUsername}</b></p>
                    <p>${comment.commentText}</p>
                </div>
                `;
            });
        }
    }
});

function displaySuccessMessage() {
    console.log('Post successfully added!');
}

async function createComment() {
    const commentUsername = document.getElementById("username").value;
    const commentText = document.getElementById("comment-text").value;
    const newComment = {
        commentUsername: commentUsername,
        commentText: commentText
    }
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
}

// most of this code has been taken from app.js and slightly altered
function showCreateCommentForm() {
    // Hide the original "Create New Comment" button
    const createCommentButton = document.getElementById("post-comment-button");
    createCommentButton.style.display = "none";

    // Show the form
    const createCommentForm = document.getElementById("comment-form");
    createCommentForm.style.display = "block";
}

async function commentSubmitForm() {
    createComment();
    console.log('Comment submitted!');
    document.getElementById('post-comment-button').style.display = 'block';
    document.getElementById('comment-form').style.display = 'none';
}

function commentCancelForm() {
    document.getElementById('post-comment-button').style.display = 'block';
    document.getElementById('comment-form').style.display = 'none';
}