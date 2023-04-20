const mongoRequest = {
    GET: async function(url, client) {
        console.log("<GET>");
        const collection = client.db("testDB").collection(url);
        collection.find({}).toArray(function(err, result){
            if (err) throw err;
            console.log("mongoRequest.GET: "+result);
            return result;
        });
    },
    PUT: function() {

    },
    POST: function() {

    },
    DELETE: function() {

    }
}

module.exports = {
    mongoRequest: mongoRequest
}