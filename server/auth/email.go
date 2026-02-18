package auth

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/resend/resend-go/v2"
)

func sendVerificationEmail(token string, email string, username string) error {
	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	link := fmt.Sprintf("%s/auth/verify-email?token=%s", os.Getenv("BACKEND_URL"), token)
	names := []string{"Khiem", "Anh"}
	from := names[rand.Intn(2)]

	params := &resend.SendEmailRequest{
		From:    "KatanaID <verify@katanaid.com>",
		To:      []string{email},
		Subject: "KatanaID Email Verification",
		Html: fmt.Sprintf(`
		<p>Hello, %s</p>
		<br>
		<p>This is %s from KatanaID</p>
		<p>Welcome onboard</p>
		<p>Click the link below to verify your email.</p>
		<a href="%s">Verify Email</a>
		<br>
		<p>— %s From the The Katana ID Team</p>`, username, from, link, username),
	}

	_, err := client.Emails.Send(params)
	if err != nil {
		return err
	}

	return nil
}
