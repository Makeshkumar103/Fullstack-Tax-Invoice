import {
  TextInput,
  NumberInput,
  Button,
  Paper,
  Stack,
  Group,
  Alert,
  Title,
  Text,
  Box,
} from "@mantine/core";
import { useState } from "react";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [vat, setVat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!price || price <= 0) {
      setError("Unit price must be greater than 0");
      return false;
    }
    if (!vat || vat < 0 || vat > 100) {
      setError("VAT must be between 0 and 100");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          unit_price: parseFloat(price),
          vat_rate: parseFloat(vat),
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      setSuccess("Product added successfully!");
      setName("");
      setPrice("");
      setVat("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Box>
          <Title order={3} size="h3" fw={700}>
            📦 Add Product
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Add a new product to your inventory
          </Text>
        </Box>

        {error && (
          <Alert title="Error" color="red">
            {error}
          </Alert>
        )}

        {success && (
          <Alert title="Success" color="green" bg="green.0">
            {success}
          </Alert>
        )}

        <TextInput
          label="Product Name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <NumberInput
          label="Unit Price ($)"
          placeholder="Enter unit price"
          value={price}
          onChange={setPrice}
          min={0}
          step={0.01}
          decimalScale={2}
          required
        />

        <NumberInput
          label="VAT Rate (%)"
          placeholder="Enter VAT percentage"
          value={vat}
          onChange={setVat}
          min={0}
          max={100}
          step={0.5}
          decimalScale={2}
          required
        />

        <Group justify="flex-end">
          <Button
            onClick={() => {
              setName("");
              setPrice("");
              setVat("");
              setError("");
            }}
            variant="light"
          >
            Clear
          </Button>
          <Button onClick={submit} loading={loading}>
            Add Product
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
