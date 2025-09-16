package router

import "github.com/khalidibnwalid/sadaa/server/internal/platforms/db"

type Context struct {
	DB *db.Queries
}
