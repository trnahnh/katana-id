package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"katanaid/database/ent"

	_ "github.com/lib/pq"
)

var Client *ent.Client

func Connect() {
	databaseURL := os.Getenv("DATABASE_URL")

	client, err := ent.Open("postgres", databaseURL)
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatal("Failed to create schema:", err)
	}

	Client = client
	fmt.Println("Connected to PostgreSQL database successfully")
}

func Close() {
	if Client != nil {
		Client.Close()
	}
}
