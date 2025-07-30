package middleware

import (
	"log"
	"net/http"
	"time"
)

// override the ResponseWriter to capture the status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

// override WriteHeader to capture the status code
func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func Logger(logger *log.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// injecting a response writer wrapper to capture status code
			ww := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

			next.ServeHTTP(ww, r)

			duration := time.Since(start)
			logger.Printf("%s %s %d %v %s",
				r.Method,
				r.URL.Path,
				ww.statusCode,
				duration,
				r.RemoteAddr,
			)
		})
	}
}
