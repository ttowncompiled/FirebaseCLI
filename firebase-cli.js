var firebase = require('firebase');
var fs = require('fs');

var COMMAND = 'command';
var CONFIG = 'config';
var DATA = 'data';
var EQUAL = '=';
var HELP = '-h';
var PUSH = 'push';
var REF = 'ref';
var UTF8 = 'utf8';

function preprocess() {
  var args = process.argv.slice(2);
  if (args[0] == HELP) {
    console.log('commands:');
    console.log('\tpush ref=<path-from-root-of-firebase> data=<path-to-data>');
    process.exit();
  }
  if (args.length < 2) {
    console.error('usage: node firebase-cli.js config=<path-to-config> <command>');
    console.error('for a list of commands: node firebase-cli.js -h');
    process.exit(1);
  }
  var params = {};
  args.forEach(function(arg) {
    if (arg.includes(EQUAL)) {
      var parts = arg.split(EQUAL);
      params[parts[0]] = parts[1];
    } else if (!(COMMAND in params)) {
      params[COMMAND] = arg;
    } else {
      console.error('ERROR: can not handle more than one command');
      process.exit(1);
    }
  });
  if (!(CONFIG in params)) {
    console.error('ERROR: Firebase configuration file must be provided');
    process.exit(1);
  }
  if (!(COMMAND in params)) {
    console.error('for a list of commands: node firebase-cli.js -h');
    process.exit(1);
  }
  return params;
}

function configureFirebase(configFilePath) {
  var config = JSON.parse(fs.readFileSync(configFilePath, UTF8));
  return firebase.initializeApp(config);
}

function push(fb, ref, dataFilePath) {
  var data = JSON.parse(fs.readFileSync(dataFilePath, UTF8));
  var db = fb.database().ref(ref);
  data.forEach(function(item) {
    db.push(item);
  });
}

function main(params) {
  var fb = configureFirebase(params[CONFIG]);
  if (params[COMMAND] == PUSH) {
    push(fb, params[REF], params[DATA]);
  }
}

main(preprocess());
