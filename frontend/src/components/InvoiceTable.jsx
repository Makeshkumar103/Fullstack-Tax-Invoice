import { Table } from "@mantine/core";
import { useEffect, useState } from "react";

export default function InvoiceTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(setData);
  }, []);

  return (
    <>
      <h3>Invoices</h3>
      <Table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>VAT</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.company}</td>
              <td>{row.product}</td>
              <td>{row.quantity}</td>
              <td>{row.total_price}</td>
              <td>{row.vat_amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
