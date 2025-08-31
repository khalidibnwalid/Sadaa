
-- name: CreateRoomsGroup :one
Insert into rooms_groups (server_id, name, order_index) 
values ($1, $2, $3) 
returning *;

-- name: UpdateRoomsGroup :one
Update rooms_groups
set name = $2,
    order_index = $3
where id = $1
returning *;

-- name: GetRoomsGroupById :one
Select * 
from rooms_groups 
where id = $1
limit 1;

-- name: GetRoomsGroupByServerID :many
Select * 
from rooms_groups
where server_id = $1;
