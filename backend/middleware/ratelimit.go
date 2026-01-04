package middleware

import (
	"net/http"
	"time"

	"github.com/go-chi/httprate"
)

func AuthRateLimiter() func(http.Handler) http.Handler {
	return httprate.Limit(
		5,
		1*time.Minute,
		httprate.WithKeyFuncs(httprate.KeyByIP),
		httprate.WithLimitHandler(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error": "Too many failed attempts. Please try again later."}`))
		}),
	)
}
