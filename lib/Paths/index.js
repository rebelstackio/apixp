'use strict';

const Path = require('Path');
const parseUrl = require('parseurl');


class Paths {
	constructor ( paths ) {
		Object.keys( paths ).forEach( path => {
			this[path] = new Path( paths[path] );
		});
	}

	_route ( req ) {
		let purl = parseUrl( req );

		return /* PathItem with xp markup in Operation */;
	}

	_handle ( req, res, next ) {

	}
}
