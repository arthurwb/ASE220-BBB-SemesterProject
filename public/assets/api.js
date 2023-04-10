const api={
	endpoint:'https://jsonblob.com/api/data/',
	GET:function(documentID,callback){
		axios.get(`${api.endpoint}${documentID}`,{}).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	},
	PUT:function(documentID,data,callback){
		axios.put(`${api.endpoint}${documentID}`,data).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	},
	UPDATE: function (documentID, newData, callback) {
  axios.get(`${api.endpoint}${documentID}`)
    .then(function (response) {
      // Get the existing data from the response
      const existingData = Array.isArray(response.data) ? response.data : [];

      // Combine the existing data with the new data
      const combinedData = [...existingData, newData];

      // Update the file with the combined data
      axios.put(`${api.endpoint}${documentID}`, combinedData)
        .then(function (response) {
          callback(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

	  
}