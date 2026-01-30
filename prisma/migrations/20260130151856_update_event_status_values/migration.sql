-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SIN_CONFIRMAR',
    "notes" TEXT,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Migrate existing data with status mapping
INSERT INTO "new_Event" ("id", "name", "startDate", "endDate", "status", "notes", "clientId", "createdAt", "updatedAt")
SELECT "id", "name", "startDate", "endDate", 
  CASE 
    WHEN "status" = 'BOOKED' THEN 'RESERVADO'
    WHEN "status" = 'ACTIVE' THEN 'DESPACHADO'
    WHEN "status" = 'COMPLETED' THEN 'COMPLETADO'
    WHEN "status" = 'CANCELLED' THEN 'CANCELADO'
    ELSE 'SIN_CONFIRMAR'
  END as "status",
  "notes", "clientId", "createdAt", "updatedAt"
FROM "Event";

DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

