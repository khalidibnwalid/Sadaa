package app

import (
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/khalidibnwalid/sadaa/server/internal/platforms/db"
)

const (
	EnvDevelopment = "development"
	// EnvProduction  = "production"

	defaultPort            = "8080"
	defaultReadTimeout     = 10
	defaultWriteTimeout    = 10
	defaultIdleTimeout     = 120
	defaultShutdownTimeout = 30

	defaultMinConns = 5
	defaultMaxConns = 30
)

type Config struct {
	Port string
	Host string

	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration

	Environment   string
	IsDevelopment bool

	DB *db.DBConfig

	Auth *AuthConfig
}

type AuthConfig struct {
	JWTSecret string
}

func DefaultConfig() *Config {
	return &Config{
		Port: getEnv("PORT", defaultPort),

		ReadTimeout:     time.Duration(getIntEnv("READ_TIMEOUT", defaultReadTimeout)) * time.Second,
		WriteTimeout:    time.Duration(getIntEnv("WRITE_TIMEOUT", defaultWriteTimeout)) * time.Second,
		IdleTimeout:     time.Duration(getIntEnv("IDLE_TIMEOUT", defaultIdleTimeout)) * time.Second,
		ShutdownTimeout: time.Duration(getIntEnv("SHUTDOWN_TIMEOUT", defaultShutdownTimeout)) * time.Second,

		Environment:   getEnv("ENVIRONMENT", EnvDevelopment),
		IsDevelopment: getEnv("ENVIRONMENT", EnvDevelopment) == EnvDevelopment,

		DB: &db.DBConfig{
			URL:      mustGetEnv("DB_URL"),
			MinConns: int32(getIntEnv("DB_MIN_CONNS", defaultMinConns)),
			MaxConns: int32(getIntEnv("DB_MAX_CONNS", defaultMaxConns)),
		},

		Auth: &AuthConfig{
			JWTSecret: mustGetEnv("JWT_SECRET"),
		},
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

func mustGetEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic("Environment variable " + key + " is not set")
	}
	return value
}
