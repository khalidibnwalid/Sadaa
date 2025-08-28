
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

-- name: GetRoomsGroupWithRoomsByServerID :many
-- Select sqlc.embed(rooms_groups), sqlc.embed(rooms) 
-- from rooms_groups 
-- left join rooms on rooms.group_id = rooms_groups.id
-- where rooms_groups.server_id = $1;

-- -- name: GetRoomsGroupWithRoomsByServerID :many
-- SELECT 
--   rooms_groups.*,
--   COALESCE(
--     json_agg(rooms) FILTER (WHERE rooms.id IS NOT NULL),
--     '[]'
--   ) AS rooms
-- FROM rooms_groups
-- LEFT JOIN rooms ON rooms.group_id = rooms_groups.id
-- WHERE rooms_groups.server_id = $1
-- GROUP BY rooms_groups.id;