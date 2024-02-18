const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const Msg = require('./models/Msg.js');
require('dotenv').config()

const dbUrl = process.env.ATLASTDB_URL;

//Estabishing Moongose Connection
main().then(() => {
    console.log("Connection Successfull...");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


let message = "";
let readMsgNumber = 0;
let leftMsgNumber = 0;




const getData = async () => {
    let allMsgs = await Msg.find({});
    let readMsgs = await Msg.find({ read: true });
    readMsgNumber = readMsgs.length;
    leftMsgNumber = allMsgs.length - readMsgNumber;
}


getData();



app.get('/', (req, res) => {
    res.render('index', { message, readMsgNumber, leftMsgNumber });
})


app.get('/msg', async (req, res) => {
    let newMessage = await Msg.findOne({ read: false });

    if (!newMessage) {
        message = "You Read All Messages"
    } else {
        message = newMessage.msg;
        newMessage.read = true;
        await newMessage.save();
        readMsgNumber++;
        leftMsgNumber--;
    }
    res.redirect('/')
})

app.get('/allmsg', async (req, res) => {
    let allMsg = await Msg.find({ read: true });

    if (!allMsg) {
        allMsg = "";
    }

    res.render('allmsg', { allMsg })
})

app.listen(8080, () => {
    console.log('Listening in port 8080');
})

