-- name: CreateServer :one
Insert into servers (name, creator_id, cover_url) values ($1, $2, $3) returning *;

-- name: GetServerById :one
Select * from servers where id = $1 Limit 1;