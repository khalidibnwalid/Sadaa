package main

import (
	"context"
	"log"
	"os"

	"github.com/khalidibnwalid/sadaa/server/internal/app"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
	"github.com/khalidibnwalid/sadaa/server/internal/router"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	ctx := context.Background()

	//
	logger := log.New(os.Stdout, "[SADAA-API] ", log.LstdFlags|log.Lshortfile)
	config := app.DefaultConfig()

	s := app.NewServer(config, logger)
	r := router.NewRouter(s)

	//
	logger.Println("Connecting to database...")
	pool := app.NewDBPool(ctx, config.DB, logger)
	defer pool.Close()

	//
	logger.Println("Starting Sadaa API server...")

	r.SetupRoutes(&router.Context{
		DB: db.New(pool),
	})
	//

	if err := r.Start(); err != nil {
		logger.Fatal("Failed to start server:", err)
	}
}
