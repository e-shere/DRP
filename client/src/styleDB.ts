import Style from "./style";

async function getDbStyle(): Promise<Style> {
  const res = await fetch("/getall");
  const data = await res.json();
  console.log(JSON.stringify(data));
  return JSON.parse(data);
}

function setDbStyle(style: Style) {
  fetch("/set", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ data: style, }),
  })
    .then(res => res.json())
    .catch(() => console.log("Error when posting style"));
}

export { getDbStyle, setDbStyle };