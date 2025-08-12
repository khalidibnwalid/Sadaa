
all: api

api: ./cmd/api/main.go
	go run ./cmd/api

build: ./cmd/api/main.go
	go build ./cmd/api

dev: .air.toml
	air

dbgen: ./db/sqlc.yaml
	cd ./db && sqlc generate

gqlgen: ./gqlgen.yml
	go get github.com/99designs/gqlgen && go run github.com/99designs/gqlgen generate 
