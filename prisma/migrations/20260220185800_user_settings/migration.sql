-- CreateTable
CREATE TABLE "UserSettings" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "defaultSportId" TEXT NOT NULL DEFAULT 'dance',
    "locale" TEXT NOT NULL DEFAULT 'fi',
    "timeZone" TEXT NOT NULL DEFAULT 'Europe/Helsinki',
    "weekStartsOn" INTEGER NOT NULL DEFAULT 1,
    "dateFormat" TEXT NOT NULL DEFAULT 'yyyy-MM-dd',
    "theme" TEXT NOT NULL DEFAULT 'system',
    "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
    "notificationsEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationsInApp" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
