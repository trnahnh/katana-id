package identity

type AvatarGenerationRequest struct {
	Style  string `json:"style"`
	Traits string `json:"traits"`
}

type UsernameGenerationRequest struct {
	Count string `json:"count"`
	Vibe  string `json:"vibe"`
}

type UsernameGenerationSuccessResponse struct {
	Usernames string `json:"usernames"`
}

type AvatarGenerationSuccessResponse struct {
	Image string `json:"image"`
}
