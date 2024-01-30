/** importations **/
import React from "react";
import "../css/MapPage.css";
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar.tsx";

export default function MapPage() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   //set background to floor on component load
  //   document.body.style.backgroundImage =
  //     "url(/src/images/01_thefirstfloor.png)";
  // }, []);

  return (
      <div>

          <div>

              <NavBar/>
          </div>

          <div className={"body"}>

          </div>

          <div>

              <button
                  className={"xout"}
                  onClick={() => {
                      navigate("/");
                  }}
              >
                  X
              </button>
          </div>
      </div>

  );
};

