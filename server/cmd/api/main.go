package main

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/khalidibnwalid/sadaa/server/internal/app"
	"github.com/khalidibnwalid/sadaa/server/internal/router"
)

func main() {
	logger := log.New(os.Stdout, "[SADAA-API] ", log.LstdFlags|log.Lshortfile)
	config := app.DefaultConfig()

	s := app.NewServer(config, logger)
	r := router.NewRouter(s)
	r.SetupRoutes()

	logger.Println("Starting Sadaa API server...")

	if err := r.Start(); err != nil {
		logger.Fatal("Failed to start server:", err)
	}
}
