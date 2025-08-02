package app

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
)

func ConnectDB(logger *log.Logger, ctx context.Context, config *Config) *pgx.Conn {
	conn, err := pgx.Connect(ctx, config.DatabaseURL)
	if err != nil {
		logger.Panic("Failed to connect to database:", err)
	}
	return conn
}

func PingDB(logger *log.Logger, ctx context.Context, conn *pgx.Conn) {
	var result string
	err := conn.QueryRow(ctx, "SELECT 'pong'").Scan(&result)
	if err != nil {
		logger.Panic("Failed to ping database:", err)
	}
}
