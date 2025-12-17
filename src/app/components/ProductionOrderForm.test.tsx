import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductionOrderForm } from "./ProductionOrderForm";
import { productionOrdersApi } from "../api/ProductionOrdersAPI";

jest.mock("../api/ProductionOrdersAPI");

const mockedApi = productionOrdersApi as jest.Mocked<typeof productionOrdersApi>;

describe("ProductionOrderForm", () => {
  beforeEach(() => {
    mockedApi.getAll.mockResolvedValue([]);
    mockedApi.create.mockResolvedValue({
      id: "1",
      reference: "P-1",
      product: "Iphone",
      quantity: 10,
      dueDate: "2025-01-01",
      status: "planned",
      createdAt: "2025-12-17",
    });
  });

  it("renders form fields", () => {
    render(<ProductionOrderForm />);

    expect(screen.getByLabelText(/Reference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
  });

  it("loads production orders on mount", async () => {
    render(<ProductionOrderForm />);

    await waitFor(() => {
      expect(mockedApi.getAll).toHaveBeenCalled();
    });
  });

  it("creates a production order", async () => {
    render(<ProductionOrderForm />);

    await userEvent.type(screen.getByLabelText(/Reference/i), "P-1");
    await userEvent.type(screen.getByLabelText(/Product/i), "Iphone");
    await userEvent.type(screen.getByLabelText(/Quantity/i), "10");

    await userEvent.click(screen.getByRole("button", { name: /Add Order/i }));

    await waitFor(() => {
      expect(mockedApi.create).toHaveBeenCalled();
    });

    expect(await screen.findByText("P-1")).toBeInTheDocument();
  });
});
