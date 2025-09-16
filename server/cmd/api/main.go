package main

import (
	"context"

	"go.uber.org/zap"

	"github.com/khalidibnwalid/sadaa/server/internal/app"
	"github.com/khalidibnwalid/sadaa/server/internal/platforms/db"
	"github.com/khalidibnwalid/sadaa/server/internal/router"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	ctx := context.Background()
	config := app.DefaultConfig()

	//
	var (
		logger *zap.Logger
		err    error
	)
	if config.IsDevelopment {
		logger, err = zap.NewDevelopment()
	} else {
		logger, err = zap.NewProduction()
	}

	if err != nil {
		panic("failed to initialize zap logger: " + err.Error())
	}
	defer logger.Sync()

	s := app.NewServer(config, logger)
	r := router.NewRouter(s)

	//
	logger.Info("Connecting to database...")
	pool, err := db.NewDBPool(ctx, config.DB)
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}

	defer pool.Close()

	//
	logger.Info("Starting Sadaa API server...")

	r.SetupRoutes(&router.Context{
		DB: db.New(pool),
	})
	//

	if err := r.Start(); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}
