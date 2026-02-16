package contact

type ContactRequest struct {
	Email  string `json:"email"`
	Reason string `json:"reason"`
}

type ContactResponse struct {
	Message string `json:"message"`
}
