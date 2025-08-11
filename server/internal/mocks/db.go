package mocks

import (
	"context"
	"sync"
	"testing"

	"github.com/khalidibnwalid/sadaa/server/internal/app"
	"github.com/khalidibnwalid/sadaa/server/internal/db"

	"github.com/jackc/pgx/v5/pgxpool"
)

// universal pool for testing
var (
	uri      string = "postgresql://admin:123qweasd@127.0.0.1:5432/sadaatesting"
	pool     *pgxpool.Pool
	refCount int = 0
	mu       sync.Mutex
)

// connects to the global database pool for testing
func GetDBPool(t *testing.T) *pgxpool.Pool {
	t.Helper()

	// only one database pool instance will be opened,
	// we have no way to guarantee that all tests will close the pool when others are using it,
	// thus we will track all open connections to the pool via 'refCount'
	mu.Lock()
	if pool == nil {
		config := &app.DBConfig{
			URL:      uri,
			MaxConns: 10,
			MinConns: 1,
		}
		pool = app.NewDBPool(context.Background(), config)
		// TODO: database migraition logic
	}
	refCount++
	mu.Unlock()

	t.Cleanup(func() {
		mu.Lock()
		defer mu.Unlock()
		refCount--
		if refCount == 0 && pool != nil {
			truncateAllTables(t, pool)

			pool.Close()
			pool = nil
		}
	})

	return pool
}

func GetDbQueries(t *testing.T) *db.Queries {
	t.Helper()
	return db.New(GetDBPool(t))
}

// will truncate all tables in the database
func truncateAllTables(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()
	pool.Exec(context.Background(), "TRUNCATE TABLE users CASCADE")
}
