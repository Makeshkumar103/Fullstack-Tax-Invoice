import {
  Select,
  Button,
  Container,
  Paper,
  Stack,
  Group,
  NumberInput,
  Alert,
  Card,
  Badge,
  Grid,
  Title,
  Text,
  Divider,
  Box,
} from "@mantine/core";
import { useState } from "react";

export default function OrderForm2() {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lazy-load list options when dropdown opens
  const handleCompanyOpen = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/companies");
      if (!res.ok) throw new Error("Failed to load companies");
      const data = await res.json();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load companies");
    }
  };

  const handleProductOpen = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts((data || []).map(p => ({
        ...p,
        unit_price: parseFloat(p.unit_price),
        vat_rate: parseFloat(p.vat_rate)
      })));
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    }
  };

  // When an item is selected fetch its full details and ensure it's in the list
  const handleCompanySelect = async (value) => {
    setSelectedCompany(value);
    setError("");
    // if (!value) return;
    // try {
    //   const res = await fetch(`http://localhost:5000/companies/${value}`);
    //   if (!res.ok) throw new Error("Failed to load company");
    //   const data = await res.json();
    //   // add to list if missing
    //   if (!companies.find(c => c.id === data.id)) {
    //     setCompanies(prev => [...prev, data]);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setError("Failed to load company details");
    // }
  };

  const handleProductSelect = async (value) => {
    setSelectedProduct(value);
    setError("");
    if (!value) return;
    try {
      const res = await fetch(`http://localhost:5000/products/${value}`);
      if (!res.ok) throw new Error("Failed to load product");
      const data = await res.json();
      const parsed = { ...data, unit_price: parseFloat(data.unit_price), vat_rate: parseFloat(data.vat_rate) };
      if (!products.find(p => p.id === parsed.id)) {
        setProducts(prev => [...prev, parsed]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product details");
    }
  };

  // Get selected company and product from the lists
  const company = companies.find(c => c.id.toString() === selectedCompany) || null;
  const product = products.find(p => p.id.toString() === selectedProduct) || null;

  const totalPrice = product && quantity ? (product.unit_price * quantity).toFixed(2) : "0.00";
  const vatAmount = product && quantity ? (totalPrice * (product.vat_rate / 100)).toFixed(2) : "0.00";

  const submitOrder = async () => {
    setError("");
    setSuccess("");

    if (!selectedCompany || !selectedProduct || !quantity || quantity <= 0) {
      setError("Please select company, product, and enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: parseInt(selectedCompany),
          product_id: parseInt(selectedProduct),
          quantity: parseInt(quantity),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      setSuccess("Order created successfully!");
      setSelectedCompany(null);
      setSelectedProduct(null);
      setQuantity("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "An error occurred while creating the order");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitOrder();
  };

  return (
    <Container size="lg" py="xl">
      <Paper p="xl" radius="lg" withBorder shadow="sm" component="form" onSubmit={handleFormSubmit}>
        <Stack gap="lg">
          {/* Header */}
          <Box>
            <Group justify="space-between" align="flex-start">
              <Box>
                <Title order={2} size="h2" fw={700}>
                  📦 Create Order
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Select a company and product to create a new order
                </Text>
              </Box>
              {/* no refresh button — lists load lazily on dropdown open */}
            </Group>
          </Box>

          {/* Alerts */}
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

          {/* Form Grid */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Company"
                placeholder="Select a company"
                data={companies.map(c => ({ value: c.id.toString(), label: c.name }))}
                value={selectedCompany}
                onChange={handleCompanySelect}
                onDropdownOpen={handleCompanyOpen}
                searchable
                clearable
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Product"
                placeholder="Select a product"
                data={products.map(p => ({ value: p.id.toString(), label: p.name }))}
                value={selectedProduct}
                onChange={handleProductSelect}
                onDropdownOpen={handleProductOpen}
                searchable
                clearable
                required
              />
            </Grid.Col>
          </Grid>

          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={setQuantity}
            min={1}
            step={1}
            required
          />

          {/* Order Summary Preview */}
          {product && company && quantity && (
            <Card withBorder p="lg" bg="blue.0" radius="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4} size="h4">
                    Order Summary
                  </Title>
                  <Badge color="blue" variant="filled">
                    Preview
                  </Badge>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Company
                  </Text>
                  <Text size="sm" fw={600}>
                    {company.name}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Product
                  </Text>
                  <Text size="sm" fw={600}>
                    {product.name}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Unit Price
                  </Text>
                  <Text size="sm" fw={600}>
                    ${product.unit_price.toFixed(2)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Quantity
                  </Text>
                  <Text size="sm" fw={600}>
                    {quantity}
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Subtotal
                  </Text>
                  <Text size="sm" fw={600}>
                    ${totalPrice}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    VAT ({product.vat_rate}%)
                  </Text>
                  <Text size="sm" fw={600}>
                    ${vatAmount}
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text size="md" fw={700} c="blue.9">
                    Total Amount
                  </Text>
                  <Text
                    size="md"
                    fw={700}
                    c="blue"
                    style={{ fontSize: "18px" }}
                  >
                    ${(parseFloat(totalPrice) + parseFloat(vatAmount)).toFixed(2)}
                  </Text>
                </Group>
              </Stack>
            </Card>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="md">
            <Button
              variant="default"
              type="button"
              onClick={() => {
                setSelectedCompany(null);
                setSelectedProduct(null);
                setQuantity("");
                setError("");
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!selectedCompany || !selectedProduct || !quantity}
              size="md"
            >
              Place Order
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
