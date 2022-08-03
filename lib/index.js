'use strict';

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const jsonfile = require('jsonfile');

class Apixp {

	static watch ( opts ) {
		let watcher = chokidar.watch (
			opts.apixpdocpath,
			{ awaitWriteFinish:{ stabilityThreshold: 500, pollInterval: 100 } }
		);
		watcher.add([opts.openapischemapath,opts.apixpschemapath,opts.apixpdocpath]);
		return watcher;
	}
	watch () {
		return Apixp.watch( this.options );
	}

	get_apixpdoc () {
		return jsonfile.readFileSync( this.options.apixpdocpath );
	}

	get_apixpschema () {
		return jsonfile.readFileSync( this.options.apixpschemapath );
	}

	get_openapischema () {
		//return jsonfile.readFileSync( this.options.openapischemapath );
		return JSON.parse( fs.readFileSync( this.options.openapischemapath ) );
	}

	static validateApixpdoc ( apixpschema, openapischema, data ) {
		let ajv = new Ajv({ strict: false });
		addFormats(ajv);
		const validate = ajv.addSchema([ openapischema ]).compile(apixpschema);
		console.log(JSON.stringify(validate(data)));
		validate(data);
		return validate;
	}

	validateApixpdoc () {
		return Apixp.validateApixpdoc(
			this.get_apixpschema(),
			this.get_openapischema(),
			this.get_apixpdoc()
		);
	}


	static defaultOptions = {
		openapischemapath: 'lib/openapi.3.1.0.schema.json',
		apixpschemapath: 'lib/apixp.0.0.1.schema.json',
		apixpdocpath: 'apixp.json'
	};
	constructor ( options = defaultOptions ) {
		this.options = { ...Apixp.defaultOptions, ...options };
		this.openapischema = this.get_openapischema();
	}

}

module.exports = Apixp;
