package router

import (
	"net/http"
	"slices"

	"github.com/khalidibnwalid/sadaa/server/internal/app"
)

type Middleware func(http.Handler) http.Handler

type Router struct {
	Server *app.Server

	globalMiddlewares []Middleware
	localMiddlewares  []Middleware
	isSubRouter       bool
}

func NewRouter(Server *app.Server) *Router {
	return &Router{Server: Server}
}

func (r *Router) Use(mw ...Middleware) {
	if r.isSubRouter {
		r.localMiddlewares = append(r.localMiddlewares, mw...)
	} else {
		r.globalMiddlewares = append(r.globalMiddlewares, mw...)
	}
}

func (r *Router) Group(fn func(r *Router)) {
	subRouter := &Router{
		isSubRouter:      true,
		Server:           r.Server,
		localMiddlewares: slices.Clone(r.localMiddlewares),
	}
	fn(subRouter)
}

// Wrappers

func (r *Router) HandleFunc(pattern string, h http.HandlerFunc) {
	r.Handle(pattern, h)
}

func (r *Router) Handle(pattern string, h http.Handler) {
	for _, mw := range slices.Backward(r.localMiddlewares) {
		h = mw(h)
	}
	r.Server.Handle(pattern, h)
}

func (r *Router) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	var h http.Handler = http.Handler(r.Server.Mux)

	for _, mw := range slices.Backward(r.globalMiddlewares) {
		h = mw(h)
	}
	h.ServeHTTP(w, rq)
}

// override the Start method in Server
func (r *Router) Start() error {
	return r.Server.Start(r)
}
