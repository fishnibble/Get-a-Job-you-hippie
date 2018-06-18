const table = $("table.data_wide_table tr"); // gets all of the tr in the table
const cost = {
    meal: table[1].innerText,
    cappuccino: table[6].innerText,
    monthlyTransportationPass: table[31].innerText,
    gas: table[35].innerText,
    rent: [table[55].innerText,table[56].innerText,table[57].innerText, table[58].innerText]
}


// EX: "Apartment (3 bedrooms) Outside of Centre	3,298.78 $	2,268.83-5,000.00"
// meal: table[1].innerText.split("$")[0].replace('  ', ':'), => 

function test(data) {
    for (key in data) {
        let temp = data[key].toString().split("$")[0];
        temp = temp.replace(')', '):');
        data[key] = temp;
    }
}

