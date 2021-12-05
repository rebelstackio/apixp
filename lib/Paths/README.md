# Paths

Based on Paths Object : https://spec.openapis.org/oas/v3.1.0#paths-object

```
  ┌─────────────┐      ┌──────────────────────────────────────┐
  │    Hash     │      │             <<interface>>            │
  ├─────────────┤      │               iHandler               │
  │             │      ├──────────────────────────────────────┤
  ├─────────────┤      │ _ handle( Req,Res,...Mware):Promise  │
  │ _iter_      │      └────▲─────────────────────────────────┘
  └────────▲────┘           ¦
           │ inherits       ¦ implements
           │                ¦
┌──────────┴────────────────┴───────────┐
│                 Paths                 │
├───────────────────────────────────────┤
│ + {pathstr}: PathItem                 │
│ _ pathmap : apixp.PathMap             │
├───────────────────────────────────────┤
│ _ getOp (Req):Operation               │
│ _ handle ( Req,Res,Finally ):Promise  │
└───────────────────────────────────────┘
```

## Matching Routes

- Paths should be grouped for easier matching, sorting is already natural

- also, reducing by HTTP Method would also be great way to reduce the list of paths to check

	"post":"/foo/bar/{fud}/graphql":{},
	"get":"/foo/bar/baz/{fuz}":{},
	"get":"/foo/baz/{bar}":{},
	"get":"/fud/bar/{fuz}":{},
	"get":"/fud/baz/{fuz}":{},

When a POST arrives, it only has one path to attempt match.

When a GET arrives, it matches the first level "/foo", then 2nd-level "/baz" before attempting to run the matches regex

However, we have not addressed parameter types. {fud} might be a number while {fuz} is an ISO8601 datetime string.

How do we build regular expression from parameter definitions?

see:
	https://spec.openapis.org/oas/v3.1.0#parameter-object
	https://spec.openapis.org/oas/v3.1.0#path-templating
	https://spec.openapis.org/oas/v3.1.0#path-templating-matching

! We're only concerned where "parameter location" (in) is "path"

### Sample OpenAPI 3.1
```json
{
	"openapi":"3.1",
	"info":{},
	"servers": {
		"url":"/v2",
		"description":"relative server url"
	},
	"components": {
		"parameters": {
			"Pusername": {
				"name": "username",
				"in": "path",
				"description": "username to fetch",
				"required": true,
				"schema": { "type": "string", "pattern": "^[a-z0-9_-]{3,15}$" }
			},
			"Puserid": {
				"name": "userid",
				"in": "path",
				"description": "userid to fetch",
				"required": true,
				"schema": { "type": "integer", "miniumum": "0" }
			}
		}
	},
	"paths": {
		"/foo/bar/{username}": {
			"get":{ "parameters":{ "$ref":"#/components/parameters/Pusername" } }
		},
		"/foo/baz/{username}":{
			"get":{ "parameters":{ "$ref":"#/components/parameters/Pusername" } },
			"put":{ "parameters":{ "$ref":"#/components/parameters/Pusername" } }
		},
		"/fud/bar/{username}":{
			"get":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } },
			"put":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } },
			"post":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } }
		},
		"/fud/baz/{username}":{
			"get":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } },
			"put":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } },
			"post":{ "parameters":{ "$ref":"#/components/parameters/Puserid" } }
		}
	}
}
```

## Passing apixpdoc and pointer to constructor with Json Pointer
```js
let paths = new Paths( apixpdoc ); /* constructor knows to find paths at #/paths
```

Dynamic key (hash) needs to be escaped. For example, an escaped pointer having `/` character migth look like this: `#/paths/~1foo~1bar~1{username}`

see `.escape(str)` : https://www.npmjs.com/package/json-pointer#escapestr

Passing the pointer ( reference ) to the single apixpdoc should be performant.

testing json pointer : https://www.jsonquerytool.com/



If you think about it, the "servers" are apart of the path and must also be matching,
see https://spec.openapis.org/oas/v3.1.0#server-object

Any request to a Server will match any entry in the servers map before handing off to router ( Paths ) - or simply close connection.

At startup, Paths will design a new structure for quick lookup/matching of routes. Using the above example, the Map structure might look like this:

### PathMap
```js
{
	"get": {
		"foo" : {
			"bar": {
				/^[a-z0-9_-]{3,15}$/ : ref_to_operation
			},
			"baz": {
				/^[a-z0-9_-]{3,15}$/ : ref_to_operation
			}
		},
		"fud" : {
			"bar": {
				{"type":"integer","miniumum":"0"} : ref_to_operation
			},
			"baz": {
				{"type":"integer","miniumum":"0"} : ref_to_operation
			}
		},
	}
}
```

Remember the Map object preserves original insertion order of keys. If we were to keep a count of hits in a separate sorted array, we
can periodically re-order the Map for faster matching/retrieval of most common paths. Now we are becoming faster than Koa and Express.

As we use the Map to match keys, a string key will simply be an equality match, a regex key will be a regex match, an object key
will be a json schema match. This is stroke of genius.

