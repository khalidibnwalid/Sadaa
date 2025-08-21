package mocks

import (
	"context"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/khalidibnwalid/sadaa/server/internal/graph"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
)

type MockGqlClient struct {
	Resolver *resolvers.Resolver
	Client   *client.Client
}

// creates a new instance of MockGqlClient for testing purposes.
func NewGqlClient(t *testing.T) *MockGqlClient {
	t.Helper()

	res := &resolvers.Resolver{
		DB:            GetDbQueries(t),
		Auth:          DefaultAuthConfig(t),
		IsDevelopment: true,
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: res}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	client := client.New(srv)

	return &MockGqlClient{
		Resolver: res,
		Client:   client,
	}
}

// injects the context into the GraphQL client request.
func (c *MockGqlClient) WithContext(ctx context.Context) client.Option {
	return func(req *client.Request) {
		req.HTTP = req.HTTP.WithContext(ctx)
	}
}