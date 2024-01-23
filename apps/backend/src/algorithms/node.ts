type node = {
    iD : string;
    coordinate : coordinate
    floor: string
    building: Buildings
    nodeType:NodeType
    longName: string
    shortName: string
    edges: Array<edge>

}


type coordinate = {
    x: number
    y: number

}

enum Buildings {
    B45Francis = "45 Francis",
    Tower = "Tower",
    Shapiro ="Shapiro",
    UNDEFINED = "UNDEFIEND"
}

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
    UNDEFINED = "UNDEFIEND"

}
