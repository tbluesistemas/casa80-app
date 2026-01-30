-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "returnedGood" INTEGER NOT NULL DEFAULT 0,
    "returnedDamaged" INTEGER NOT NULL DEFAULT 0,
    "damagePaid" BOOLEAN NOT NULL DEFAULT false,
    "damageRestored" BOOLEAN NOT NULL DEFAULT false,
    "restoredAt" DATETIME,
    CONSTRAINT "EventItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EventItem" ("eventId", "id", "productId", "quantity", "returnedDamaged", "returnedGood") SELECT "eventId", "id", "productId", "quantity", "returnedDamaged", "returnedGood" FROM "EventItem";
DROP TABLE "EventItem";
ALTER TABLE "new_EventItem" RENAME TO "EventItem";
CREATE UNIQUE INDEX "EventItem_eventId_productId_key" ON "EventItem"("eventId", "productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
