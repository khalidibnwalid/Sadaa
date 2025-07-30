package app

import (
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	Port string
	Host string

	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration

	Environment string
}

func DefaultConfig() *Config {
	return &Config{
		Port: getEnv("PORT", "8080"),

		ReadTimeout:     time.Duration(getIntEnv("READ_TIMEOUT", 10)) * time.Second,
		WriteTimeout:    time.Duration(getIntEnv("WRITE_TIMEOUT", 10)) * time.Second,
		IdleTimeout:     time.Duration(getIntEnv("IDLE_TIMEOUT", 120)) * time.Second,
		ShutdownTimeout: time.Duration(getIntEnv("SHUTDOWN_TIMEOUT", 30)) * time.Second,

		Environment: getEnv("ENVIRONMENT", "development"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func getIntEnv(key string, fallback int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return fallback
}
