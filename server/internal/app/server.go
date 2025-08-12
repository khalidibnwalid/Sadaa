package app

import (
	"context"
	"net/http"

	"go.uber.org/zap"
)

type Server struct {
	Config     *Config
	Mux        *http.ServeMux
	HttpServer *http.Server
	Logger     *zap.Logger
}

func NewServer(config *Config, logger *zap.Logger) *Server {
	if config == nil {
		config = DefaultConfig()
	}

	return &Server{
		Config: config,
		Mux:    http.NewServeMux(),
		Logger: logger,
	}
}

func (s *Server) Handle(pattern string, handler http.Handler) {
	s.Mux.Handle(pattern, handler)
}

func (s *Server) HandleFunc(pattern string, handler http.HandlerFunc) {
	s.Mux.HandleFunc(pattern, handler)
}

func (s *Server) Start(handler http.Handler) error {
	s.HttpServer = &http.Server{
		Addr:         s.Config.Host + ":" + s.Config.Port,
		Handler:      handler,
		ReadTimeout:  s.Config.ReadTimeout,
		WriteTimeout: s.Config.WriteTimeout,
		IdleTimeout:  s.Config.IdleTimeout,
	}

	s.Logger.Info("Starting server",
		zap.String("host", s.Config.Host),
		zap.String("port", s.Config.Port),
	)
	s.Logger.Info("Environment", zap.String("env", s.Config.Environment))

	return s.HttpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	if s.HttpServer != nil {
		return s.HttpServer.Shutdown(ctx)
	}
	return nil
}
