package identity

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"katanaid/shared"

	"google.golang.org/genai"
)

func GenerateUsername(w http.ResponseWriter, r *http.Request) {
	var req UsernameGenerationRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	count, err := strconv.Atoi(req.Count)
	if err != nil {
		log.Print("Invalid value for count:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	vibe := strings.ToLower(strings.TrimSpace(req.Vibe))
	allowedVibes := map[string]bool{
		"random": true, "professional": true, "creative": true,
		"techy": true, "elegant": true, "quirky": true,
	}
	if !allowedVibes[vibe] {
		log.Print("Invalid vibe:", vibe)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid request"})
		return
	}

	if count > 10 || count < 0 {
		log.Print("Invalid username request")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid request"})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Error creating AI client")
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
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
		shared.WriteJSON(w, http.StatusServiceUnavailable, shared.ErrorResponse{Error: "Username generation quota exceeded"})
		return
	}

	shared.WriteJSON(w, http.StatusOK, UsernameGenerationSuccessResponse{Usernames: result.Text()})
}

func GenerateAvatar(w http.ResponseWriter, r *http.Request) {
	var req AvatarGenerationRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Something went wrong"})
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
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid style"})
		return
	}

	// Validate traits length
	if len(traits) > 100 {
		log.Print("Traits too long")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Traits must be 100 characters or less"})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Print("Failed to create Gemini client:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Service unavailable"})
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
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Failed to generate avatar"})
		return
	}

	// Check if we got any images
	if len(response.GeneratedImages) == 0 {
		log.Print("No images generated")
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "No image generated"})
		return
	}

	// Get the first generated image and encode to base64
	imageBytes := response.GeneratedImages[0].Image.ImageBytes
	imageBase64 := base64.StdEncoding.EncodeToString(imageBytes)

	shared.WriteJSON(w, http.StatusOK, AvatarGenerationSuccessResponse{Image: imageBase64})
}
