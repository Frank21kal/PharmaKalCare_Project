const user = requireAuth();
const message = document.getElementById("message");
if (user) {
  if (user.role !== "Cashier") document.querySelector("[data-dashboard-stats]").hidden = false;
  loadDashboard();
}

async function loadDashboard() {
  try {
    const requests = [api("/medicines/low-stock"), api("/medicines/expiring"), api("/dashboard/top-medicines"), api("/sales")];
    if (user.role !== "Cashier") requests.push(api("/dashboard"));
    const [lowStock, expiring, top, sales, stats] = await Promise.all(requests);
    if (stats) {
      document.getElementById("totalMedicines").textContent = stats.totalMedicines;
      document.getElementById("totalSales").textContent = stats.totalSales;
      document.getElementById("revenue").textContent = Number(stats.revenue).toFixed(2);
      document.getElementById("lowStock").textContent = stats.lowStock;
    }
    renderMedicineList("lowStockList", lowStock, m => `${m.name} · ${m.quantity} remaining`, "All medicines are stocked above the low-stock threshold.");
    renderMedicineList("expiryList", expiring, m => `${m.name} · expires ${new Date(m.expiryDate).toLocaleDateString()}`, "No medicines are due to expire in the next 30 days.");
    const topList = document.getElementById("topMedicinesList");
    topList.replaceChildren();
    if (!top.length) topList.innerHTML = "<li class='empty-state'>No sales recorded yet.</li>";
    top.forEach(m => { const li = document.createElement("li"); li.textContent = `${m._id} · ${m.totalSold} units`; topList.append(li); });
    const table = document.getElementById("salesTable");
    table.replaceChildren();
    if (!sales.length) { const tr = document.createElement("tr"), td = document.createElement("td"); td.colSpan = 4; td.textContent = "No sales recorded yet."; tr.append(td); table.append(tr); }
    sales.slice(0, 10).forEach(s => { const tr = document.createElement("tr");[s.medicineName, s.quantitySold, Number(s.totalPrice).toFixed(2), s.soldBy].forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.append(td); }); table.append(tr); });
  } catch (error) { showMessage(message, error.message, true); }
}

function renderMedicineList(id, medicines, format, emptyText) {
  const list = document.getElementById(id); list.replaceChildren();
  if (!medicines.length) { const p = document.createElement("p"); p.className = "empty-state"; p.textContent = emptyText; list.append(p); return; }
  medicines.forEach(m => { const row = document.createElement("div"); row.className = "dashboard-list-row"; row.textContent = format(m); list.append(row); });
}

