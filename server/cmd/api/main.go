package main

import (
	"context"
	"log"
	"os"

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

	//
	logger.Println("Connecting to database...")
	conn := app.ConnectDB(logger, ctx, config)
	defer conn.Close(ctx)
	app.PingDB(logger, ctx, conn)

	//
	logger.Println("Starting Sadaa API server...")

	r.SetupRoutes(&router.Context{
		DB: db.New(conn),
	})
	//

	if err := r.Start(); err != nil {
		logger.Fatal("Failed to start server:", err)
	}
}
