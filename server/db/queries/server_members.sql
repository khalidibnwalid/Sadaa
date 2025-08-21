--- name: CreateServerMember :one
Insert into server_members (server_id, user_id) values ($1, $2) returning *;

--- name: GetServerMemberByUserId :one
Select * from server_members where user_id = $1 Limit 1;

-- name: GetServerMemberByServerId :one
Select * from server_members where server_id = $1 Limit 1;

-- name: GetServerMember :one
Select * from server_members where user_id = $1 AND server_id = $2 Limit 1;
