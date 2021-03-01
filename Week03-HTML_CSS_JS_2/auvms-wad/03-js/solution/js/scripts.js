var data = [
    {
        qty: 1.5,
        description: 'Stock Item Example 0001',
        unitPrice: 1000,
        amount: 1500.0001
    }
]

$(document).ready(function () {
    $('#salesTax').html('1000000');

    $('#addButton').click(function () {
        let qty = prompt('Quantity')
        let d = prompt('Description')
        let up = prompt('Unit Price')
        let amt = prompt('Amount')
        data.push({
            qty: qty,
            description: d,
            unitPrice: up,
            amount: amt
        })

        data.forEach(function (item) {
            let dataRow = `<tr><td>${item.qty}</td><td>${item.description}</td><td>${item.unitPrice}</td><td>${item.amount}</td></tr>`
            console.log({ dataRow })
            $('#dataTable').append(dataRow);
        })
    })
});

