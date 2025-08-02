package router

import (
	"net/http"

	"github.com/khalidibnwalid/sadaa/server/internal/graph"
	"github.com/khalidibnwalid/sadaa/server/internal/middleware"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/vektah/gqlparser/v2/ast"
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
		r.Handle("/gql", graphqlHandler(resolver))
	})

	if r.Server.Config.Environment == "development" {
		r.Handle("/gql/pg", playground.Handler("GraphQL playground", "/gql"))
	}
}

func graphqlHandler(resolver *resolvers.Resolver) http.Handler {
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return srv
}
