
-- name: CreateRoom :one
Insert into rooms (server_id, group_id, name, order_index, type) 
values ($1, $2, $3, $4, $5) 
returning *;

-- name: GetRoomById :one
Select * 
from rooms 
where id = $1
limit 1;

-- name: GetRoomsByGroupID :many
Select * 
from rooms 
where group_id = $1;

