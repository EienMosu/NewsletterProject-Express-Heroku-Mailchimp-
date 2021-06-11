const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/singup.html");
});


app.post("/", function(req, res) {
    const url = "your_mailchimp_url";
    const options = {
        method: "POST",
        auth: "name: your_mailchimp_api"
    };

    const firstName = req.body.fname
    const lastName = req.body.lname
    const email = req.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }   else {
            res.sendFile(__dirname + "/failure.html")
        };

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res) {
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is alive!")
});
