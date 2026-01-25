-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "evaluator" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "sportLabel" TEXT NOT NULL,
    "scaleId" TEXT NOT NULL,
    "scaleLabel" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Evaluation_userId_createdAt_idx" ON "Evaluation"("userId", "createdAt");
