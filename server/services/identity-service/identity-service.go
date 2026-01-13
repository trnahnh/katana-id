package identityservice

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"katanaid/database"
	"katanaid/middleware"
	"katanaid/models"
	"katanaid/util"

	"google.golang.org/genai"
)

type AvatarGenerationRequest struct {
	Style  string `json:"style"`
	Traits string `json:"traits"`
}

type UsernameGenerationSuccessResponse struct {
	Usernames string `json:"usernames"`
}

type AvatarGenerationSuccessResponse struct {
	Image string `json:"image"`
}

type UsernameGenerationRequest struct {
	Count string `json:"count"`
	Vibe  string `json:"vibe"`
}

func GenerateUsername(w http.ResponseWriter, r *http.Request) {
	var req UsernameGenerationRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Something went wrong"})
		return
	}

	count, err := strconv.Atoi(req.Count)
	if err != nil {
		log.Print("Invalid value for count:", err)
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Something went wrong"})
		return
	}

	vibe := strings.ToLower(strings.TrimSpace(req.Vibe))
	if vibe == "" || len(vibe) > 15 {
		log.Print("Invalid vibe")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
		return
	}

	if count > 10 || count < 0 {
		log.Print("Invalid username request")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Error creating AI client")
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Something went wrong"})
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
		util.WriteJSON(w, http.StatusServiceUnavailable, models.ErrorResponse{Error: "Username generation quota exceeded"})
		return
	}

	// Log usage to database
	user, ok := middleware.GetUserFromContext(r.Context())
	if ok && user.UserID > 0 {
		go logIdentityUsage(&user.UserID, "username", vibe, "success")
	} else {
		go logIdentityUsage(nil, "username", vibe, "success")
	}

	util.WriteJSON(w, http.StatusOK, UsernameGenerationSuccessResponse{Usernames: result.Text()})
}

func GenerateAvatar(w http.ResponseWriter, r *http.Request) {
	var req AvatarGenerationRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Something went wrong"})
		return
	}

	style := strings.ToLower(strings.TrimSpace(req.Style))
	traits := strings.TrimSpace(req.Traits)

	// Validate style
	allowedStyles := map[string]bool{
		"realistic": true, "anime": true, "cartoon": true,
		"pixel": true, "watercolor": true, "minimalist": true,
	}
	if !allowedStyles[style] {
		log.Print("Invalid style:", style)
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid style"})
		return
	}

	// Validate traits length
	if len(traits) > 100 {
		log.Print("Traits too long")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Traits must be 100 characters or less"})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Failed to create Gemini client:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Service unavailable"})
		return
	}

	// Prompt building
	prompt := fmt.Sprintf(
		"Generate a profile avatar picture in %s art style. Traits: %s. Make it suitable for a social media profile picture, centered on the face/character, clean background.",
		style,
		traits,
	)

	// Use Imagen API for actual image generation
	config := &genai.GenerateImagesConfig{
		NumberOfImages: 1,
	}

	response, err := client.Models.GenerateImages(
		ctx,
		"imagen-4.0-generate-001",
		prompt,
		config,
	)
	if err != nil {
		log.Print("Imagen API error:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate avatar"})
		return
	}

	// Check if we got any images
	if len(response.GeneratedImages) == 0 {
		log.Print("No images generated")
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "No image generated"})
		return
	}

	// Get the first generated image and encode to base64
	imageBytes := response.GeneratedImages[0].Image.ImageBytes
	imageBase64 := base64.StdEncoding.EncodeToString(imageBytes)

	// Log usage to database
	user, ok := middleware.GetUserFromContext(r.Context())
	if ok && user.UserID > 0 {
		go logIdentityUsage(&user.UserID, "avatar", style, "success")
	} else {
		go logIdentityUsage(nil, "avatar", style, "success")
	}

	util.WriteJSON(w, http.StatusOK, AvatarGenerationSuccessResponse{Image: imageBase64})
}

func logIdentityUsage(userID *int, generationType, details, result string) {
	fileID := "gen-anonymous"
	if userID != nil {
		fileID = fmt.Sprintf("gen-%d", *userID)
	}

	_, err := database.DB.Exec(
		context.Background(),
		`INSERT INTO analyses (user_id, file_id, filename, file_type, result, confidence, details) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		userID,
		fileID,
		generationType,
		"identity_generation",
		result,
		1.0,
		details,
	)
	if err != nil {
		log.Print("Error logging identity usage:", err)
	}
}
