package app

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)


func NewDBPool(logger *log.Logger, ctx context.Context, config *Config) *pgxpool.Pool {
	poolConfig, err := pgxpool.ParseConfig(config.DBURL)
	if err != nil {
		logger.Panic("Failed to parse database URL:", err)
	}

	poolConfig.MaxConns = config.DBMaxConns
	poolConfig.MinConns = config.DBMinConns

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		logger.Panic("Failed to connect to database:", err)
	}

	if err := pool.Ping(ctx); err != nil {
		logger.Panic("Failed to ping database:", err)
	}

	logger.Println("Database connection pool established successfully")
	return pool
}

func PingDB(logger *log.Logger, ctx context.Context, pool *pgxpool.Pool) {
	var result string
	err := pool.QueryRow(ctx, "SELECT 'pong'").Scan(&result)
	if err != nil {
		logger.Panic("Failed to ping database:", err)
	}
	logger.Println("Database ping successful:", result)
}
