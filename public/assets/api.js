const api={
	endpoint:'http://localhost:8080/api/data/',
	GET:function(documentID,callback){
		axios.get(`${api.endpoint}${documentID}`,{}).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	},
	GET_USER: function(cookie, callback) {
		axios.get(`${api.endpoint}unAuth/${cookie}`,{}).then(function(response){
			callback(response.data);
		}).catch(function(error){
			console.log("axios error" + error);
		});
	},
	GET_ITEM: function(collection, id, callback) {
		axios.get(`${api.endpoint}getitem/${collection}/${id}`,{}).then(function(response){
			callback(response.data);
		}).catch(function(error){
			console.log("axios error" + error);
		});
	},
	PUT:function(documentID, data, id, type){
		if (type == "comment") {
			console.log("PUT: comment");
			axios.put(`${api.endpoint}${documentID}/${id}/${type}`,data).then(function(response){
				console.log(response);
			}).catch(function(error){
				console.log("axios: comment put error: "+error);
			});
		} else if (type == "post") {
			console.log("PUT: post" + JSON.stringify(data));
			axios.put(`${api.endpoint}${documentID}/${id}/${type}`,data).then(function(response){
				console.log(response);
			}).catch(function(error){
				console.log("axios: post put error: "+error);
			});
		} else if (type == "user") {
			console.log("PUT: user");
			axios.put(`${api.endpoint}${documentID}/${id}/${type}`,data).then(function(response){
				console.log(response);
			}).catch(function(error) {
				console.log("axios: user put error: "+error);
			});
		} else {
			console.log("put type error");
		}
	},
	DELETE: function(documentID, data, callback) {
		axios.delete(`${api.endpoint}${documentID}`, { data: data }).then(function(response) {
		  console.log(response);
		  callback(response);
		}).catch(function(error){
		  console.log("axios: post delete error: "+error);
		});
	},
	UPDATE: function (documentID, newData) {
//   axios.get(`${api.endpoint}${documentID}`)
//     .then(function (response) {
//       // Get the existing data from the response
//       const existingData = Array.isArray(response.data) ? response.data : [];

//       // Combine the existing data with the new data
//       const combinedData = [...existingData, newData];

//       // Update the file with the combined data
//       axios.put(`${api.endpoint}${documentID}`, combinedData)
//         .then(function (response) {
//           callback(response);
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
    axios.post(`${api.endpoint}`, newData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}