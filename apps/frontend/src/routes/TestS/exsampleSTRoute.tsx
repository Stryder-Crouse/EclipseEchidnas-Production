import React, { useEffect } from "react";
import { ExampleComponentStryderNode } from "../../components/TestS/ExampleComponentStryderNode.tsx";
import { ExampleComponentStryderEdge } from "../../components/TestS/ExampleComponentStryderEdge.tsx";
import { MapExample } from "../../components/TestS/exampleMap.tsx";

//stryders test element
export default function Stryderstestroute() {
  useEffect(() => {
    //set background to floor on component load
    document.body.style.backgroundImage = "none";
  }, []);
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">
      <h1>SUPMAN.</h1>
      <MapExample></MapExample>
      <ExampleComponentStryderNode></ExampleComponentStryderNode>
      <ExampleComponentStryderEdge></ExampleComponentStryderEdge>
    </div>
  );
}
