package identityservice

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"katanaid/database"
	"katanaid/middleware"
	"katanaid/models"
	"katanaid/util"

	"google.golang.org/genai"
)

var (
	allowedVibes = map[string]bool{
		"professional": true,
		"fun":          true,
		"tech":         true,
		"gaming":       true,
		"creative":     true,
		"minimal":      true,
		"cool":         true,
		"random":       true,
	}

	allowedStyles = map[string]bool{
		"realistic":  true,
		"anime":      true,
		"cartoon":    true,
		"pixel":      true,
		"watercolor": true,
		"minimalist": true,
	}

	sanitizeRegex = regexp.MustCompile(`[^a-zA-Z0-9\s\-]`)
)

type UsernameGenerationRequest struct {
	Count string `json:"count"`
	Vibe  string `json:"vibe"`
}

type UsernameGenerationSuccessResponse struct {
	Usernames string `json:"usernames"`
}

type AvatarGenerationRequest struct {
	Style  string `json:"style"`
	Traits string `json:"traits"`
}

type AvatarGenerationSuccessResponse struct {
	Image string `json:"image"`
}

func sanitizeInput(input string) string {
	result := strings.ToLower(strings.TrimSpace(input))

	dangerousPatterns := []string{
		"ignore", "forget", "disregard", "override", "bypass",
		"system:", "assistant:", "user:", "prompt:",
		"```", "'''", "<<", ">>",
	}

	for _, pattern := range dangerousPatterns {
		result = strings.ReplaceAll(result, pattern, "")
	}

	return strings.TrimSpace(sanitizeRegex.ReplaceAllString(result, ""))
}

func GenerateUsername(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		util.WriteJSON(w, http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	var req UsernameGenerationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
		return
	}

	count, err := strconv.Atoi(req.Count)
	if err != nil || count < 1 || count > 10 {
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Count must be between 1 and 10"})
		return
	}

	vibe := strings.ToLower(strings.TrimSpace(req.Vibe))
	if !allowedVibes[vibe] {
		vibe = "random"
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Error creating AI client:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Service unavailable"})
		return
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash-lite",
		genai.Text(fmt.Sprintf(
			"Generate exactly %d unique usernames with a %s vibe. Output only the usernames separated by commas, no additional text, no spaces after commas, no numbering.",
			count,
			vibe,
		)),
		nil,
	)
	if err != nil {
		log.Print("Error generating username:", err)
		util.WriteJSON(w, http.StatusServiceUnavailable, models.ErrorResponse{Error: "Generation quota exceeded"})
		return
	}

	go logIdentityUsage(user.UserID, "username", vibe)

	util.WriteJSON(w, http.StatusOK, UsernameGenerationSuccessResponse{Usernames: result.Text()})
}

func GenerateAvatar(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		util.WriteJSON(w, http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	var req AvatarGenerationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
		return
	}

	style := strings.ToLower(strings.TrimSpace(req.Style))
	if !allowedStyles[style] {
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid style"})
		return
	}

	traits := sanitizeInput(req.Traits)
	if len(traits) > 100 {
		traits = traits[:100]
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Failed to create AI client:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Service unavailable"})
		return
	}

	prompt := fmt.Sprintf(
		"Generate a profile avatar picture in %s art style. Traits: %s. Make it suitable for a social media profile picture, centered on the face/character, clean background.",
		style,
		traits,
	)

	response, err := client.Models.GenerateImages(
		ctx,
		"imagen-4.0-generate-001",
		prompt,
		&genai.GenerateImagesConfig{NumberOfImages: 1},
	)
	if err != nil {
		log.Print("Imagen API error:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate avatar"})
		return
	}

	if len(response.GeneratedImages) == 0 {
		log.Print("No images generated")
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "No image generated"})
		return
	}

	imageBase64 := base64.StdEncoding.EncodeToString(response.GeneratedImages[0].Image.ImageBytes)

	go logIdentityUsage(user.UserID, "avatar", style)

	util.WriteJSON(w, http.StatusOK, AvatarGenerationSuccessResponse{Image: imageBase64})
}

func logIdentityUsage(userID int, generationType, details string) {
	_, err := database.DB.Exec(
		context.Background(),
		`INSERT INTO analyses (user_id, file_id, filename, file_type, result, confidence, details) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		userID,
		fmt.Sprintf("gen-%d", userID),
		generationType,
		"identity_generation",
		"success",
		1.0,
		details,
	)
	if err != nil {
		log.Print("Error logging identity usage:", err)
	}
}
