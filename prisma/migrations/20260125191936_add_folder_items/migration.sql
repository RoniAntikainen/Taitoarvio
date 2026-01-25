/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FolderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FolderItem_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FolderItem_folderId_createdAt_idx" ON "FolderItem"("folderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_ownerId_name_key" ON "Folder"("ownerId", "name");
