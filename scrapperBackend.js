const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');
const { json } = require('express/lib/response');
let links = [];
let title = [];
let creator = []; 
let tags = [];
let upload = [];
let time = [];
let blog = [];
app.listen(3001);
app.use(
    cors({
        origin:"*"
    })
)
let data;
app.post('/sendData',jsonParser,async(req,res)=>{
    data=req.body.data;
    res.send(console.log("successfully got the data "+req.body.data)).status(200)
})
app.get('/getData',jsonParser,(req, res) => {
    console.log("inside get request "+ data);
    request(`https://medium.com/tag/python/latest`, (err, res, html) => {
        console.log("inside request "+data)
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
        }else{
            console.log("error is here");
        }
    })
    let obj = {
        "links": links,
        "title": title,
        "creator": creator,
        "tags": tags,
        "upload": upload,
        "time": time,
        "blog": blog
    };
    links=[];
    title=[];
    creator=[];
    tags=[];
    upload=[];
    time=[];
    blog=[];
    res.send(obj).status(200)
})