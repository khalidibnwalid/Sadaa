package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	_ "github.com/joho/godotenv/autoload"
	"github.com/khalidibnwalid/sadaa/server/internal/app"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
	"github.com/khalidibnwalid/sadaa/server/internal/router"
)

func main() {
	ctx := context.Background()

	//
	logger := log.New(os.Stdout, "[SADAA-API] ", log.LstdFlags|log.Lshortfile)
	config := app.DefaultConfig()

	s := app.NewServer(config, logger)
	r := router.NewRouter(s)
	r.SetupRoutes()
	//

	logger.Println("Starting Sadaa API server...")

	conn, err := pgx.Connect(ctx, config.DatabaseURL)
	if err != nil {
		logger.Fatal("Failed to connect to database:", err)
	}
	defer conn.Close(ctx)

	db := db.New(conn)
	val, err := db.PingDB(ctx)
	if err != nil {
		logger.Fatal("Failed to ping database:", err)
	}
	logger.Println("Database connection successful, ping result:", val)

	//
	if err := r.Start(); err != nil {
		logger.Fatal("Failed to start server:", err)
	}
}
