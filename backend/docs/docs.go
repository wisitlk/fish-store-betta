// Package docs holds the Swagger specification served at /swagger/index.html.
//
// This is a minimal placeholder so the module builds from a clean checkout.
// The full specification is generated from the // @... annotations on the
// handlers by running, from the backend directory:
//
//	go run github.com/swaggo/swag/cmd/swag@latest init
//
// That regenerates this file (plus swagger.json and swagger.yaml, which stay
// gitignored) with every documented endpoint.
package docs

import "github.com/swaggo/swag"

const placeholderTemplate = `{
    "swagger": "2.0",
    "info": {
        "title": "Aquatic Jewel API",
        "description": "Specification not generated. Run 'swag init' in the backend directory to document every endpoint.",
        "version": "1.0"
    },
    "basePath": "/api",
    "paths": {}
}`

type placeholderSpec struct{}

func (s *placeholderSpec) ReadDoc() string { return placeholderTemplate }

func init() {
	swag.Register(swag.Name, &placeholderSpec{})
}
