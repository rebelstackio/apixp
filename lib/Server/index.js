"use strict";

const { createApi } = require('../ApiFactory');

class Server {
	#defaults = {
		port:8888,
		autostart:false
	};
	#log = console;
	constructor ( options ) {
		this.options = Object.assign( this.#defaults, options );
		if ( this.options.logger ) {
			this.#log = this.options.logger
		}
		if ( this.autostart ) {
			this.buildApi( this.options );
			this.listen( this.options.port );
		}
	}

	buildApi ( options ) {
		this.api = createApi( options );
	}

	get api () {
		return this.api;
	}

	set api ( api ) {
		this.api = api;
	}

	listen ( port ) {
		this.api.listen( port, () => {
			this.#log.log(`Api listening at http://localhost:${this.options.port}`);
		});
	} 
}

module.exports = Server;
