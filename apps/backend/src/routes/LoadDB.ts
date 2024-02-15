import { Node } from "../algorithms/Graph/Node.ts";
import { Edge } from "../algorithms/Graph/Edge.ts";
import { readEdgeCSV, readNodeCSV } from "../algorithms/readCSV.ts";
import { Employee, Roles } from "../algorithms/Employee/Employee.ts";
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
import path from "path";
import fs from "fs";
import {
  NodeDataBase,
  nodeToNodeDataBase,
} from "../DataBaseClasses/NodeDataBase.ts";
import {
  EdgeDataBase,
  edgeToEdgeDataBase,
} from "../DataBaseClasses/EdgeDataBase.ts";

//We always know where the file is located, so save the directory's location
const csvLocation_Nodes = path.resolve(
  __dirname,
  "../../resources/nodes.csv",
);
const csvLocation_Edges = path.resolve(
  __dirname,
  "../../resources/edges.csv",
);

//now parse the file and get all the data as a string
const nodeStr = fs.readFileSync(csvLocation_Nodes, "utf-8");
const edgeStr = fs.readFileSync(csvLocation_Edges, "utf-8");

//now we parse the file and organize it into data which Prisma (the tables) can use
const edgeArray: Edge[] = readEdgeCSV(edgeStr);
const nodeArray: Node[] = readNodeCSV(nodeStr);

//convert to db node
const edgeDBArray: EdgeDataBase[] = [];
const nodeDBArray: NodeDataBase[] = [];
//employee test data
const employee1: Employee = {userName:"doctor_smith", lastName:"Smith", firstName:"John", designation: Roles.doctor, isAdmin: true};
const employee2: Employee = {userName:"nurse_davis", lastName:"Davis", firstName:"Emily", designation: Roles.nurse, isAdmin: false};
const employee3: Employee = {userName:"admin_jones", lastName:"Jones", firstName:"Robert", designation: Roles.admin, isAdmin: true};
const employee4: Employee = { userName:"receptionist_wang", lastName:"Wang" , firstName: "Lisa", designation: Roles.janitor, isAdmin: false};
const employee5: Employee = {userName:"doctor_miller", lastName:"Miller", firstName:"Sarah", designation: Roles.doctor, isAdmin: false};
const employee6: Employee = {userName:"nurse_anderson", lastName:"Anderson", firstName:"David", designation: Roles.nurse, isAdmin:false};
const employee7: Employee = {userName:"admin_white", lastName:"White", firstName:"Alice", designation: Roles.admin, isAdmin:true};
const employee8: Employee = {userName:"janitor_harris", lastName:"Harris", firstName:"Michael", designation: Roles.janitor, isAdmin:false};
const employee9: Employee = {userName:"doctor_jackson", lastName:"Jackson", firstName:"Emma", designation: Roles.doctor, isAdmin:false};
const employee10: Employee = {userName:"nurse_brown", lastName:"Brown", firstName:"James", designation: Roles.nurse, isAdmin:false};
const employee11: Employee = {userName:"flower_jackson", lastName:"Jackson", firstName:"Ryan", designation: Roles.flowerDeliverer, isAdmin:false};
const employee12: Employee = {userName:"flower_marsh", lastName:"Marsh", firstName:"Randy", designation: Roles.flowerDeliverer, isAdmin:false};

const employeeArray: Employee[] =
    [employee1, employee2, employee3, employee4, employee5, employee6, employee7, employee8, employee9, employee10, employee11, employee12];

edgeArray.forEach((edge) => {
  const newEdgeDB = edgeToEdgeDataBase(edge);
  edgeDBArray.push(newEdgeDB);
});

nodeArray.forEach((node) => {
  const newNodeDB = nodeToNodeDataBase(node);
  nodeDBArray.push(newNodeDB);
});

//create a function to be called which Initially Populates the Node and Edge DB
export default async function dbInit() {
  try {
    //empty out the Database
    await PrismaClient.$transaction([
      PrismaClient.edgeDB.deleteMany(),
      PrismaClient.medReq.deleteMany(),
      PrismaClient.sanReq.deleteMany(),
      PrismaClient.religiousReq.deleteMany(),
      PrismaClient.outsideTransport.deleteMany(),
      PrismaClient.flowReq.deleteMany(),
      PrismaClient.serviceRequest.deleteMany(),
      PrismaClient.nodeDB.deleteMany(),
      PrismaClient.employee.deleteMany(),
    ]);


    //add in all the Nodes and Edges that are in the above CSV file
    await PrismaClient.nodeDB.createMany({ data: nodeDBArray });
    await PrismaClient.edgeDB.createMany({ data: edgeDBArray });
    await PrismaClient.employee.createMany({data: employeeArray});
  } catch (err) {
    console.log(
      "\n\nWiping DB on Boot Error\n\n",
    );
  }
}
