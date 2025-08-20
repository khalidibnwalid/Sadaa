package middleware

import (
	"context"
	"net/http"

	"github.com/khalidibnwalid/sadaa/server/internal/services/auth"
)

// injects user if exist,
func InjectUser(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			cookie, err := r.Cookie(auth.AuthCookieName)
			if err == nil {
				userId, err := auth.GetAuthFromCookie(secret, cookie.Value)
				if err == nil && userId != nil {
					ctx = context.WithValue(ctx, auth.AuthCtxKey, userId.String())
				}
			}

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
