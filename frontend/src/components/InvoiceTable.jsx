import {
  Table,
  Button,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Box,
  Alert,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

export default function InvoiceTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const orders = await res.json();
      
      const enrichedOrders = orders.map(order => {
        const unit_price = parseFloat(order.unit_price) || 0;
        const vat_rate = parseFloat(order.vat_rate) || 0;
        const quantity = parseInt(order.quantity, 10) || 0;

        const total_price = (order.total_price !== undefined && order.total_price !== null)
          ? parseFloat(order.total_price) || (unit_price * quantity)
          : unit_price * quantity;

        const vat_amount = (order.vat_amount !== undefined && order.vat_amount !== null)
          ? parseFloat(order.vat_amount) || (total_price * (vat_rate / 100))
          : (total_price * (vat_rate / 100));

        return {
            ...order,
            unit_price,
            vat_rate,
            quantity,
            total_price,
            vat_amount,
            company_name: order.company_name || order.company || order.companyName || "",
            product_name: order.product_name || order.product || order.productName || "",
          };
      });

      setData(enrichedOrders);
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoicePDF = (order) => {
    const pdf = new jsPDF();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    // const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    const safeText = (v) => {
      if (v === null || v === undefined) return "";
      if (typeof v === "object") {
        try {
          return JSON.stringify(v);
        } catch (e) {
          return String(e);
        }
      }
      return String(v);
    };

    // Header
    pdf.setFontSize(20);
    pdf.text(safeText("INVOICE"), 20, yPosition);
    yPosition += 15;

    // Invoice details
    pdf.setFontSize(10);
    pdf.text(safeText(`Invoice #: ${order.id}`), 20, yPosition);
    yPosition += 7;
    pdf.text(safeText(`Date: ${new Date().toLocaleDateString()}`), 20, yPosition);
    yPosition += 15;

    // Company details
    pdf.setFontSize(12);
    pdf.text(safeText("From:"), 20, yPosition);
    yPosition += 7;
    pdf.setFontSize(10);
    pdf.text(safeText(order.company_name), 20, yPosition);
    yPosition += 5;
    pdf.text(safeText(order.company_address), 20, yPosition);
    yPosition += 15;

    // Line items
    pdf.setFontSize(11);
    pdf.text("Items:", 20, yPosition);
    yPosition += 10;

    // Table header
    pdf.setFontSize(10);
    const headers = ["Description", "Unit Price", "Quantity", "Amount"];
    const headerX = [20, 80, 120, 160];
    headers.forEach((header, i) => {
      pdf.text(safeText(header), headerX[i], yPosition);
    });
    yPosition += 8;
    pdf.setDrawColor(200);
    pdf.line(20, yPosition, 200, yPosition);
    yPosition += 8;

    // Item data
    pdf.text(safeText(order.product_name || ""), headerX[0], yPosition);
    pdf.text(safeText(`$${Number(order.unit_price || 0).toFixed(2)}`), headerX[1], yPosition);
    pdf.text(safeText(String(order.quantity || 0)), headerX[2], yPosition);
    pdf.text(safeText(`$${Number(order.total_price || 0).toFixed(2)}`), headerX[3], yPosition);
    yPosition += 12;

    pdf.line(20, yPosition, 200, yPosition);
    yPosition += 10;

    // Totals
    pdf.setFontSize(10);
    pdf.text(safeText("Subtotal:"), 140, yPosition);
    pdf.text(safeText(`$${Number(order.total_price || 0).toFixed(2)}`), 170, yPosition);
    yPosition += 8;

    pdf.text(safeText(`VAT (${Number(order.vat_rate || 0)}%):`), 140, yPosition);
    pdf.text(safeText(`$${Number(order.vat_amount || 0).toFixed(2)}`), 170, yPosition);
    yPosition += 10;

    pdf.setDrawColor(0);
    pdf.line(140, yPosition - 2, 200, yPosition - 2);
    pdf.setFontSize(11);
    pdf.text(safeText("Total:"), 140, yPosition);
    const total = Number(order.total_price || 0) + Number(order.vat_amount || 0);
    pdf.text(safeText(`$${total.toFixed(2)}`), 170, yPosition);

    pdf.save(`invoice_${order.id}.pdf`);
  };

  const rows = data.map((row) => (
    <tr key={row.id}>
      <td>
        <Text size="sm" fw={500}>
          {row.id}
        </Text>
      </td>
      <td>
        <Text size="sm">{row.company_name || "-"}</Text>
      </td>
      <td>
        <Text size="sm">{row.product_name || "-"}</Text>
      </td>
      <td>
        <Text size="sm" ta="center">
          {row.quantity}
        </Text>
      </td>
      <td>
        <Text size="sm" ta="right">
          ${Number(row.unit_price || 0).toFixed(2)}
        </Text>
      </td>
      <td>
        <Text size="sm" ta="right" fw={600}>
          ${Number(row.total_price || 0).toFixed(2)}
        </Text>
      </td>
      <td>
        <Badge style={{alignItems: "right"}} size="sm" fw={600} variant="light" color="blue">
          {Number(row.vat_rate || 0)}%
        </Badge>
      </td>
      <td>
        <Text size="sm" ta="right" fw={600} c="blue">
          ${Number(row.vat_amount || 0).toFixed(2)}
        </Text>
      </td>
      <td>
        <Text size="sm" ta="right" fw={700} c="green">
          ${(Number(row.total_price || 0) + Number(row.vat_amount || 0)).toFixed(2)}
        </Text>
      </td>
      <td>
        <Tooltip label="Download PDF">
          <ActionIcon
            size="sm"
            variant="light"
            color="blue"
            onClick={() => downloadInvoicePDF(row)}
          >
            📥
          </ActionIcon>
        </Tooltip>
      </td>
    </tr>
  ));

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={3} size="h3" fw={700}>
                📊 Invoices
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                View and manage all invoices with VAT calculations
              </Text>
            </Box>
            <Button onClick={fetchOrders} loading={loading} variant="light">
              Refresh
            </Button>
          </Group>
        </Box>

        {error && (
          <Alert title="Error" color="red">
            {error}
          </Alert>
        )}

        {data.length === 0 ? (
          <Alert title="No Invoices" color="gray">
            No invoices found. Create an order from the Order Form.
          </Alert>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Company</th>
                  <th>Product</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Unit Price</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                  <th style={{ textAlign: "right" }}>VAT %</th>
                  <th style={{ textAlign: "right" }}>VAT Amount</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
        )}
      </Stack>
    </Paper>
  );
}
