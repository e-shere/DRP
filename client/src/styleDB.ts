import Style from "./style";

function getStyle(): Promise<Style> {
  return fetch("/getall")
    .then(res => res.json())
    .then(data => {
      console.log(JSON.stringify(data));
      return JSON.parse(data);
    });
}

function setStyle(style: Style) {
  fetch("/set", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ data: style, }),
  })
    .then(res => res.json())
    .catch(() => console.log("Error when posting style"));
}

export { getStyle, setStyle };