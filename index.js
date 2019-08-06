const express = require('express'),
app = express(),
server = require('http').createServer(app),
io=require('socket.io').listen(server);
username = [];
server.listen(process.env.PORT || 3000);
console.log('Server Running....');

app.get('/',function(req , res)
{
	res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection' , function(socket){
	console.log('Socket Connected.....');
	socket.on('new user' , async function(data)
	{
		let result = await username.indexOf(data);
		if(!result)
		{
			console.log("already a user");
		}    
		else
		{
			socket.username = data;
			username.push(socket.username);
			updateUsernames();
		}
    });

    function updateUsernames()
    {
    	io.emit('usernames' , username);
    }
	socket.on('send message', function(data)
	{
		io.sockets.emit('new message',{msg : data , user: socket.user});
	});

	socket.on('disconnect', function(data)
	{
		if(!socket.username){
			return;
		}

		username.splice(username.indexOf(socket.username) , 1);
		updateUsernames();
	});
});