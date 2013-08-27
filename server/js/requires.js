var crypto = require('crypto');
var bcrypt = require('bcrypt');
var async = require('async');
var npid = require('npid');

var socket_io = require('socket.io');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var format = util.format;

var user_collection;
var session_collection;
var character_collection;
var io;
