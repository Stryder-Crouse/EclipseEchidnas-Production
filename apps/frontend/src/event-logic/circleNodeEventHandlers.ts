/**
 *
 * when one of the locations in the location dropdown is hovered over
 * this function changes the corresponding node on the screen
 * to be bigger
 *
 * */
export function onNodeHover(nodeID: string) {
  const nodeCircle = document.getElementById(nodeID)?.children.item(0);

  if (nodeCircle?.getAttribute("class") == "normalNode") {
    nodeCircle.setAttribute("class", "normalNodeHovered");
  } else if (nodeCircle?.getAttribute("class") == "startSelected") {
    nodeCircle.setAttribute("class", "startSelectedHovered");
  } else if (nodeCircle?.getAttribute("class") == "endSelected") {
    nodeCircle.setAttribute("class", "endSelectedHovered");
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

  if (nodeCircle?.getAttribute("class") == "normalNodeHovered") {
    nodeCircle.setAttribute("class", "normalNode");
  } else if (nodeCircle?.getAttribute("class") == "startSelectedHovered") {
    nodeCircle.setAttribute("class", "startSelected");
  } else if (nodeCircle?.getAttribute("class") == "endSelectedHovered") {
    nodeCircle.setAttribute("class", "endSelected");
  }
}
