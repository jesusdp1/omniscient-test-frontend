"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Spin,
  Alert,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { ProductionOrder } from "../models/ProductionOrder";
import { productionOrdersApi } from "../api/ProductionOrdersAPI";

export const ProductionOrderForm: React.FC = () => {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<ProductionOrder> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  useEffect(() => {
    setLoading(true);
    productionOrdersApi
      .getAll()
      .then(setProductionOrders)
      .catch(() => setError("Failed to load production orders"))
      .finally(() => setLoading(false));
  }, []);

  const save = async (values: any) => {
    setLoading(true);
    setError(null);

    const body = {
      reference: values.reference,
      product: values.product,
      quantity: values.quantity,
      dueDate: values.dueDate.toISOString(),
    };

    productionOrdersApi
      .create(body)
      .then((data) => {
        setProductionOrders((prev) => [...prev, data]);
        form.resetFields();
      })
      .catch(() => setError("Failed to create production order"))
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 16px",
      }}
    >
      <Card title="Create Production Order">
        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item
            name="reference"
            label="Reference"
            rules={[{ required: true, message: "Reference is required" }]}
          >
            <Input placeholder="Order reference" />
          </Form.Item>

          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Product is required" }]}
          >
            <Input placeholder="Product name" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, type: "number", min: 1, message: "Minimum is 1" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Due date is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Add Order
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Production Orders"
        style={{ marginTop: 32 }}
      >
        <Table
          columns={columns}
          dataSource={productionOrders}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};
