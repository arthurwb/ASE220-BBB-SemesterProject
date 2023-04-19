var fs=require('fs');
const path = require('path');

const httpRequest = {
    GET: function(URLpath, client) {
        console.log("<GET>");
        const collection = client.db("testDB").collection(URLpath);
        return collection.find({}).toString();
        // if (fs.existsSync(path.join(__dirname, './data', `${URLpath}.json`))) {
        //     jsonFile = fs.readFileSync(path.join(__dirname, './data', `${URLpath}.json`)).toString();
        //     return jsonFile;
        // } else {
        //     // Send a response to the client
        //     return JSON.stringify({success: false, error: 'Resource not found'});
        // }
    },
    PUT: function(req, URLpath, callback) {
        console.log("<PUT>");

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let response;
            try {
                const putData = JSON.parse(body);
                if (fs.existsSync(path.join(__dirname, './data', `${URLpath}.json`))) {
                    fs.writeFileSync(path.join(__dirname, './data', `${URLpath}.json`), JSON.stringify(putData));
                    response = fs.readFileSync(path.join(__dirname, './data', `${URLpath}.json`)).toString();
                }
                else {
                    response = JSON.stringify({success: false, error: 'Resource not found'});
                }
            } catch (error) {
                response = JSON.stringify({success: false, error: 'PUT error'});
            }
            callback(response);
        });
    },    
    POST: function(req, callback) {
        console.log('<POST>');
        let body = '';
        req.on('data', (chunk) => {
            if (chunk) {
                body += chunk.toString();
            }
        });
        req.on('end', () => {
            let response;
            console.log(JSON.stringify(JSON.parse(body)));
            try {
                const data = JSON.parse(body);
                    
                let newId = Math.floor(1000000 + Math.random() * 9000000);
                while (fs.existsSync(path.join(__dirname, './data', `${newId}.json`))) {
                    newId = newId + 1;
                }

                fs.writeFileSync(path.join(__dirname, './data', `${newId}.json`), JSON.stringify(data));

                response = fs.readFileSync(path.join(__dirname, './data', `${newId}.json`)).toString();
            } catch (error) {
                response = JSON.stringify({success: false, error: 'POST error'});
            }
            callback(response);
        });
    },
    DELETE: function(URLpath, res) {
        console.log("<DELETE>");
        // Check if the JSON file exists
        if (fs.existsSync(__dirname, './data', `${URLpath}.json`)) {
            // Delete the JSON file
            fs.unlinkSync(__dirname, './data', `${URLpath}.json`);

            // Send a response to the client
            return JSON.stringify({success: true, message: `${URLpath} has been deleted`});
        } else {
            // Send a response to the client
            return JSON.stringify({success: false, error: 'Resource not found'});
        }
    }
}


module.exports = {
    httpRequest: httpRequest
}
  