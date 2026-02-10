import { TextInput, Button } from "@mantine/core";
import { useState } from "react";

export default function CompanyForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5000/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address })
    });
    alert("Company added");
  };

  return (
    <>
      <h3>Add Company</h3>
      <TextInput label="Name" onChange={(e) => setName(e.target.value)} />
      <TextInput label="Address" onChange={(e) => setAddress(e.target.value)} />
      <Button onClick={submit}>Save</Button>
    </>
  );
}
