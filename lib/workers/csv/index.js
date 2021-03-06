//
// Kurunt CSV Worker
//
// Comma Separated Values 'worker' for Kurunt, processing tuple data.
// Version: 0.2
// Author: Mark W. B. Ashcroft (mark [at] kurunt [dot] com)
// License: MIT or Apache 2.0.
//
// Copyright (c) 2013-2014 Mark W. B. Ashcroft.
// Copyright (c) 2013-2014 Kurunt.
//


// must export 'work' module.
module.exports.work = function (message, wk, fn, callback) {

  // 'message.message' Format: tuple
  // Sample: "hello, world"
  //
  // See: http://docs.kurunt.com/CSV_Worker

  fn.logging.log('csv@workers> MESSAGE: ', message);

  // NOTE: has no header handling, only values.

  // use try catch so can skip over invalid messages.
  try {
  
    // (1) convert the incoming message.message from buffer to string (text).
    var string = message.message.toString(wk['config']['encoding']);    // "hello world" or whatever sent.
    
    // (2) extract message comma seperated values into a javascript array using 'split' function.
    var message_array = string.split(',');              // convert message to array.
    
    // (3) new array for trimed 'tuple' items.
    var tuples = [];
    for ( var t in message_array ) {
      tuples.push( message_array[t].trim() );                     // cleanup and remove whitespaces, add each item 'tuple' and push into new array.
    }      
    
    // (4) add tuples value to this attribute, which get's added to this messages: stores: schema.
    var attributes = [];
    attributes['tuples'] = tuples;

    // (5) return processed message (required) and attributes (optional, set manually within message otherwise) back to kurunt.
    return callback( [ message, attributes ] );
  
  } catch(e) {
    fn.logging.log('csv@workers> ERROR: ', e);
    return callback( false );
  }

};


var config = {
	"name": "csv",
	"title": "CSV",	
	"description": "Comma Separated Values, for processing tuple data.",
	"icon": "",
	"url": "http://docs.kurunt.com/CSV_Worker",
	"version": 0.2,	
	"date_mod": "10/22/2013",
	"inputs": [ "tcp", "udp", "http" ],
	"reports": [ "stream" ],
	"encoding": "utf8",
	"stores": [
		{
			"stream": {
				"schema": {
					"tuples": { }
				}
			}
		},
		{
			"mongo": {
				"schema": {
					"tuples": { }
				}
			}
		},
		{
			"redis": {
				"schema": {
					"tuples": { }		
				}
			}
		},
		{
			"mysql": {
				"schema": {
					"tuples": { "type": "varchar(512)" }
				}
			}
		}
	]
};
exports.config = config;		// must export the config so kurunt can read it.
