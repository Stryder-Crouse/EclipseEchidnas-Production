-- CreateTable
CREATE TABLE "Node" (
    "nodeID" VARCHAR(256) NOT NULL,
    "floor" VARCHAR(256) NOT NULL,
    "building" VARCHAR(256) NOT NULL,
    "nodeType" VARCHAR(256) NOT NULL,
    "longName" VARCHAR(256) NOT NULL,
    "shortName" VARCHAR(256) NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "Edge" (
    "edgeID" VARCHAR(256) NOT NULL,
    "startNodeID" VARCHAR(256) NOT NULL,
    "endNodeID" VARCHAR(256) NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("edgeID")
);

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_startNodeID_fkey" FOREIGN KEY ("startNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_endNodeID_fkey" FOREIGN KEY ("endNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
