let parts = [];

let currentMachine = {
  chassis: null,
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
  const motorResponse = await fetch("data/motors.json");
  const motors = await motorResponse.json();

  const chassisResponse = await fetch("data/chassis.json");
  const chassis = await chassisResponse.json();

  parts = [...motors, ...chassis];

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

  if(selectedPart.category === "シャーシ"){
    currentMachine.chassis = selectedPart;
  }

  if(selectedPart.category === "モーター"){
    currentMachine.motor = selectedPart;
  }

  renderMachine();
  showPage("machine");
}

function getSelectedParts(){
  return Object.values(currentMachine).filter(part => part !== null);
}

function calculateAverage(key){
  const selectedParts = getSelectedParts();

  if(selectedParts.length === 0){
    return 0;
  }

  const total = selectedParts.reduce((sum, part) => {
    return sum + part[key];
  }, 0);

  return Math.round(total / selectedParts.length);
}

function calculateWeight(){
  const selectedParts = getSelectedParts();

  const total = selectedParts.reduce((sum, part) => {
    return sum + part.weight;
  }, 0);

  return total.toFixed(1);
}

function renderMachine(){
  const chassis = currentMachine.chassis;
  const motor = currentMachine.motor;

  document.getElementById("machineChassis").textContent = chassis ? chassis.name : "未選択";
  document.getElementById("machineMotor").textContent = motor ? motor.name : "未選択";

  document.getElementById("machineWeight").textContent = calculateWeight();
  document.getElementById("machineSpeed").textContent = calculateAverage("speed");
  document.getElementById("machineAcceleration").textContent = calculateAverage("acceleration");
  document.getElementById("machineCorner").textContent = calculateAverage("corner");
  document.getElementById("machineBattery").textContent = calculateAverage("battery");
}

document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value;

  const filtered = parts.filter(part => {
    return part.name.includes(keyword) || part.category.includes(keyword);
  });

  renderParts(filtered);
});

loadParts();