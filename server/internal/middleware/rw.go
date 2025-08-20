package middleware

import (
	"context"
	"net/http"
)

type ctxKey string

const ResponseWriterCtxKey ctxKey = "server.response_writer"

// gets the http.ResponseWriter from the context.
func ForResponseWriter(ctx context.Context) (http.ResponseWriter, bool) {
	w, ok := ctx.Value(ResponseWriterCtxKey).(http.ResponseWriter)
	return w, ok
}

// injects the ResponseWriter into the request context.
func InjectResponseWriter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), ResponseWriterCtxKey, w)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
