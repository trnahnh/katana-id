package health

import (
	"net/http"
	"time"

	"katanaid/shared"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

func Health(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	shared.WriteJSON(w, http.StatusOK, response)
}
