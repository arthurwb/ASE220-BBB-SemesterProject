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
                if (response.username == post.username || response.admin == true) {
                    console.log("display delete button");
                    console.log(document.cookie.split("=")[1]);
                    console.log(post.username);
                    $("#deleteHolder").html(`<button id="post-delete-button" type="button" class="btn btn-error d-block" onclick="deletePost()">Delete Post</button>`);
                    $("#editHolder").html(`<button id="post-edit-button" type="button" class="btn btn-warning d-block" onclick="showEditPostForm()">Edit Post</button>`);
                }
            });
        }
    }
});

function alertUser(text, location) {
    let sendTo = ""
    if (!location) {
        sendTo = "document.location.reload();";
    } else {
        sendTo = `document.location.href = "${location}"`;
    }
    $("body").append(`
    <div class="fixed-top fixed-bottom d-flex justify-content-center align-items-center" style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="d-flex justify-content-center align-items-center bg-warning rounded" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="text-center p-2">
                ${text}
                <button class="btn btn-primary d-block" type="button" onclick="${sendTo}">Close</button>
            </div>
        </div>
    </div>
    `)
}

// todo: authenticate 
function deletePost() {
    console.log(id);
    const postDelete = { id: parseInt(id) };
    api.DELETE(documentID, postDelete, function(response) {
        console.log(response);
        alert("Post Deleted", "/");
        document.location.href = "/";
    });
}

function editPost() {
    const data = $("#newReview").val();
    console.log("editPost: " + data);
    api.PUT(documentID, { review: data }, id, "editPost", function(putRes) {
        console.log(putRes);
    });
    alert("Post Updated");
    document.location.reload();
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

    if (validation(commentUsername, commentText) && commentUsername != "Not signed in") {
        api.PUT(documentID,newComment,id,"comment",function(putRes){
            console.log(putRes);
        });
        alertUser("Comment created");

    } else {
        alertUser("Username or comment text left empty");
    }
}

function showEditPostForm() {
    const prefix = "Review - ";
    const prefixIndex = $("#review").text().indexOf(prefix);
    const reviewText = $("#review").text().slice(prefixIndex + prefix.length);
    $("#editHolder").html(`
        <input type="text" class="form-control" id="newReview" value="${reviewText}"></input>
        <button id="editPostButton" type="button" onclick="editPost()">Submit</button>
        <button id="undoEdit" type="button" onclick="document.location.reload();">Close</button>
    `)
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
    $("#post-comment-button").addClass("d-block").removeClass("d-none");
    $("#comment-form").addClass("d-none").removeClass("d-block");
}

function commentCancelForm() {
    $("#post-comment-button").addClass("d-block").removeClass("d-none");
    $("#comment-form").addClass("d-none").removeClass("d-block");
}