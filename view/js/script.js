let names = {
  "1": "John Oliver",
  "2": "Bob Martin",
  "3": "Helena Fernandez",
  "4": "Francesco De Mello",
};

function handleClick() {
  var x = document.getElementById("user-select").value;
  let name;
  for (let key in names) {
    if (key === x) {
      name = names[key];
    }
  }
  document.getElementById("user-name").innerHTML = name;
  for (let i = 0; i <= 8; i++) {
    fetch(
      `https://jsonmock.hackerrank.com/api/transactions?userId=${x}&page=${i}`
    )
      .then(function (response) {
        // The API call was successful!
        document.getElementById("loader-view").style.display = "none";
        return response.json();
      })
      .then(function (res) {
        // This is the JSON from our response
        res.data.forEach((el) => {
          let currBalance = 0;
          let credits = 0;
          let debits = 0;
          let dateObject = new Date(el.timestamp)
          let humanFormat = dateObject.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
          });

          let amt = el.amount.split("").splice(1, el.amount.length).join("");
          if (!isNaN(amt)) {
            if (el.txnType === "debit") {
              currBalance -= amt;
              debits += amt;
            }
            if (el.txnType === "credit") {
              currBalance += amt;
              credits += amt;
            }
            document.getElementById("user-balance").innerHTML = currBalance;
          }
          let statement = document.createElement("div");
          statement.className = "statement-card";
          let month = document.createTextNode(`${humanFormat}`);
          let credit = document.createTextNode(`Credit: ${credits}`);
          let debit = document.createTextNode(`Debit: ${debits}`);
          statement.appendChild(month);
          statement.appendChild(credit);
          statement.appendChild(debit);
          document.getElementById("monthly-statements").appendChild(statement);
        });
      })
      .catch(function (err) {
        // There was an error
        console.warn("Something went wrong.", err);
      });
  }
}
