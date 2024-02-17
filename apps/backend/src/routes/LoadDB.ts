// import { Node } from "../algorithms/Graph/Node.ts";
// import { Edge } from "../algorithms/Graph/Edge.ts";
// import { readEdgeCSV, readNodeCSV } from "../algorithms/readCSV.ts";
// import { Employee, Roles } from "../algorithms/Employee/Employee.ts";
// import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
// import path from "path";
// import fs from "fs";
// import {
//   NodeDataBase,
//   nodeToNodeDataBase,
// } from "../DataBaseClasses/NodeDataBase.ts";
// import {
//   EdgeDataBase,
//   edgeToEdgeDataBase,
// } from "../DataBaseClasses/EdgeDataBase.ts";
//
// //We always know where the file is located, so save the directory's location
// const csvLocation_Nodes = path.resolve(
//   __dirname,
//   "../../resources/nodes.csv",
// );
// const csvLocation_Edges = path.resolve(
//   __dirname,
//   "../../resources/edges.csv",
// );
//
// //now parse the file and get all the data as a string
// const nodeStr = fs.readFileSync(csvLocation_Nodes, "utf-8");
// const edgeStr = fs.readFileSync(csvLocation_Edges, "utf-8");
//
// //now we parse the file and organize it into data which Prisma (the tables) can use
// const edgeArray: Edge[] = readEdgeCSV(edgeStr);
// const nodeArray: Node[] = readNodeCSV(nodeStr);
//
// //convert to db node
// const edgeDBArray: EdgeDataBase[] = [];
// const nodeDBArray: NodeDataBase[] = [];
// //employee test data
// const employee1: Employee = {userName:"doctor_smith", lastName:"Smith", firstName:"John", designation: Roles.doctor, isAdmin: true};
// const employee2: Employee = {userName:"nurse_davis", lastName:"Davis", firstName:"Emily", designation: Roles.nurse, isAdmin: false};
// const employee3: Employee = {userName:"admin_jones", lastName:"Jones", firstName:"Robert", designation: Roles.admin, isAdmin: true};
// const employee4: Employee = { userName:"receptionist_wang", lastName:"Wang" , firstName: "Lisa", designation: Roles.janitor, isAdmin: false};
// const employee5: Employee = {userName:"doctor_miller", lastName:"Miller", firstName:"Sarah", designation: Roles.doctor, isAdmin: false};
// const employee6: Employee = {userName:"nurse_anderson", lastName:"Anderson", firstName:"David", designation: Roles.nurse, isAdmin:false};
// const employee7: Employee = {userName:"admin_white", lastName:"White", firstName:"Alice", designation: Roles.admin, isAdmin:true};
// const employee8: Employee = {userName:"janitor_harris", lastName:"Harris", firstName:"Michael", designation: Roles.janitor, isAdmin:false};
// const employee9: Employee = {userName:"doctor_jackson", lastName:"Jackson", firstName:"Emma", designation: Roles.doctor, isAdmin:false};
// const employee10: Employee = {userName:"nurse_brown", lastName:"Brown", firstName:"James", designation: Roles.nurse, isAdmin:false};
// const employee11: Employee = {userName:"flower_jackson", lastName:"Jackson", firstName:"Ryan", designation: Roles.flowerDeliverer, isAdmin:false};
// const employee12: Employee = {userName:"flower_marsh", lastName:"Marsh", firstName:"Randy", designation: Roles.flowerDeliverer, isAdmin:false};
//export enum Roles {
//     nurse = "nurse",
//     doctor = "doctor",
//     admin = "administrator",
//     janitor = "janitor",
//     flowerDeliverer = "flower deliverer",
//     religiousPersonnel = "religious personnel",
//     buddhistPersonnel = "Buddhist personnel",
//     catholicPersonnel = "Catholic personnel",
//     mormonPersonnel = "Mormon personnel",
//     christianPersonnel = "Christian (non-denominational) personnel",
//     protestantPersonnel = "Protestant personnel",
//     hinduPersonnel = "Hindu personnel",
//     muslimPersonnel = "Muslim personnel",
//     jainPersonnel = "Jain personnel",
//     jewishPersonnel = "Jewish personnel",
//     sikhPersonnel = "Sikh personnel",
//     shintoPersonnel = "Shinto personnel",
//     //nurse_and_flower_deliverer = "nurse and flower deliverer"
// }
// const employee1: Employee = {userName:"doctor_smith", lastName:"Smith", firstName:"John", designation: Roles.doctor, isAdmin: true};
// const employee2: Employee = {userName:"nurse_davis", lastName:"Davis", firstName:"Emily", designation: Roles.nurse, isAdmin: false};
// const employee3: Employee = {userName:"admin_jones", lastName:"Jones", firstName:"Robert", designation: Roles.admin, isAdmin: true};
// const employee4: Employee = { userName:"janitor_wang", lastName:"Wang" , firstName: "Lisa", designation: Roles.janitor, isAdmin: false};
// const employee5: Employee = {userName:"doctor_miller", lastName:"Miller", firstName:"Sarah", designation: Roles.doctor, isAdmin: false};
// const employee6: Employee = {userName:"nurse_anderson", lastName:"Anderson", firstName:"David", designation: Roles.nurse, isAdmin:false};
// const employee7: Employee = {userName:"admin_white", lastName:"White", firstName:"Alice", designation: Roles.admin, isAdmin:true};
// const employee8: Employee = {userName:"janitor_harris", lastName:"Harris", firstName:"Michael", designation: Roles.janitor, isAdmin:false};
// const employee9: Employee = {userName:"doctor_jackson", lastName:"Jackson", firstName:"Emma", designation: Roles.doctor, isAdmin:false};
// const employee10: Employee = {userName:"nurse_brown", lastName:"Brown", firstName:"James", designation: Roles.nurse, isAdmin:false};
// const employee11: Employee = {userName:"flower_jackson", lastName:"Jackson", firstName:"Ryan", designation: Roles.flowerDeliverer, isAdmin:false};
// const employee12: Employee = {userName:"flower_marsh", lastName:"Marsh", firstName:"Randy", designation: Roles.flowerDeliverer, isAdmin:false};
// const employee13: Employee = {userName:"relig_ramírez", lastName:"Ramírez", firstName:"Reed", designation: Roles.religiousPersonnel, isAdmin:false};
// const employee14: Employee = {userName:"buddhist_lykke", lastName:"Lykke", firstName:"Jan", designation: Roles.buddhistPersonnel, isAdmin:false};
// const employee15: Employee = {userName:"catholic_linwood", lastName:"Linwood", firstName:"Nathanael", designation: Roles.catholicPersonnel, isAdmin:false};
// const employee16: Employee = {userName:"mormon_otieno", lastName:"Otieno", firstName:"Faisal", designation: Roles.mormonPersonnel, isAdmin:false};
// const employee17: Employee = {userName:"christian_calabrese", lastName:"Calabrese", firstName:"Gaston", designation: Roles.christianPersonnel, isAdmin:false};
// const employee18: Employee = {userName:"protestant_rao", lastName:"Rao", firstName:"Dimitra", designation: Roles.protestantPersonnel, isAdmin:false};
// const employee19: Employee = {userName:"hindu_amantea", lastName:"Amantea", firstName:"Jagadish", designation: Roles.hinduPersonnel, isAdmin:false};
// const employee20: Employee = {userName:"muslim_samara", lastName:"Samara", firstName:"Nazeer", designation: Roles.muslimPersonnel, isAdmin:false};
// const employee21: Employee = {userName:"jain_burnett", lastName:"Burnett", firstName:"Anand", designation: Roles.jainPersonnel, isAdmin:false};
// const employee22: Employee = {userName:"jewish_linna", lastName:"Linna", firstName:"Suzanne", designation: Roles.jewishPersonnel, isAdmin:false};
// const employee23: Employee = {userName:"sikh_sharma", lastName:"Sharma", firstName:"Abhay", designation: Roles.sikhPersonnel, isAdmin:false};
// const employee24: Employee = {userName:"shinto_yoshinaga", lastName:"Yoshinaga", firstName:"Moriko", designation: Roles.shintoPersonnel, isAdmin:false};
//
// const employeeArray: Employee[] =
//     [employee1, employee2, employee3, employee4, employee5, employee6, employee7, employee8, employee9, employee10,
//         employee11, employee12, employee13, employee14, employee15, employee16, employee17, employee18, employee19,
//         employee20, employee21, employee22, employee23, employee24];

// edgeArray.forEach((edge) => {
//   const newEdgeDB = edgeToEdgeDataBase(edge);
//   edgeDBArray.push(newEdgeDB);
// });
//
// nodeArray.forEach((node) => {
//   const newNodeDB = nodeToNodeDataBase(node);
//   nodeDBArray.push(newNodeDB);
// });
//
// //create a function to be called which Initially Populates the Node and Edge DB
// export default async function dbInit() {
//   try {
//     //empty out the Database
//     await PrismaClient.$transaction([
//       PrismaClient.edgeDB.deleteMany(),
//       PrismaClient.medReq.deleteMany(),
//       PrismaClient.sanReq.deleteMany(),
//       PrismaClient.religiousReq.deleteMany(),
//       PrismaClient.outsideTransport.deleteMany(),
//       PrismaClient.flowReq.deleteMany(),
//       PrismaClient.serviceRequest.deleteMany(),
//       PrismaClient.nodeDB.deleteMany(),
//       PrismaClient.employee.deleteMany(),
//     ]);
//
//
//     //add in all the Nodes and Edges that are in the above CSV file
//     await PrismaClient.nodeDB.createMany({ data: nodeDBArray });
//     await PrismaClient.edgeDB.createMany({ data: edgeDBArray });
//     await PrismaClient.employee.createMany({data: employeeArray});
//   } catch (err) {
//     console.log(
//       "\n\nWiping DB on Boot Error\n\n",
//     );
//   }
// }
