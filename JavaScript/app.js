function showCreatePostForm() {
    // Hide the original "Create New Post" button
    const createPostButton = document.getElementById("create-post-button");
    createPostButton.style.display = "none";

// Hide the original "Delete Existing Post" button
    const deletePostButton = document.getElementById("delete-post-button");
    deletePostButton.style.display = "none";

// Show the form
    const createPostForm = document.getElementById("postForm");
    createPostForm.style.display = "block";
}

function showDeletePostForm(postId) {
    // Hide the original "Create New Post" button
    const createPostButton = document.getElementById("create-post-button");
    createPostButton.style.display = "none";

    // Hide the original "Delete Existing Post" button
    const deletePostButton = document.getElementById("delete-post-button");
    deletePostButton.style.display = "none";

    // Show the form
    const deletePostForm = document.getElementById(`postForm`);
    deletePostForm.style.display = "block";
}

function submitForm() {
    // Your code to handle form submission goes here
    console.log('Form submitted!');
    document.getElementById('create-post-button').style.display = 'block';
    document.getElementById('delete-post-button').style.display = 'block';
    document.getElementById('postForm').style.display = 'none';
}

function cancelForm() {
    document.getElementById('create-post-button').style.display = 'block';
    document.getElementById('delete-post-button').style.display = 'block';
    document.getElementById('postForm').style.display = 'none';
}

function createPost() {
    // Your code to create a new post goes here
    console.log('New post created!');
}

function deletePost() {
    // Your code to delete an existing post goes here
    console.log('Existing post deleted!');
}  

api.GET('1082768886235152384', function(response) {  
    for (i = 0; i < response.data.length; i++) {
        //template for creating a new post
        var newPost = `
        <div class="card border-success mb-3" style="max-width: 18rem; margin: 30px;">
            <div class="card-header bg-transparent border-success">${response.data[i].username}</div>
            <div class="card-body text-success">
                <h5 class="card-title">${response.data[i].postTitle}</h5>
                <p class="card-text">${response.data[i].numberReview} out of 10</p>
            </div>
            <div class="card-footer bg-transparent border-success">
            ${response.data[i].timeStamp}
            <a href="#" class="btn btn-primary" style="float: right;">View Post</a>
            </div>
        </div>`;

        //adds new post to page
        document.querySelector("body").innerHTML += newPost;
    }
  });