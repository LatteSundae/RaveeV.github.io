import React, { useState } from 'react';
import logo from './logo.svg';
import CompanyInfo from './CompanyInfo'
import './App.css';

function App() {
  const [keyword, setKeyword] = useState("")  // Hook
  
  var customerData = {
    name: "Angelling",
    address: {
      street: "99/9 Mahanakhon Building",
      province: "Bangkok",
      zipCode: "12120"
    },
    phone: "022-222-2222"
  }

  var sellerData = {
    name: "You Can't See Me",
    address: {
      street: "123 Cina St.",
      province: "Bangkok",
      zipCode: "100000"
    },
    phone: "085-999-9876"
  }

  var salesData = [
    {name: "Sony Ps5 Digital Edition", unitPrice: 13369, qty: 2},
    {name: "NSW Nintendo Switch V2", unitPrice: 11290, qty: 1},
    {name: "Microsoftsoft Xbox Series X", unitPrice: 20168, qty: 1},
    {name: "MSI Notebook GL65 Leopard", unitPrice: 36900, qty: 2},
  ]

  // Build JSX from array
  // Method 1 (basic)
  // var itemList = []
  // salesData.forEach((v, i) => {
  //   itemList.push(
  //     <tr>
  //       <td>{i + 1}</td>
  //       <td>{v.name}</td>
  //       <td>{v.unitPrice}</td>
  //       <td>{v.qty}</td>
  //       <td>{v.unitPrice * v.qty}</td>
  //     </tr>
  //   )
  //   // NO RETURN
  // })

  // Method 2 (best practise)
  // var keyword = "";  // replaced as a state
  var filteredSalesData = salesData.filter(v => v.name.includes(keyword))
  var itemList = filteredSalesData.map((v, i) => {
    return (
      <tr>
        <td>{i + 1}</td>
        <td>{v.name}</td>
        <td>{v.unitPrice}</td>
        <td>{v.qty}</td>
        <td>{v.unitPrice * v.qty}</td>
      </tr>
    )
  })

  var totalAmount = salesData.reduce((pv, v) => pv + v.qty * v.unitPrice, 0)
  var totalQty = salesData.reduce((pv, v) => pv + v.qty, 0)

  const handleOnChange = (e) => {
    console.log(e.target.value)
    // keyword = e.target.value
    setKeyword(e.target.value)
  }

  return (
    <div className="App">
      <h1>Quotation</h1>
      <table width="100%">
        <tr>
          <td>
            <CompanyInfo data={customerData} />
          </td>
          <td>
            <CompanyInfo data={sellerData} />
          </td>
        </tr>
      </table>

{/* Searchbox area */}
Keyword: <input type="text" onChange={handleOnChange} />
      <table className="detailTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {itemList}
        </tbody>
      </table>
      <h2>Total Amount: {totalAmount.toFixed(2)} Baht</h2>
      <h2>Total Qty: {totalQty} items</h2>
    </div>
  );
}

export default App;
