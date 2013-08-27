
/* Services */

function sessionInfo() {
    this.session_id = null;
    this.user = null;
    this.logged_in = false;
    this.logged_out = true;
}
sessionInfo.prototype.enscope = function(socket, storage, scope, $route, $location, ctrl){
    self = this;
    scope.session = self;
    scope.log_out = function(){
        self.log_out(socket, storage, function(){
            scope.$apply();
            //$route.reload();
        });
    };
    scope.log_in = function(){
        self.log_in(socket, storage, scope.log_in_email, scope.log_in_password, function(){
            $location.path('/user/'+self.user._id);
            scope.$apply();
        });
    };
    scope.sign_up = function(){
        self.sign_up(socket, storage, scope.sign_up_email, scope.sign_up_password, scope.sign_up_password_confirmation, function(){
            $location.path('/user/'+self.user._id);
            scope.$apply();
        });
    };
};
sessionInfo.prototype.create_new_session = function(socket, storage, callback) {
    console.log('creating session');
    self = this;
    socket.emit('new session', {});
    socket.removeListener('new session');
    socket.once('new session', function(data) {
        self.session_id = data;
        storage.sr_session = JSON.stringify(self);
        console.log('created session');
        return callback();
    });
};
sessionInfo.prototype.log_out = function(socket, storage, callback) {
    this.user = null;
    this.logged_out = true;
    this.logged_in = false;
    // TODO: someday, let's make this clear the user part of the
    // session in the db rather than making a new session.
    this.create_new_session(socket, storage, callback);
};
sessionInfo.prototype.log_in = function(socket, storage, email, password, callback) {
    self = this;
    socket.emit('log in', {session_id:self.session_id,
                           email:email,
                           password:password});
    socket.once('log on success', function(data) {
        self.user = User.from_object(data);
        this.logged_in = true;
        this.logged_out = false;
        storage.sr_session = JSON.stringify(self);
        console.log('logged in');
    });
    return callback();
};
sessionInfo.prototype.sync = function(socket, storage, callback) {
    console.log('syncing');
    var obj = storage.sr_session;
    if(obj) {
        obj = JSON.parse(obj);
    }
    if(obj) {
        this.session_id = obj.session_id;
        this.user = obj.user;
        return callback();
    } else {
        this.create_new_session(socket, storage, callback);
    }
};
sessionInfo.prototype.sign_up = function(socket, storage, email, password, password_confirmation, callback){
    self = this;
    console.log('signing up');
    socket.emit('new user', {session_id:self.session_id,
                             email:email,
                             password:password,
                             password_confirmation:password_confirmation});
    socket.once('user created', function(data){
        self.user = User.from_object(data);
        this.logged_in = true;
        this.logged_out = false;
        storage.sr_session = JSON.stringify(self);
        console.log('user created, logged in');
        return callback();
    });
};

var defaultSessionInfo = new sessionInfo();

var defaultSocket = null;
function getDefaultSocket(){
    if(defaultSocket) { return defaultSocket; }
    console.log('creating socket.io socket');
    var sock = io.connect('http://localhost:8080');
    sock.on('error', function(data){
        console.log("error: " + JSON.stringify(data));
    });
    defaultSocket = sock;
    return sock;
}


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1').
    factory('socket', getDefaultSocket).
    value('localStorage', localStorage).
    value('session', defaultSessionInfo);
