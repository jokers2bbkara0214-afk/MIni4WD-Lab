let parts = [];

function showPage(pageId){
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

async function loadParts(){
  const response = await fetch("data/motors.json");
  parts = await response.json();
  renderParts(parts);
}

function renderParts(list){
  const partsList = document.getElementById("partsList");
  partsList.innerHTML = "";

  list.forEach(part => {
    const card = document.createElement("div");
    card.className = "part-card";

    card.innerHTML = `
      <h4>${part.name}</h4>
      <p>ID：${part.id}</p>
      <p>カテゴリ：${part.category}</p>
      <p>重量：${part.weight}g</p>
      <p>最高速：${part.speed}</p>
      <p>加速：${part.acceleration}</p>
      <p>コーナー：${part.corner}</p>
      <p>電池持ち：${part.battery}</p>
    `;

    partsList.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value;

  const filtered = parts.filter(part => {
    return part.name.includes(keyword);
  });

  renderParts(filtered);
});

loadParts();