
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { hasSubscribers } = require("diagnostics_channel");
const PORT = process.env.PORT || 1995;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname + ("/signup.html"));
})

app.post("/", function(req, res) {

    const FirstName = req.body.FName;
    const LastName = req.body.LName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/6d173e2b0d";

    const options = {
        method: "POST",
        auth: "Julcoded:9e8b693d2548c6bb31d33efc1b609379-us10"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + ("/success.html")); 
        } else {
            res.sendFile(__dirname + ("/failure.html"));
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure.html", function(req,res) {
    res.redirect("/");
})


app.listen(PORT, () => {
    console.log("server started on port ${PORT}");
});