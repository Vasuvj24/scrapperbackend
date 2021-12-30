
//CONTROLLER

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('./model/model')
const Recent = require('./model/recent')
// const mongoose = require('mongoose')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');
const { json } = require('express/lib/response');
const { sendData } = require('./model/model');
// const { empty } = require('cheerio/lib/api/manipulation');
let links = [];
let title = [];
let creator = [];
let tags = [];
let upload = [];
let time = [];
let blog = [];
let rtab = [];
var port_number = process.env.PORT || 3000;
app.listen(port_number);
app.use(
    cors({
        origin: "*",
        credentials: true,            
        optionSuccessStatus: 200,
    })
)
let data;
app.get('/', (req, res) => {
    res.send("move to different links for the data try")
})
app.post('/sendData', jsonParser, async (req, res) => {
    data = req.body.data;
    res.send(console.log("successfully got the data " + req.body.data)).status(200)
})
app.get('/x', jsonParser, (req, res) => {
    console.log("inside get request " + data);
    request(`https://medium.com/tag/${data}/latest`, async (err, resi, html) => {
        console.log("inside request " + data);
        await sendData(data).then(res => console.log("succesfully sent data " + res)).catch(err=>console.log("error in saving data "+err))
        await Recent.find().then(res=>rtab=res).catch(err=>console.log('error in getting data '+err))
        console.log("recents " + rtab)
        if (!err && res.statusCode === 200) {
            let $ = cheerio.load(html);

            $('a').each((i, el) => {

                if ($(el).attr().class != undefined && $(el).attr().class.length == 44 && $(el).children().length == 1 && $(el).children().children().length == 2) {
                    links.push($(el).attr('href')); 
                    // console.log($(el).children().length);
                }
            });

            $('h2').each((i, el) => {
                if (i < 10) title.push($(el).text());
            });

            $('h4').each((i, el) => {
                if ($(el).attr().class != undefined && $(el).attr().class.length == 38) creator.push($(el).text());
            });

            $('a').each((i, el) => {
                if ($(el).attr().class != undefined && $(el).attr().class.length == 2 && $(el).children().length == 1 && tags.includes($(el).text()) == false) { tags.push($(el).text()); }
            });

            $('p').each((i, el) => {
                let temp = $(el).text();
                //console.log($(el).attr().class.length,"  ",$(el).text());
                if ($(el).attr().class.length == 34) upload.push(temp);
            });

            $('span').each((i, el) => {
                let temp = $(el).text();

                if ($(el).attr().class != undefined && $(el).attr().class.length == 13 && temp.length > 1) time.push(temp);
            });

            $('h3').each((i, el) => {
                if (i >= 1 && i <= 10) blog.push($(el).text());
            });
        } else {
            console.log("error is here");
        }
        let obj = {
            "links": links,
            "title": title,
            "creator": creator,
            "tags": tags,
            "upload": upload,
            "time": time,
            "blog": blog,
            "rtab": rtab
        };
        links = [];
        title = [];
        creator = [];
        tags = [];
        upload = [];
        time = [];
        blog = [];
        rtab = [];
        res.send(obj).status(200);
    })
})