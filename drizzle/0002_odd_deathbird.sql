ALTER TABLE IF EXISTS "favorite_folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE IF EXISTS "favorite_folders" CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "favorites_folder_id_favorite_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP COLUMN "folder_id";
