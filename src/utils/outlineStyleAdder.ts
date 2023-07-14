export function setOutline(elem: HTMLElement) {
  elem.style.outlineStyle = "solid";
  elem.style.outlineColor = "white";
  elem.style.outlineWidth = "4px";
  elem.style.outlineOffset = "5px";
}

export function removeOutline(elem: HTMLElement) {
  elem.style.outlineStyle = "none";
  elem.style.outlineColor = "white";
  elem.style.outlineWidth = "0px";
  elem.style.outlineOffset = "0px";
}
