const id = getAllUrlParams().id;
//console.log(id);

let username;

api.GET_ITEM("Users", id, function(res) {
    username = res[0].username
    $("#username").text(username);
    $("#bio").text(res[0].bio);
    fillProfilePosts();
})

function fillProfilePosts() {
    api.GET("Posts", async function(res) {
        res.data.forEach(function(response) {
            if (response.username == username) {
                var newPost = `
                <div class="row">
                    <div class="card col-12 border-dark mb-3" style="margin-top: 2em; margin-bottom: 2em;">
                        <div class="card-header bg-transparent border-dark">${response.username}</div>
                        <div class="card-body text-dark">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.rating} out of 10</p>
                        </div>
                        <div class="card-footer bg-transparent border-dark">
                            ${response.timestamp}
                            <a class="btn btn-primary" style="float: right;" onclick="location.href ='post?id=${response.id}';">View Post</a>
                        </div>
                    </div>
                </div>`;
            //adds new post to page
            $("#post-list").append(newPost);
            }
        })
    })
}