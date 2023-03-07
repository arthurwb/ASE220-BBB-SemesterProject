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