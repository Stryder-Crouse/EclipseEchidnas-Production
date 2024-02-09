import React from "react";
import "./testServicePage.css";
//from https://github.com/frontend-joe/react-widgets
export default function ServiceRequest() {




    // useEffect(() => {
    //
    //
    // }, []);

    return (
        <div className="tabs-container">
            <ul className="tabs">
                <li>
                    <a id="tab1" title="Analytics" href="#tab1" className={"tabButton"}>
                        Medicine
                    </a>
                </li>
                <li>
                    <a id="tab2" title="Reports" href="#tab2" className={"tabButton"}>
                        Transport
                    </a>
                </li>
                <li>
                    <a id="tab3" title="Performance" href="#tab3" className={"tabButton"}>
                        Flower
                    </a>
                </li>
                <li>
                    <a id="tab4" title="Funds" href="#tab4" className={"tabButton"}>
                        Religious
                    </a>
                </li>
                <li>
                    <a id="tab5" title="Audio/Visual" href="#tab5" className={"tabButton"}>
                        Audio/Visual
                    </a>
                </li>
            </ul>
            <div className="tab-content-wrapper">

            </div>
        </div>
    );
}
