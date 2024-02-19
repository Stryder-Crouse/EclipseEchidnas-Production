/**
 *
 * when one of the locations in the location dropdown is hovered over
 * this function changes the corresponding node on the screen
 * to be bigger
 *
 * */
export function onNodeHover(nodeID: string) {
    const nodeCircle = document.getElementById(nodeID)?.children.item(0);

    const nodeInfoSVG = document.getElementById("nodeInfo_" + nodeID);
    const nodeInfo = nodeInfoSVG!.children.item(0);

    const nodeServiceInfoSVG = document.getElementById("nodeService_" + nodeID);
    const nodeServiceInfo = nodeServiceInfoSVG!.children.item(0);

    //if node is not toggled to perminate then show info
    if (nodeInfo!.getAttribute("class") != "spanNodeInfoVisiblePermanent") {
        nodeInfoSVG?.setAttribute("class", "foreignObjectNodeVisible");
        nodeInfo?.setAttribute("class", "spanNodeInfoVisible");
        nodeServiceInfoSVG?.setAttribute("class", "foreignObjectNodeVisible");
        nodeServiceInfo?.setAttribute("class", "spanNodeInfoVisible");
    }

    if (nodeCircle?.getAttribute("class") == "normalNode") {
        nodeCircle.setAttribute("class", "normalNodeHovered");
    } else if (nodeCircle?.getAttribute("class") == "startSelected") {
        nodeCircle.setAttribute("class", "startSelectedHovered");
    } else if (nodeCircle?.getAttribute("class") == "endSelected") {
        nodeCircle.setAttribute("class", "endSelectedHovered");
    } else if (nodeCircle?.getAttribute("class") == "transitionNode") {
        nodeCircle.setAttribute("class", "transitionNodeHovered");
    } else if (nodeCircle?.getAttribute("class") == "hallwayNodeVisible") {
        nodeCircle.setAttribute("class", "hallwayNodeVisibleHovered");
    }

}

/**
 *
 * when one of the locations in the location dropdown de hovered
 * this function changes the corresponding node on the screen back
 * to its normal size
 *
 * */
export function onNodeLeave(nodeID: string) {
    const nodeCircle = document.getElementById(nodeID)?.children.item(0);

    const nodeInfoSVG = document.getElementById("nodeInfo_" + nodeID);
    const nodeInfo = nodeInfoSVG!.children.item(0);

    const nodeServiceInfoSVG = document.getElementById("nodeService_" + nodeID);
    const nodeServiceInfo = nodeServiceInfoSVG!.children.item(0);

    //only rehide info if info is not toggled to be perminate
    if (nodeInfo!.getAttribute("class") != "spanNodeInfoVisiblePermanent") {
        nodeInfoSVG?.setAttribute("class", "foreignObjectNode");
        nodeInfo?.setAttribute("class", "spanNodeInfo");
        nodeServiceInfoSVG?.setAttribute("class", "foreignObjectNode");
        nodeServiceInfo?.setAttribute("class", "spanNodeInfo");
    }


    if (nodeCircle?.getAttribute("class") == "normalNodeHovered") {
        nodeCircle.setAttribute("class", "normalNode");
    } else if (nodeCircle?.getAttribute("class") == "startSelectedHovered") {
        nodeCircle.setAttribute("class", "startSelected");
    } else if (nodeCircle?.getAttribute("class") == "endSelectedHovered") {
        nodeCircle.setAttribute("class", "endSelected");
    } else if (nodeCircle?.getAttribute("class") == "transitionNodeHovered") {
        nodeCircle.setAttribute("class", "transitionNode");
    } else if (nodeCircle?.getAttribute("class") == "hallwayNodeVisibleHovered") {
        nodeCircle.setAttribute("class", "hallwayNodeVisible");
    }
}


/**
 *
 * when one of the locations in the location dropdown is right clicked hide or unhide
 * node info and node service requests
 *
 * */
export function onNodeRightClick(nodeID: string) {

    const nodeInfoSVG = document.getElementById("nodeInfo_" + nodeID);
    const nodeInfo = nodeInfoSVG!.children.item(0);

    const nodeServiceInfoSVG = document.getElementById("nodeService_" + nodeID);
    const nodeServiceInfo = nodeServiceInfoSVG!.children.item(0);



    //if node info is already toggled to Permanent hide it
    if (nodeInfo!.getAttribute("class") == "spanNodeInfoVisiblePermanent") {
        nodeInfoSVG?.setAttribute("class", "foreignObjectNode");
        nodeInfo?.setAttribute("class", "spanNodeInfo");
        nodeServiceInfoSVG?.setAttribute("class", "foreignObjectNode");
        nodeServiceInfo?.setAttribute("class", "spanNodeInfo");
    }
    //else set to Permanent
    else {
        console.log("fired");
        nodeInfo?.setAttribute("class", "spanNodeInfoVisiblePermanent");
        nodeServiceInfo?.setAttribute("class", "spanNodeInfoVisiblePermanent");
    }


}


