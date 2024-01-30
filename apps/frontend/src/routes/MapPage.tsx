/** importations **/
import React, { useEffect, useState } from "react";
import "../css/MapPage.css";
import {useNavigate} from "react-router-dom";
import { node } from "../../../backend/src/algorithms/node.ts";
import { readNodeCSV } from "../../../backend/src/algorithms/readCSV.ts";
import axios from "axios";
//import Map from "../components/01_thefirstfloor.png";

let loadedLocations = false;

export default function MapPage() {
  const navigate = useNavigate();

  //this does not work I believe (at least to display the image- Stryder
  const backgroundStyle = {

    /* Add other background properties as needed */
    backgroundSize: "cover" /* Adjust based on your preference */,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh", // Make sure the container takes up the full viewport height
    margin: 0, // Remove default margin to cover the whole page
    display: "flex", // Optional: If you want to center content vertically and horizontally
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    //set background to floor on component load
    document.body.style.backgroundImage =
      "url(/src/images/01_thefirstfloor.png)";
  }, []);

  const Dropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    // const [filterValue, setFilterValue] = useState('');

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

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

    return (
      <div className="dropdown">
          <button onClick={toggleDropdown} className="dropbtn">
              Dropdown
          {/*    <ul>*/}
          {/*        <li><a href="#home">Home</a></li>*/}
          {/*        <li><a href="#news">News</a></li>*/}
          {/*        <li><a href="#contact">Contact</a></li>*/}
          {/*        <li><a href="#about">About</a></li>*/}
          {/*</ul>*/}
      </button>
      <div
          id="myDropdown"
          className={`dropdown-content ${showDropdown ? "show" : ""}`}
      >
          {/*<input*/}
          {/*    type="text"*/}
          {/*    placeholder="Search.."*/}
          {/*    id="myInput"*/}
          {/*    value={filterValue}*/}
          {/*    onChange={(e) => setFilterValue(e.target.value)}*/}
          {/*    onKeyUp={filterFunction}*/}
          {/*/>*/}
        </div>
      </div>

      // <Router>
      //     <div>
      //         <nav>
      //             <ul>
      //                 <li><Link to="/">Home</Link></li>
      //                 <li><Link to="/about">About</Link></li>
      //             </ul>
      //         </nav>
      //
      //         <Route path="/" exact component={Home}/>
      //         <Route path="/about" component={About}/>
      //     </div>
      // </Router>
    );
  };

  //populate the dropdown with locations on page load
  useEffect(() => {
    //make sure it only runs once (useEffect is called twice in development)
    if (!loadedLocations) {
      populateLocationDropdown().then();
      loadedLocations = true;
    }
  }, []);

  return (
    <div style={backgroundStyle}>
      <Dropdown />
      <button
        className={"xout"}
        onClick={() => {
          //make sure locations can be loaded again once we comeback
          loadedLocations = false; //CHANGE TO USESTATE effect (should reset on page load)
          navigate("/");
        }}
      >
        X
      </button>
    </div>
  );
}

/**
 * This function populates the Dropdown div with the locations represented by nodes.
 * SHOULD ONLY BE RUN ONCE.
 */
async function populateLocationDropdown() {
  //read node file and create the nodes
  const nodes: Array<node> = readNodeCSV(await getNodeCSVString());
  //console.log("nodes");
  //console.log(nodes);
  //fine dropdown div in the html on the page
  const myDropdown = document.getElementById("myDropdown");
  //console.log("myDropdown");
  //console.log(myDropdown);
  //for each node
  nodes.forEach(function (newNode: node) {
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
 * request the contents from the CSV node file from the backend as a string
 *
 * @returns a the CSV node files contents as a string
 *
 */
async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCVSFile/CVSnode");

  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}
