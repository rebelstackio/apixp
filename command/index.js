#!/usr/bin/env node
'use strict';

const fs = require('fs');

const { Command } = require('commander');
const { Option }  = require('commander');
const Apixp = require('../lib/index.js');

function errheader( header, blockspace = true ) {
	if (blockspace) header = `\n${header}`;
	header += ' :─';
	return header.padEnd(72,'─') + `${new Date().toLocaleTimeString()}─▼`;
}

const program = new Command();
program.version(require('../package.json').version);
program
	.command('watch [apixpdocpath]')
	.alias('w')
	.option('-s, --stub', 'stub procedural elements referenced in apixp doc that are not already created' )
	.option('-p, --validate_procedural', 'adds validation of procedural code referenced by apixp doc')
	.description('Validates apixp doc and referenced procedural code', {
		apixpdocpath: "path to apixp file, default is <current_working_directory>/apixp.json"
	})
	.action(( apixpdocpath, options ) => {
		apixpdocpath = apixpdocpath ? apixpdocpath : 'apixp.json';
		options = { apixpdocpath, ...options };
		debugger;
		let apixp = new Apixp( options );
		try {
			let watcher = apixp.watch();
			watcher.on('change', function ( path ) {
				try {
					let validate = apixp.validateApixpdoc();
					if ( validate.errors ) {
						console.error( errheader(`Validation Errors: ${apixpdocpath}`) );
						console.error( validate.errors );
						//console.error(validate.errors);
					}
				} catch ( e ) {
					console.error(e);
					if ( e instanceof SyntaxError ) {
						console.error( errheader(`Syntax Error: ${apixpdocpath}`) );
						console.error(e.message);
					} else {
						console.error(e.message);
						console.error(e);
						process.exit(e.errno);	
					}
				}
			});
			watcher.on('error', function( error ) {
				console.error(`watcher error:`,error);
				process.exit( error.errno || -1 );
			});
		} catch ( e ) {
		console.error(e.message)
		process.exit(e.errno);	
		}
	});

program.parse(process.argv);
