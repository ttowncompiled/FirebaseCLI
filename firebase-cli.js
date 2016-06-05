var firebase = require('firebase');
var fs = require('fs');

function preprocess() {
  var args = process.argv.slice(2);
  if (args[0] == '-h') {
    console.log('no commands currently');
    process.exit();
  }
  if (args.length < 2) {
    console.log('usage: node firebase-cli.js config=<path-to-config> <command>');
    console.log('for a list of commands: node firebase-cli.js -h');
    process.exit(1);
  }
  var params = {};
  args.forEach(function(arg) {
    if (arg.includes('=')) {
      var parts = arg.split('=');
      params[parts[0]] = parts[1];
    } else if (!('command' in params)) {
      params['command'] = arg;
    } else {
      console.log('ERROR: can not handle more than one command');
      process.exit(1);
    }
  });
  if (!('config' in params)) {
    console.log('ERROR: Firebase configuration file must be provided');
    process.exit(1);
  }
  if (!('command' in params)) {
    console.log('for a list of commands: node firebase-cli.js -h');
    process.exit(1);
  }
  return params;
}

function main(params) {
  console.log(params);
}

main(preprocess());
