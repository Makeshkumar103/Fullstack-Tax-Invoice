import { Container, Grid, Title, Text, Box, AppShell, Group, Button } from "@mantine/core";
import CompanyForm from "./components/CompanyForm";
import ProductForm from "./components/ProductForm";
import InvoiceTable from "./components/InvoiceTable";
import OrderForm2 from "./components/OrderForm2";

function App() {
  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header bg="blue.6" c="white">
          <Group h="100%" px="md" justify="space-between">
          <Box>
            <Title order={1} size="h2" c="white">
              💼 Tax Invoice Management
            </Title>
            <Text size="sm" opacity={0.7}>
              Manage companies, products, and generate invoices with VAT
            </Text>
          </Box>
          
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          <Grid gutter="lg">
            {/* Left Column: Forms */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Box>
                <CompanyForm />
                <Box mt="lg">
                  <ProductForm />
                </Box>
              </Box>
            </Grid.Col>

            {/* Right Column: Orders and Invoices */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Box>
                <OrderForm2 />
                <Box mt="lg">
                  <InvoiceTable />
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
