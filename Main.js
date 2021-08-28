const express = require("express");
const app = express();
const {MongoClient} = require('mongodb');
const cors = require('cors');
const fs = require('fs')





async function GetDB(collection, query){
    const uri = "mongodb+srv://Tituse:Theo76160@cluster0.lj1ma.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        const collec = await client.db("Karmine").collection(collection);
        return await collec.find(query).toArray()
    }finally {
        await client.close();
    }
};


async function GetDBOption(collection, query, limit){
    const uri = "mongodb+srv://Tituse:Theo76160@cluster0.lj1ma.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        const collec = await client.db("Karmine").collection(collection);
        return await collec.find(query).sort({Date : -1}).limit(limit).toArray()
    } finally {
        await client.close();
    }
};

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors());

const path = __dirname + '/views/build/';

app.use(express.static(path));

app.use('/static', express.static(__dirname + '../views/build//static'));

app.get('/Image/:section/:name', (req, res)=>{
    if (fs.existsSync(`./Data/${req.params.section}/${req.params.name}.png`)){
        res.sendFile(`./Data/${req.params.section}/${req.params.name}.png`, { root: __dirname });
    }
    // else{

    // }
});

app.get('/Data/Shop/', (req, res)=>{
    GetDB("Shop")
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Main/Main', (req, res)=>{
    GetDB("Main")
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Match/Main/Past', (req, res)=>{
    GetDBOption("Match", {Date : {"$lt" : new Date()}}, 10)
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Match/Main/PastHistorie', (req, res)=>{
    GetDBOption("Match", {Date : {"$lt" : new Date()}}, 0)
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Match/Main/Future', (req, res)=>{
    GetDBOption("FutureMatch", {Date : {"$gte" : new Date()}},0)
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/About', (req, res)=>{
    GetDB("About")
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Team/LineUp/:Game', (req, res)=>{
    GetDB("TeamLineUp", {Game : req.params.Game.replace('_', ' ')})
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('/Data/Team/:Player', (req, res)=>{
    GetDB("Team", {Pseudo : req.params.Player})
    .then((response)=> res.send(response))
    .catch((err)=> console.log(err))
});

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path});
})

app.listen(8080);