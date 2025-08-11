package app

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewDBPool(ctx context.Context, config *DBConfig, logger ...*log.Logger) *pgxpool.Pool {
	_logger := log.Default()
	if len(logger) > 0 {
		_logger = logger[0]
	}
	poolConfig, err := pgxpool.ParseConfig(config.URL)
	if err != nil {
		_logger.Panic("Failed to parse database URL:", err)
	}

	poolConfig.MaxConns = config.MaxConns
	poolConfig.MinConns = config.MinConns

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		_logger.Panic("Failed to connect to database:", err)
	}

	if err := pool.Ping(ctx); err != nil {
		_logger.Panic("Failed to ping database:", err)
	}

	_logger.Println("Database connection pool established successfully")
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
