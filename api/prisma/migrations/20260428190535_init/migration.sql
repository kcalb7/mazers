-- CreateTable
CREATE TABLE "mazes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alias" TEXT,
    "rows" INTEGER NOT NULL,
    "cols" INTEGER NOT NULL,
    "tile_size" INTEGER NOT NULL DEFAULT 40,
    "entrances" INTEGER NOT NULL DEFAULT 1,
    "exits" INTEGER NOT NULL DEFAULT 1,
    "grid" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mazes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mazes_alias_idx" ON "mazes"("alias");

-- CreateIndex
CREATE INDEX "mazes_created_at_idx" ON "mazes"("created_at" DESC);
