let parts = [];
let currentMachine = {
  motor: null
};

function showPage(pageId){
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if(pageId === "machine"){
    renderMachine();
  }
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
      <button class="add-button" onclick="addToMachine('${part.id}')">
        ＋ マシンへ追加
      </button>
    `;

    partsList.appendChild(card);
  });
}

function addToMachine(partId){
  const selectedPart = parts.find(part => part.id === partId);

  if(!selectedPart) return;

  currentMachine.motor = selectedPart;

  renderMachine();
  showPage("machine");
}

function renderMachine(){
  const motor = currentMachine.motor;

  document.getElementById("machineMotor").textContent = motor ? motor.name : "未選択";
  document.getElementById("machineWeight").textContent = motor ? motor.weight.toFixed(1) : "0";
  document.getElementById("machineSpeed").textContent = motor ? motor.speed : "0";
  document.getElementById("machineAcceleration").textContent = motor ? motor.acceleration : "0";
  document.getElementById("machineCorner").textContent = motor ? motor.corner : "0";
  document.getElementById("machineBattery").textContent = motor ? motor.battery : "0";
}

document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value;

  const filtered = parts.filter(part => {
    return part.name.includes(keyword);
  });

  renderParts(filtered);
});

loadParts();