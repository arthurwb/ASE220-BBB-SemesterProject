//id of the jsonBlob page
const documentID = '1082748833116733440';

//gets id
const id = getAllUrlParams().id;

//appends data to post page
api.GET(documentID, function(response) {  
    for (i = 0; i < response.data.length; i++) {
        if (id == response.data[i].id) {
            document.getElementById("title").innerText = response.data[i].title;
            document.getElementById("posted").innerText = `Posted by ${response.data[i].username} at ${response.data[i].timestamp}`
            document.getElementById("song").innerText = `Song - ${response.data[i].song}`;
            document.getElementById("artist").innerText = `Artist - ${response.data[i].artist}`;
            document.getElementById("album").innerText = `Album - ${response.data[i].album}`;
            document.getElementById("rating").innerText = `Rating - ${response.data[i].rating} out of 10`;
            document.getElementById("review").innerText = `Review - ${response.data[i].review}`;
        }
    }
});