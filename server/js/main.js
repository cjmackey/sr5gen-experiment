
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
                socket.on('new character', function(input){
                    console.log(input);
                    function respond(err, data){
                        console.log([err, data]);
                        socket.emit('new character response', err, data);
                    }
                    session_collection.find({session_id:input.session_id}).toArray(function(err, arr){
                        if(err) { return respond(err); }
                        if(arr.length < 1) { return respond('no such session!?'); }
                        var user_id = arr[0].user_id;
                        if(!user_id) { return respond('no user id on this session'); }
                        var character = new Character();
                        character.user_id = user_id;
                        character.name = input.name;
                        var obj = character.to_object();
                        delete obj._id;
                        character_collection.insert(obj, {safe:true}, function(err, objs){
                            if(err) { return respond(err); }
                            respond(null, objs[0]._id);
                        });
                    });
                });
                socket.on('save character', function(obj){
                    console.log('saving a character');
                    console.log(obj);
                    function respond(err, data){
                        console.log([err, data]);
                        socket.emit('save character result', err, data);
                    }
                    var character = JSON.parse(obj.character);
                    var session_id = obj.session_id;
                    var session;
                    var user_id;
                    async.series([
                        function(cbk){
                            session_collection.find({session_id:session_id}).toArray(function(err, arr){
                                if(err) { return respond(err); }
                                if(arr.length < 1) { return respond('no such session'); }
                                session = arr[0];
                                user_id = session.user_id;
                                if(!user_id) { return respond('no user id on this session'); }
                                cbk();
                            });
                        },
                        function(cbk){
                            var c = character;
                            var filter = {user_id : user_id, _id : new ObjectID(c._id)};
                            delete c.user_id;
                            delete c._id;
                            cleanse_object(c);
                            var mod = {$set:c};
                            console.log(JSON.stringify(filter));
                            console.log(JSON.stringify(mod));
                            character_collection.findAndModify(filter, [['_id','asc']], mod, {safe:true}, function(err, object){
                                if(err) { return respond(err); }
                                if(!object) { return respond('no object altered :/'); }
                                respond(null);
                            });
                        }
                    ]);
                });
                socket.on('show character', function(c_id){
                    console.log(c_id);
                    function respond(err, c){
                        console.log([err, c]);
                        socket.emit('show character result', err, c);
                    }
                    character_collection.find({_id:new ObjectID(c_id)}).toArray(function(err, arr){
                        if(err) { return respond(err); }
                        if(arr.length < 1) { return respond(null, null); }
                        var data = arr[0];
                        console.log(data);
                        respond(null, data);
                    });
                });
                socket.on('show user', function(user_id){
                    console.log(user_id);
                    function respond(err, user){
                        console.log([err, user]);
                        socket.emit('show user result', [err, user]);
                    }
                    user_collection.find({_id:new ObjectID(user_id)}).toArray(function(err, arr){
                        if(err) { return respond(err); }
                        if(arr.length < 1) { return respond(null, null); }
                        var data = {};
                        data.name = arr[0].name;
                        data._id = arr[0]._id;
                        data.characters = []; // <- TODO
                        console.log(data);
                        respond(null, data);
                    });
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
                    function log_in_fail(err) {
                        console.log(err);
                        socket.emit('log on result', [err, null]);
                    }
                    function log_in_success(user) {
                        console.log(user);
                        socket.emit('log on result', [null, User.from_object(user).to_object()]);
                    }
                    if(!data.session_id) { return log_in_fail('need session id!'); }
                    if(!data.email) { return log_in_fail('need email!'); }
                    if(!data.password) { return log_in_fail('need password!'); }
                    user_collection.find({email:data.email}).toArray(function(err, arr) {
                        if(err) { return log_in_fail('db lookup fail'); }
                        if(arr.length < 1) {
                            return log_in_fail('no user with that email');
                        }
                        var user = arr[0];
                        console.log('log in attempt');
                        console.log(user);
                        console.log(data.password);
                        console.log(user.password_hash);
                        bcrypt.compare(data.password, user.password_hash, function(err, result){
                            console.log(result);
                            if(!result) {
                                return log_in_fail('bad password');
                            }
                            console.log('log in success');
                            console.log(user);
                            session_collection.update({session_id : data.session_id},
                                                      {$set:{email:user.email,
                                                             user_id:user._id}},
                                                      {safe:true},
                                                      function(err) {
                                                          if(err) { return log_in_fail('db update fail'); }
                                                          log_in_success(user);
                                                      });
                        });
                    });
                });
                socket.on('new user', function(data) {
                    console.log('creating new user?');
                    if(!data.email) { return socket.emit('error', 'need email!'); }
                    if(!data.password) { return socket.emit('error', 'need password!'); }
                    if(!data.password_confirmation) { return socket.emit('error', 'need password confirmation!'); }
                    if(data.password !== data.password_confirmation){ return socket.emit('error','pass no match'); }
                    user_collection.find({email:data.email}).toArray(function(err, arr) {
                        if(err) { return socket.emit('error'); }
                        if(arr.length > 0) {
                            return socket.emit('error', 'already had that email');
                        }
                        bcrypt.genSalt(function(err, salt){
                            if(err) { return console.log(err); }
                            console.log(salt);
                            bcrypt.hash(data.password, salt, function(err, hash) {
                                if(err) { return console.log(err); }
                                var udata = {email:data.email, name:data.name, password_hash:hash};
                                console.log(udata);
                                user_collection.insert(udata,{safe:true},function(err, objs){
                                    var user = objs[0];
                                    session_collection.update({session_id : data.session_id},
                                                              {$set:{email:user.email,
                                                                     user_id:new ObjectID(user._id)}},
                                                              {safe:true},
                                                              function(err) {
                                                                  socket.emit('user created',
                                                                              User.from_object(user).to_object());
                                                              });
                                });
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