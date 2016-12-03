var fs = require('fs');

var s =fs.lstatSync(__dirname+'/package.json');
console.log(s.isDirectory());