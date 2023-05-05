const id = getAllUrlParams().id;
//console.log(id);

let username;

api.GET_ITEM("Users", id, async function(response) {
    username = response[0].username;
    await axios.get(`${api.endpoint}getuserid/Users/${response[0].username}`,{}).then(function(res){
        $(".profileImg").attr("src", `images/${res.data[0].profileImg}`);
        $("#username").text(response[0].username);
        $("#bio").text(response[0].bio);
        fillProfilePosts();
    })
})

api.GET_USER(document.cookie.split("=")[1], function(response) {
    if (response.username == username) {
        $(".editProfileImg").html(`
            <p>
                <a class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Change Profile Picture
                </a>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    <div class="profile-img-container profileImgCard">
                        <img src="images/profile_img_1.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_2.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_3.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_4.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_5.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_6.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_7.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <img src="images/profile_img_8.png" height="50px" width="50px" style="vertical-align: middle;" class="profile-img">
                        <a class="btn btn-primary" onclick="">Save Changes</a>
                    </div>
                    <div class="profile-button-container">
                        
                    </div>
                </div>
            </div>
        `);
    }
});

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