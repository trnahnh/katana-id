package shared

import "regexp"

var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func IsValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}
