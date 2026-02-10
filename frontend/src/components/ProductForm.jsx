import { TextInput, Button } from "@mantine/core";
import { useState } from "react";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [vat, setVat] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        unit_price: price,
        vat_rate: vat
      })
    });
    alert("Product added");
  };

  return (
    <>
      <h3>Add Product</h3>
      <TextInput label="Name" onChange={(e) => setName(e.target.value)} />
      <TextInput label="Unit Price" onChange={(e) => setPrice(e.target.value)} />
      <TextInput label="VAT %" onChange={(e) => setVat(e.target.value)} />
      <Button onClick={submit}>Save</Button>
    </>
  );
}
