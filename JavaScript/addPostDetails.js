//id of the jsonBlob page
const documentID = '1082748833116733440';

//gets id
const id = getAllUrlParams().id;

//appends data to post page
api.GET(documentID, function(response) {  
    for (i = 0; i < response.data.length; i++) {
        if (id == response.data[i].id) {
            var post = response.data[i];
            document.getElementById("title").innerText = post[i].title;
            document.getElementById("posted").innerText = `Posted by ${post.username} at ${post.timestamp}`
            document.getElementById("song").innerText = `Song - ${post.song}`;
            document.getElementById("artist").innerText = `Artist - ${post.artist}`;
            document.getElementById("album").innerText = `Album - ${post.album}`;
            document.getElementById("rating").innerText = `Rating - ${post.rating} out of 10`;
            document.getElementById("review").innerText = `Review - ${post.review}`;
        }
    }
});