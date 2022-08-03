# Apixp

Apixp is a web framework for quickly building RESTful APIs following openapi 3.1.
It uses a declarative-style reading an openapi-3.1 document or the apixp-3.1 document (a namespaced superset of openapi3.1) at startup to build routes and connect middle-wares.

Apixp is partially declarative (in the right places). From either an openapi or apixp document, you can stub out an initial project that includes controller (middleware) definitions. Apixp document declarations build upon openapi to allow declaration of middle-ware stacks associated to routes.


## What does Apixp acronym stand for?

It could mean many things:
- Api [for] e*X*perienced *P*ros
- Api [with] e*X*tra *P*owers
- Api [that is] e*X*istentially *P*rofound
- whatever you like

## Namespaced sugar

Openapi3.1 provides enough detail to mostly launch a web api but stops short at implementation. Apixp takes it the final step allowing the document to serve beyond just documentation or simple stubbing of a project. For example, in addition to installing packages and dependencies in the default controllers folder ( which can be modified in the document ), the document also serves as the manifest for importing and referencing the controllers as middle wares associated to routes. You can also include semver version or ranges for npm packages.

Apixp permits this extension of openapi3.1 by using namespaced properties following JSON-ld style to keep properties short and sweet.

[ examples of namespace with json-ld ]

## Versioning
Apixp aligns with openapi major and minor versioning and will bump patch version when fixes are made available.


## Middle wares
Apixp builds upon success of web frameworks which have inspired it, namely [Express](), [Connect](), and [Koa]() (and many others to many to name). To expand on the vast domain of work developers have invested in crafting their own middlewares, Apixp has settled on Koa-style of middleware because it resolves potential loss of control flow, exposes promises, and passes along a very handy context. Apixp provides simple wrappers for standard Connect or Express middlewares so they may receive control with expected signatures.

[ example of declaring Koa-style, Connect-style, and Express-style middlewares ]


## Installation

```sh
$ npm install apixp
```


## Initializing with some boilerplate
```sh
$ apixp init
```
Produces a simple project base folder structure and heartbeat endpoint (path).


## Heartbeat Apixp
`/Apixp.3.1` - the document defaults to root of project or current working directory
```json
{
	"openapi":"3.1",
	"paths": {

	}
}
```




see https://github.com/expressjs/body-parser/blob/master/lib/read.js

see https://ajv.js.org/packages/ajv-errors.html

