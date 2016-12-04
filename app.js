var multer = require('multer');
var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var rootPath;
process.argv.forEach(function (val, index, array) {
  if(index==2)
    rootPath = val;
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

  next();
});

app.use(bodyParser.urlencoded({

    extended: true

}));

app.use('/', express.static('public'));


app.use('/static',express.static(rootPath));


app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/api/filesDirs',function(req,res){

    var p = req.query.path;
    if(!p)
        p = rootPath;

   
    var stats = fs.lstatSync(p);
    if(stats.isDirectory()){
        fs.readdir(p, (err, files) => {
            var fileArr = [];
            var folderArr = [];
            files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
            files.forEach(file => {
                try{
                    var filePath = path.join(p,file);
                    stats = fs.lstatSync(filePath);
                    if(stats.isFile()){
                        fileArr.push(filePath);
                    }
                    if(stats.isDirectory()){
                        folderArr.push(filePath);
                    }
                }catch(err){
                
                }
            });
            
            res.json(
                {
                    rootPath:rootPath,
                    files:fileArr,
                    folders:folderArr
                }
            );
        });
    }
});

app.post('/upload', function (req, res) {
    var uploadPath = req.query.path
	var limits = {
		fileSize: 300 * 1024 * 1024
	}; // 0.5MB

	var options = multer.diskStorage({
		destination: uploadPath,
		filename: function (req, file, cb) {
            if( fs.existsSync(uploadPath+'\\'+file.originalname) ) {
                req.err = 'The file exists';
            }
			cb(null, file.originalname);
		}
	});

	var upload = multer({
		        storage: options,
		        limits: limits
	            }).single('pic'); // single('這個字串要和前端fileupload input的name屬性一樣')
	upload(req, res, function (err) {
		if (err) {
			res.status(500).send('File too large!!');
			return;
		}

        if(req.err){
            res.status(500).send(req.err);
            console.log('files exists 222 ');
            return;
        }

		res.end('You new avatar is uploaded');
			// Everything went fine
	});
});

app.get('/',function(req,res){
    res.send('yo');
});



app.delete('/delete',function(req,res){
    var deletePath = req.body.path;
   // console.log(deletePath);
    if(fs.lstatSync(deletePath).isDirectory()){
        var deleteFolderRecursive = function(p) {
            if( fs.existsSync(p) ) {
                fs.readdirSync(p).forEach(function(file,index){
                var curPath = path.join(p,file);
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
                });
                fs.rmdirSync(p);
            }
        };
        try{
            deleteFolderRecursive(deletePath);
            res.send('Delete Success');
        }catch(err){
            res.send(err);
        }
        
    }else{
        fs.unlink(deletePath,function(err){
            if(err)
                {
                console.log('||||||||||||||||||||||||||||||||||||||||||');
                res.send(err);
                }
            else
                res.send('Delete Success');
        })
    }
});

// app.delete('/delete',function(req,res){
//     var deletePath = req.body.path;
//    // console.log(deletePath);
//     if(fs.lstatSync(deletePath).isDirectory()){
//         var deleteFolderRecursive = function(path) {
//             console.log(path);
//             if( fs.existsSync(path) ) {
//                 fs.readdirSync(path).forEach(function(file,index){
//                 var curPath = path + "/" + file;
//                 if(fs.lstatSync(curPath).isDirectory()) { // recurse
//                     deleteFolderRecursive(curPath);
//                 } else { // delete file
//                     fs.unlinkSync(curPath);
//                 }
//                 });
//                 fs.rmdirSync(path);
//             }
//         };
//         try{
//             deleteFolderRecursive(deletePath);
//             res.send('Delete Success');
//         }catch(err){
//             res.send(err);
//         }
        
//     }else{
//         fs.unlink(deletePath,function(err){
//             if(err)
//                 {
//                 console.log('||||||||||||||||||||||||||||||||||||||||||');
//                 res.send(err);
//                 }
//             else
//                 res.send('Delete Success');
//         })
//     }
// });


var port = 8080;

app.listen(port,function(){
    console.log('listening to '+ port);
});