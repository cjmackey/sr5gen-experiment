
process.on('uncaughtException', function(err) {
    console.log(err);
    console.log(err.stack);
    process.exit(1);
});

function main() {
    console.log('*** starting server! ***');
    async.series([
        function(callback) {
            MongoClient.connect('mongodb://127.0.0.1:27017/sr', function(err, db) {
                if(err) { return callback(err, null); }
                user_collection = db.collection('user');
                session_collection = db.collection('session');
                character_collection = db.collection('character');
                return callback(null, null);
            });
        },
        function(callback) {
            npid.create('./logs/server/server.pid');
            return callback(null, null);
        },
        function(callback) {
            io = socket_io.listen(8081);
            /*
              io.set('transports', [
              'websocket'
              , 'flashsocket'
              , 'htmlfile'
              , 'xhr-polling'
              , 'jsonp-polling'
              ]);
            */
            io.set('transports', ['websocket']);
            
            io.sockets.on('connection', function (socket) {
                socket.emit('news', { hello: 'world' });
                socket.on('my other event', function (data) {
                    console.log(data);
                });
                socket.on('new session', function() {
                    crypto.randomBytes(48, function(err, buf) {
                        if(err) { return socket.emit('error', err); }
                        var token = buf.toString('hex');
                        session_collection.insert({session_id : token}, {safe:true}, function(err, objs) {
                            if(err) { return socket.emit('error', err); }
                            socket.emit('new session', token);
                        });
                    });
                });
                socket.on('log in', function(data) {
                    if(!data.session_id) { return socket.emit('error', 'need session id!'); }
                    if(!data.email) { return socket.emit('error', 'need email!'); }
                    if(!data.password) { return socket.emit('error', 'need password!'); }
                    user_collection.find({email:data.email}).toArray(function(err, arr) {
                        if(err) { return socket.emit('error'); }
                        if(arr.length < 1) {
                            return socket.emit('error', 'no user with that email');
                        }
                        user = arr[0];
                        bcrypt.compare(data.password, user.password_hash, function(err, result){
                            if(!result) {
                                return socket.emit('log on failure');
                            }
                            session_collection.update({session_id : data.session_id},
                                                      {$set:{email:data.email}},
                                                      {safe:true},
                                                      function(err) {
                                                          if(err) { return socket.emit('error', err); }
                                                          socket.emit('log on success',
                                                                      User.from_object(user).to_object());
                                                      });
                        });
                    });
                });
                socket.on('new user', function(data) {
                    console.log('creating new user?');
                    console.log(data);
                    if(!data.email) { return socket.emit('error', 'need email!'); }
                    if(!data.password) { return socket.emit('error', 'need password!'); }
                    if(!data.password_confirmation) { return socket.emit('error', 'need password confirmation!'); }
                    if(data.password !== data.password_confirmation){ return socket.emit('error','pass no match'); }
                    user_collection.find({email:data.email}).toArray(function(err, arr) {
                        if(err) { return socket.emit('error'); }
                        if(arr.length > 0) {
                            return socket.emit('error', 'already had that email');
                        }
                        bcrypt.hash(data.password, null, function(err, hash) {
                            user_collection.insert({email:data.email, password_hash:hash},
                                                   {safe:true},function(err, objs){
                                                       var user = objs[0];
                                                       socket.emit('user created',
                                                                   User.from_object(user).to_object());
                                                   });
                        });
                    });
                });
            });
            
            return callback(null, null);
        }
    ]);
}

main();