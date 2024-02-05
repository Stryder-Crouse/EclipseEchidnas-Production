-- CreateTable
CREATE TABLE "HighScore" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "HighScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "reqID" INTEGER NOT NULL,
    "reqType" VARCHAR(256) NOT NULL,
    "reqLocationID" VARCHAR(256) NOT NULL,
    "extraInfo" VARCHAR(256) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("reqID")
);

-- CreateTable
CREATE TABLE "MedReq" (
    "medReqID" INTEGER NOT NULL,
    "medType" VARCHAR(256) NOT NULL,
    "dosage" VARCHAR(256) NOT NULL,
    "numDoses" INTEGER NOT NULL,
    "requestID" INTEGER NOT NULL,

    CONSTRAINT "MedReq_pkey" PRIMARY KEY ("medReqID")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedReq_requestID_key" ON "MedReq"("requestID");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_reqLocationID_fkey" FOREIGN KEY ("reqLocationID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedReq" ADD CONSTRAINT "MedReq_requestID_fkey" FOREIGN KEY ("requestID") REFERENCES "Request"("reqID") ON DELETE RESTRICT ON UPDATE CASCADE;
