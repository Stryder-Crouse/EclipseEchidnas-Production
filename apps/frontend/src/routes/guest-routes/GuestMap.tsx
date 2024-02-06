/** importations **/
import React from "react";

import GuestNavBar from "../../components/navigation-bar/GuestNavBar.tsx";

//import ExitButton from "../../components/buttons/ExitButton.tsx";
import { Map } from "../../components/map/Map.tsx";

export default function GuestMap() {
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

  return (
    <div>
      <div>
        <GuestNavBar />
      </div>
      <div className={"mapDiv"}>
        <Map />
      </div>
    </div>
  );
}
