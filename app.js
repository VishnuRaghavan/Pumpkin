const Express = require('express');
const app = Express();
// serving static files
app.use(Express.static('public'));
// app.get('/', function(req, res){
// 	res.sendFile(__dirname + '/index.html');
// });
app.listen(3000, console.log("listening on port 3000"));


