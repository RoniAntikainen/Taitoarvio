-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FolderMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folderId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FolderMember_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "folderId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    CONSTRAINT "Notification_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "evaluator" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "sportLabel" TEXT NOT NULL,
    "scaleId" TEXT NOT NULL,
    "scaleLabel" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "folderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Evaluation" ("createdAt", "data", "evaluator", "id", "scaleId", "scaleLabel", "sportId", "sportLabel", "subject", "updatedAt", "userId") SELECT "createdAt", "data", "evaluator", "id", "scaleId", "scaleLabel", "sportId", "sportLabel", "subject", "updatedAt", "userId" FROM "Evaluation";
DROP TABLE "Evaluation";
ALTER TABLE "new_Evaluation" RENAME TO "Evaluation";
CREATE INDEX "Evaluation_userId_createdAt_idx" ON "Evaluation"("userId", "createdAt");
CREATE INDEX "Evaluation_folderId_createdAt_idx" ON "Evaluation"("folderId", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Folder_ownerId_createdAt_idx" ON "Folder"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "FolderMember_userEmail_idx" ON "FolderMember"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "FolderMember_folderId_userEmail_key" ON "FolderMember"("folderId", "userEmail");

-- CreateIndex
CREATE INDEX "Notification_userEmail_createdAt_idx" ON "Notification"("userEmail", "createdAt");
