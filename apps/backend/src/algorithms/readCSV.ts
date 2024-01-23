
import * as fs from "fs";
import {forEach} from "react-bootstrap/ElementChildren";

function readNodeCSV(): Array<node> {

    let nodes: Array<node> = [];

    const allNodesString = fs.readFileSync(".../resources/L1Nodes.csv", "utf-8");


    let linesNodes = allNodesString.split("\n");


    linesNodes.forEach(function (line){
        const nodeValues: string[] = line.split(",");
        // make sure all feilds are there and do a non comprhive check to see if the entry is vaild

        //?? replaces the thing before it with the thing afther if the thing before in null
        if(nodeValues.length == 8 && !isNaN(+(nodeValues.at(1) ?? "a"))) {
            let nodeCoordinate : coordinate ={
                x:+(nodeValues.at(1)?? -1.234), //+ converts to number
                y:+(nodeValues.at(2)?? -1.234), //+ converts to number
            };

            let buildingString = nodeValues.at(4) ?? "UNDEFINED";

            let newNode: node = {
                iD: nodeValues.at(0) as string, //as string get rid of warning (possabily better fix?)
                coordinate: nodeCoordinate,
                floor: nodeValues.at(3) as string
            };
            nodes.push();
        }

    });



    return nodes;


}




