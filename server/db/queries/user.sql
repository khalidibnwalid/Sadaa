-- name: GetUserByEmail :one
Select * from users where email = $1 Limit 1;

-- name: GetUserByUsername :one
Select * from users where username = $1 Limit 1;

-- name: GetUserByID :one
Select * from users where id = $1 Limit 1;

-- name: CreateUser :one
Insert into users (email, username, hashed_password) values ($1, $2, $3) returning *;