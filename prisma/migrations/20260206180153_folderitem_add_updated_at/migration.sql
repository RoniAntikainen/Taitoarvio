-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FolderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FolderItem_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FolderItem" ("content", "createdAt", "createdBy", "folderId", "id", "title", "type") SELECT "content", "createdAt", "createdBy", "folderId", "id", "title", "type" FROM "FolderItem";
DROP TABLE "FolderItem";
ALTER TABLE "new_FolderItem" RENAME TO "FolderItem";
CREATE INDEX "FolderItem_folderId_idx" ON "FolderItem"("folderId");
CREATE INDEX "FolderItem_folderId_type_idx" ON "FolderItem"("folderId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
