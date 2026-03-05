package contact

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"katanaid/database"
	"katanaid/shared"
)

func Contact(w http.ResponseWriter, r *http.Request) {
	var req ContactRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid JSON"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	reason := strings.TrimSpace(req.Reason)

	if email == "" || reason == "" {
		log.Print("Missing required fields")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Email and reason are required"})
		return
	}

	if !shared.IsValidEmail(email) {
		log.Print("Invalid email format")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid email format"})
		return
	}

	if len(reason) < 10 {
		log.Print("Reason too short")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Please provide more details (at least 10 characters)"})
		return
	}

	if len(reason) > 2000 {
		log.Print("Reason too long")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Message too long (max 2000 characters)"})
		return
	}

	_, err = database.Client.Contact.Create().
		SetEmail(email).
		SetReason(reason).
		Save(r.Context())
	if err != nil {
		log.Print("Error saving contact:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Failed to submit contact"})
		return
	}

	log.Printf("New contact submission from: %s", email)

	shared.WriteJSON(w, http.StatusCreated, ContactResponse{
		Message: "Thank you for contacting us! We'll get back to you soon.",
	})
}
