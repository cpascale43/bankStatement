// returns a string name
function setName(x) {
  let names = {
    "1": "John Oliver",
    "2": "Bob Martin",
    "3": "Helena Fernandez",
    "4": "Francesco De Mello",
  };

  let name;
  for (let key in names) {
    if (key === x) {
      name = names[key];
    }
  }
  return name;
}

// removes duplicates from an array
function removeDuplicates(arr) {
  return arr.filter((a, b) => arr.indexOf(a) === b);
}

// returns an array of json objects
async function fetchData(x) {
  let response;
  let data = [];
  for (let i = 0; i < 8; i++) {
    response = await fetch(
      `https://jsonmock.hackerrank.com/api/transactions?userId=${x}&page=${i}`
    );
    res = await response.json();
    res.data.forEach((el) => data.push(el));
  }
  return data;
}

// converts a string dollar amt to number
function dollarStrToNum(x) {
  return parseInt(x.split("").splice(1, x.length).join(""));
}

// converts a number to string dollar amt
async function numToDollarStr(n) {
  let balanceStr = '$'
  let str = await n.toString()
  balanceStr += str

  return balanceStr
}

// calculates total balance of credit & debit txns
async function getBalance(arr) {
  let currBalance = 0;
  await arr.forEach((el) => {
    let amt = dollarStrToNum(el.amount);
    if (el.txnType === "debit") {
      currBalance -= amt;
    } else if (el.txnType === "credit") {
      currBalance += amt;
    }
  });

  return numToDollarStr(currBalance)
}

// converts a UTC timestamp to human date
function convertUTC(time) {
  let dateObject = new Date(time);
  let humanDate = dateObject.toLocaleDateString("en-us", {
    year: "numeric",
    month: "2-digit",
  });
  return humanDate;
}

// creates an object w balance, credits & debits for each month
function getMonthlyTxns(data) {
  let monthObj = {};
  let fecha;
  let credits = 0;
  let debits = 0;

  data.forEach((el) => {
    fecha = convertUTC(el.timestamp);
    monthObj[fecha] = monthObj[fecha] + 1 || 1;
    if (el.txnType === 'credit') {
      credits += dollarStrToNum(el.amount)
    } else if (el.txnType === 'debit') {
      debits += dollarStrToNum(el.amount)
    }
  });

  // filters for txns matching the current key's timestamp
  // grabs that month's balance & store at the matching property
  for (let key in monthObj) {
    let result = getBalance(data.filter(el => convertUTC(el.timestamp) === key))
    monthObj[key] = result
  }

  return {monthObj, credits, debits};
}

// renders cards for every statement month
async function createCards(data) {
  for (let key in data.monthObj) {
    let statement = document.createElement("div");
    statement.className = "statement-card";
    let date = document.createElement("div");
    date.innerHTML = key;
    date.className = "month-year";
    let balance = document.createElement("div");
    balance.innerHTML = await data.monthObj[key];
    balance.className = "monthly-balance";
    let credit = document.createElement("div");
    credit.innerHTML = `Credit: ${data.credits}`;
    credit.className = "monthly-credit";
    let debit = document.createElement("div");
    debit.innerHTML = `Debit: ${data.debits}`;
    debit.className = "monthly-debit";
    statement.appendChild(date);
    statement.appendChild(balance);
    date.appendChild(credit);
    date.appendChild(debit);
    document.getElementById("monthly-statements").appendChild(statement);
  }
}

async function handleClick() {
  var x = document.getElementById("user-select").value;
  document.getElementById("user-name").innerHTML = setName(x);
  let data = await fetchData(x);
  if (data.length !== 0) {
    document.getElementById("loader-view").style.display = "none";
  }
  let balance = await getBalance(data);
  if (balance) document.getElementById("user-balance").innerHTML = balance;

  let txns = getMonthlyTxns(data);
  if (txns) createCards(txns);
}
