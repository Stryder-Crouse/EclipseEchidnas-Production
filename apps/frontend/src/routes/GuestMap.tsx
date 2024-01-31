/** importations **/
import React, { useEffect } from "react";
import "../css/MapPage.css";
import { Node } from "../../../backend/src/algorithms/Graph/Node.ts";
import axios from "axios";
import GuestNavBar from "../components/GuestNavBar.tsx";
import { Edge } from "../../../backend/src/algorithms/Graph/Edge.ts";
import ExitButton from "../components/ExitButton.tsx";

let loadedLocations = false;

export default function GuestMap() {
  /**
   *
   * loads nodes into the database
   *
   * */
  async function submitNodes() {
    const data = JSON.stringify({}); //making a JSON format file from input Nodes
    console.log(data);
    //sends a post request the /api/load-db     (server accessing this api)
    try {
      await axios.post("/api/load-nodes", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error("Error with loading Nodes");
    }
  }
  /**
   *
   * loads edges into the database
   *
   * */
  async function submitEdges() {
    const data = JSON.stringify({}); //making a JSON format file from input Nodes
    console.log(data);
    //sends a post request the /api/load-db     (server accessing this api)
    try {
      await axios.post("/api/load-edges", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error("Error with loading Edges");
    }
  }

  //  const Dropdown = () => {
  //  const [showDropdown, setShowDropdown] = useState(false);
  // const [filterValue, setFilterValue] = useState('');

  //const toggleDropdown = () => {
  //setShowDropdown(!showDropdown);
  //};

  // const filterFunction = () => {
  //     const input = filterValue.toUpperCase();
  //     const dropdown = document.getElementById('myDropdown');
  //     const links = dropdown.getElementsByTagName('a');
  //
  //     for (let i = 0; i < links.length; i++) {
  //         const txtValue = links[i].textContent || links[i].innerText;
  //         if (txtValue.toUpperCase().indexOf(input) > -1) {
  //             links[i].style.display = '';
  //         } else {
  //             links[i].style.display = 'none';
  //         }
  //     }
  // };

  useEffect(() => {
    //make sure it only runs once (useEffect is called twice in development)
    if (!loadedLocations) {
      loadedLocations = true;
      submitNodes().then(() => {
        submitEdges().then();
      }); //populates the Node table
      populateLocationDropdown().then();
      //submitEdges().then();
      //submitEdges(); //populates the Edge table
      getNodes().then(); //send a get request to server and received info about all nodes (uncomment to use)
      getEdges().then(); //send a get request to server and received info about all edges
      //set background to floor on component load
      document.body.style.backgroundImage =
        "url(/src/images/01_thefirstfloor.png)";
    }
  }, []);
  return (
    <div>
      <div>
        <GuestNavBar />
      </div>

      <div>
        <ExitButton />
      </div>
    </div>
  );
}

//populate the dropdown with locations on page load

/**
 * This function populates the Dropdown div with the locations represented by nodes.
 * SHOULD ONLY BE RUN ONCE.
 */
async function populateLocationDropdown() {
  //read node file and create the nodes
  const nodes = await getNodes().then();

  //MAKE ALPHABETICAL

  //console.log("nodes");
  //console.log(nodes);
  //fine dropdown div in the html on the page
  const myDropdown = document.getElementById("myDropdown");
  //console.log("myDropdown");
  //console.log(myDropdown);
  //for each node
  nodes.forEach(function (newNode: Node) {
    //create a element
    const row = document.createElement("a");

    //use longName of node as the text content for new a tag
    row.textContent = newNode.longName;

    if (myDropdown == null) {
      return;
    }

    //add new a element to dropdown
    myDropdown.appendChild(row);
  });
}

/**
 *
 * @returns a node array of nodes in the database
 *
 */
async function getNodes() {
  try {
    //MAKE SURE TO PASS THE TYPE axios.get<TYPE> to get the data out correctly
    //the node[] make the data a node array type (axios does the conversion for us)
    const response = await axios.get<Node[]>("/api/load-nodes");
    console.log(response);
    return response.data;
  } catch (err) {
    throw new Error("Error getting Nodes");
  }
}

/**
 *
 *
 * @returns an edge array of nodes in the database
 *
 */
async function getEdges() {
  try {
    const response = await axios.get<Edge[]>("/api/load-edges");
    console.log(response);
    console.log(response.data);
    //create node obj from responses
    //response.data;
  } catch (err) {
    throw new Error("Error getting Edges");
  }
}
