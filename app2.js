var multer = require('multer');
var express = require('express');
var app = express();
var path = 

app.use('/', express.static('public'));


app.get('/api/filesDirs',function(req,res){

    
    res.json(
        {
            files:['app.exe','qq.jpg'],
            folders:['123','qqDir']
        }

        );
});

app.post('/api/upload',function(req,res){

});



app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});


var port = 8080;

app.listen(port,function(){
    console.log('listening to '+ port);
});
