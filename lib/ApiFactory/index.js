'use strict';

const ajv = require('ajv');
const setPrototypeOf = require('setprototypeof');
const Finally = require('Finally'); // an EventEmitter
const Router = require('Router');

const Defaults = {
	trust_proxy: true,
	etag: 'weak',
	env: process.env.NODE_ENV || 'development',
	attribution: 'apixp'
};

class Apixp {

	constructor ( apixpdoc, logger ) {
		if ( logger ) { console = logger; }
		if ( !apixpdoc ) { /* throw error */ }
		if ( typeof this.apixpdoc === 'string' || this.apixpdoc instanceof String ) {
			// TODO: get openapi doc from filepath ( and store at this.apixpdoc ) or throw
		}
		if ( typeof this.apixpdoc !== 'object' ) { /* throw error */ }
		else { /* validate this.apixpdoc */ }
		this.apixpdoc = Object.assign(Defaults, apixpdoc);
		this.Finally = new Finally( this.apixpdoc, logger );
		this.Router = new Router( this.apixpdoc, this.Finally, logger );
		for ( let path in Object.keys( this.apixpdoc.paths ) ) {
			this.Router.add( path, this.apixpdoc );
		}
	}

	/* Router should have handle - Api calls this.Router.handle() of an incoming request */
	handle ( req, res, next ) {
		if ( res && this.apixpdoc.attribution ) {
			res.setHeader('X-Powered-By',this.apixpdoc.attribution);
		}
		Router.Request.applyProto( req );
		Router.Request.applyProto( res );
		req.res = res;
		res.req = req;
		this.router.handle(req, res, next);
	}



	start ( ) {
		if ( this.apixpdoc.socket ) {
			console.debug(`apixp::starting server with socket: ${socket} ...`);
			let mask = process.umask(0);
			if ( fs.existsSync(socket)) {
				fs.unlinkSync(socket);
			}
		} else {

		}
	}
}

function createApi ( options ) {

}
/*
"$schema": { "type":"string", "format":"uri" },
"openapi": { "$ref": "#/definitions/Semver" },
"info": { "$ref": "#/definitions/Info" },
"servers": {
	"type": "array",
	"items": { "$ref": "#/definitions/Server" }
},
"paths": {
	"type": "object",
	"additionalProperties": { "$ref": "#/definitions/Path" }
},
"webhooks": {
	"type": "object",
	"additionalProperties": { "$ref": "#/definitions/Path" }
},
"components": { "$ref": "#/definitions/Components" },
"security": { "$ref": "#/definitions/SecurityRequirement" },
"tags": { "$ref": "#/definitions/Tag" },
"externalDocs": { "$ref": "#/definitions/ExternalDocumentation" }
*/
