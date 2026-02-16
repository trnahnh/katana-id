package auth

import (
	"fmt"
	"os"

	"github.com/resend/resend-go/v2"
)

func sendVerificationEmail(token string, email string, username string) error {
	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	link := fmt.Sprintf("%s/auth/verify-email?token=%s", os.Getenv("BACKEND_URL"), token)

	params := &resend.SendEmailRequest{
		From:    "KatanaID <noreply@katanaid.com>",
		To:      []string{email},
		Subject: "KatanaID Email Verification",
		Html: fmt.Sprintf(`
		<p>Hello, %s</p>
		<br>
		<p>Click the link below to verify your email.</p>
		<a href="%s">Verify Email</a>
		<br>
		<p>— The Katana ID Team</p>`, username, link),
	}

	_, err := client.Emails.Send(params)
	if err != nil {
		return err
	}

	return nil
}
