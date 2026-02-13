import { TextInput, Button } from "@mantine/core";
import { useState } from "react";

/*
 This component creates an ORDER.
 We only need IDs and quantity to keep it simple.
 VAT + total are calculated in the backend.
*/

export default function OrderForm() {
  const [companyId, setCompanyId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const submitOrder = async () => {
    await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        product_id: productId,
        quantity: quantity
      })
    });

    alert("Order created successfully");
  };

  return (
    <>
      <h3>Create Order</h3>

      <TextInput
        label="Company ID"
        placeholder="Example: 1"
        onChange={(e) => setCompanyId(e.target.value)}
      />

      <TextInput
        label="Product ID"
        placeholder="Example: 1"
        onChange={(e) => setProductId(e.target.value)}
      />

      <TextInput
        label="Quantity"
        placeholder="Example: 5"
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Button mt="sm" onClick={submitOrder}>
        Create Order
      </Button>
    </>
  );
}
