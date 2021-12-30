
//MODEL

require('../scrapperBackend');
const mongoose = require('mongoose')
const Recent = require('./recent')
const API_KEY='mongodb+srv://Vasuvj24:mediumscrapper@recent.sgsv7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(API_KEY, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log("developed connection");
    }).catch(Error => {
        console.log(Error);
    }
    )
const sendData = async(data)=>{
    recentSearch = new Recent({
        recent:`${data}`
    })
    await recentSearch.save()
    .then((res)=>{console.log("saved data "+res)})
    .catch((err)=>{console.log("error in saving data "+err)})
}
const getData = async()=>{
    console.log("inside get data");
    await Recent.find()
    .then(res=>{return res;})
    .catch(err=>console.log("error in getting data "+err))
}
module.exports = {sendData,getData};