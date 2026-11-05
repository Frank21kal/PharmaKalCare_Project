let medicines = [
  {
    name: "Paracetamol",
    quantity: 100,
    price: 20,
    expiry: "2027-01-01"
  },

  {
    name: "Amoxicillin",
    quantity: 50,
    price: 30,
    expiry: "2026-10-15"
  }
];

const table = document.getElementById("inventoryTable");

function displayMedicines(data) {

  table.innerHTML = "";

  data.forEach((medicine, index) => {

    table.innerHTML += `

      <tr>

        <td>${medicine.name}</td>

        <td>${medicine.quantity}</td>

        <td>$${medicine.price}</td>

        <td>${medicine.expiry}</td>

        <td>

          <button
          class="btn btn-sm btn-warning"
          onclick="editMedicine(${index})">

          Edit

          </button>

          <button
          class="btn btn-sm btn-danger"
          onclick="deleteMedicine(${index})">

          Delete

          </button>

        </td>

      </tr>

    `;
  });
}

displayMedicines(medicines);

document.getElementById("medicineForm").addEventListener("submit", function (e) {

  e.preventDefault();

  const medicine = {

    name:
      document.getElementById("name").value,

    quantity:
      document.getElementById("quantity").value,

    price:
      document.getElementById("price").value,

    expiry:
      document.getElementById("expiry").value

  };

  medicines.push(medicine);

  displayMedicines(medicines);

  this.reset();

});

function deleteMedicine(index) {

  medicines.splice(index, 1);

  displayMedicines(medicines);
}

function editMedicine(index) {

  alert(
    "Edit feature coming soon"
  );
}

document.getElementById("search").addEventListener("input", function () {

  const value =
    this.value.toLowerCase();

  const filtered =
    medicines.filter(medicine =>
      medicine.name
        .toLowerCase()
        .includes(value)
    );

  displayMedicines(filtered);

});