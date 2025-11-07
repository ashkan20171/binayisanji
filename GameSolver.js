const container = document.getElementsByClassName("gridContainer")[0];

const rows = container.children;



setInterval(() => {
const colors = Array();
const counter = Array();
const colorIndexes = Array();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.children;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      console.log(cell);
      const color = cell.style.backgroundColor;
      if (colors.includes(color)) {
        counter[colors.indexOf(color)]++;
        colorIndexes[colors.indexOf(color)] = `${i},${j}`;
      } else {
        colors.push(color);
        counter.push(1)
        colorIndexes.push(`${i},${j}`)
      }
    }
  }

  console.log(colors);
  console.log(counter);
  console.log(colorIndexes);

  if (counter.length !== 2) {
    throw  new Error("یه مشکلی هست")
  }

  if (counter[0] > counter[1]) {
    clickOnCell(colorIndexes[1])
  } else
    clickOnCell(colorIndexes[0])
}, 500)


function clickOnCell(ij) {
  const i = ij.split(",")[0];
  const j = ij.split(",")[1];
  rows[i].children[j].click();
  console.log(i, j)
}


