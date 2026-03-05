package health

import (
	"net/http"
	"time"

	"github.com/trnahnh/katana-id/util"
)

type HealthResponse struct {
	Status string `json:"status"`
	Time   string `json:"time"`
}

func Health(w http.ResponseWriter, r *http.Request) {
	util.WriteJSON(w, 200, HealthResponse{
		Status: "ok",
		Time:   time.Now().Format(time.RFC3339),
	})
}
