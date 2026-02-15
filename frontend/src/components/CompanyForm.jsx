import {
  TextInput,
  Button,
  Container,
  Paper,
  Stack,
  Group,
  Alert,
  Title,
  Text,
  Box,
} from "@mantine/core";
import { useState } from "react";

export default function CompanyForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!address.trim()) {
      setError("Address is required");
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });

      if (!res.ok) throw new Error("Failed to add company");

      setSuccess("Company added successfully!");
      setName("");
      setAddress("");
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
            🏢 Add Company
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Register a new company to your system
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
          label="Company Name"
          placeholder="Enter company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextInput
          label="Address"
          placeholder="Enter company address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Group justify="flex-end">
          <Button
            onClick={() => {
              setName("");
              setAddress("");
              setError("");
            }}
            variant="light"
          >
            Clear
          </Button>
          <Button onClick={submit} loading={loading}>
            Add Company
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
