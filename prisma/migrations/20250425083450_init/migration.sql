-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "hallTicket" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "physicsMarks" INTEGER NOT NULL,
    "chemistryMarks" INTEGER NOT NULL,
    "mathMarks" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_hallTicket_key" ON "Student"("hallTicket");
