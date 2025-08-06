package router

import (
	"net/http"

	"github.com/khalidibnwalid/sadaa/server/internal/middleware"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"

	"github.com/99designs/gqlgen/graphql/playground"
)

func (r *Router) SetupRoutes(routerCtx *Context) {

	r.Use(
		middleware.Logger(r.Server.Logger),
		middleware.CORS(
			[]string{"*"},
			[]string{"GET", "POST", "PUT", "DELETE"},
			[]string{"Content-Type", "Authorization"},
		),
		middleware.SecurityHeaders(),
	)
	resolver := &resolvers.Resolver{
		DB: routerCtx.DB,
	}

	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	// Authed routes
	r.Group(func(r *Router) {
		r.Handle("/gql", r.graphqlHandler(resolver))
	})

	if r.Server.Config.IsDevelopment {
		r.Handle("/gql/pg", playground.Handler("GraphQL playground", "/gql"))
	}
}
