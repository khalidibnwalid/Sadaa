package router

import (
	"net/http"

	"github.com/khalidibnwalid/sadaa/server/internal/middleware"
)

func (r *Router) SetupRoutes() {

	r.Use(
		middleware.Logger(r.Server.Logger),
		middleware.CORS(
			[]string{"*"},
			[]string{"GET", "POST", "PUT", "DELETE"},
			[]string{"Content-Type", "Authorization"},
		),
		middleware.SecurityHeaders(),
	)

	r.Group(func(r *Router) {
		// Health check endpoint
		r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("pong"))
		})

	})
}
