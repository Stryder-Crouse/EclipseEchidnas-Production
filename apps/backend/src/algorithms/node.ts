/* TS struct to hold all the data for a node from the CSV */
type node = {
  iD: string;
  coordinate: coordinate;
  floor: string;
  building: Buildings;
  nodeType: NodeType;
  longName: string;
  shortName: string;
  edges: Array<edge>;
};

/* Enum to hold the three possible buildings in the hospital */
enum Buildings {
  B45Francis = "45 Francis",
  Tower = "Tower",
  Shapiro = "Shapiro",
  UNDEFINED = "UNDEFINED",
}

/* Enum to hold all of the possible node types */
enum NodeType {
  CONF = "CONF",
  DEPT = "DEPT",
  HALL = "HALL",
  LABS = "LABS",
  REST = "REST",
  RETL = "RETL",
  SERV = "SERV",
  ELEV = "ELEV",
  EXIT = "EXIT",
  STAI = "STAI",
  UNDEFINED = "UNDEFINED",
}
