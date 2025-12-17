import { ProductionOrder } from "../models/ProductionOrder";

const API_BASE = 'http://localhost:3001/api/production-orders';

export const productionOrdersApi = {
  async create(body: any): Promise<ProductionOrder> {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Failed to create order');
    }

    return res.json();
  },

  async getAll(status?: string): Promise<ProductionOrder[]> {
    const url = new URL(`${API_BASE}`);
    if (status) {
      url.searchParams.set('status', status);
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    return res.json();
  },
};