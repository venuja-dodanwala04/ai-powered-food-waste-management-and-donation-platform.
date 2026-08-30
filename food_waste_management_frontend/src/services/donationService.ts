import { Donation, DonationRequest } from '../types';
import { apiRequest } from './apiClient';

interface DonationApiItem {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_phone?: string;
  food_item_name: string;
  category: string;
  quantity: number;
  unit: string;
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  expiry_time: string;
  is_prepared?: boolean;
  status: Donation['status'];
  created_at: string;
}

interface RequestApiItem {
  id: string;
  donation_id: string;
  charity_id: string;
  charity_name: string;
  requested_quantity: number;
  unit: string;
  pickup_time: string;
  notes?: string;
  status: DonationRequest['status'];
  created_at: string;
  requested_food?: string;
  donor_name?: string;
  pickup_address?: string;
}

const toDonation = (d: DonationApiItem): Donation => ({
  id: d.id,
  donorId: d.donor_id,
  donorName: d.donor_name,
  donorAddress: d.pickup_address,
  donorPhone: d.donor_phone ?? '',
  foodItemName: d.food_item_name,
  category: d.category,
  quantity: d.quantity,
  unit: d.unit,
  pickupAddress: d.pickup_address,
  pickupTime: d.pickup_time,
  pickupDate: d.pickup_date.slice(0, 10),
  expiryTime: d.expiry_time,
  status: d.status,
  createdAt: d.created_at,
  isPrepared: d.is_prepared,
});

const toRequest = (r: RequestApiItem): DonationRequest => ({
  id: r.id,
  donationId: r.donation_id,
  charityId: r.charity_id,
  charityName: r.charity_name,
  requestedFood: r.requested_food ?? '',
  requestedQuantity: r.requested_quantity,
  unit: r.unit,
  pickupTime: r.pickup_time,
  distanceKm: 0,
  status: r.status,
  createdAt: r.created_at,
  notes: r.notes,
  donorName: r.donor_name,
  pickupAddress: r.pickup_address,
});

class DonationService {
  async getDonations(mine = false): Promise<Donation[]> {
    const res = await apiRequest<{ items: DonationApiItem[] }>(`/donations${mine ? '?mine=true' : ''}`);
    return res.items.map(toDonation);
  }

  async getRequests(): Promise<DonationRequest[]> {
    const res = await apiRequest<{ items: RequestApiItem[] }>('/donations/requests');
    return res.items.map(toRequest);
  }

  async createDonation(input: {
    foodItemName: string;
    category: string;
    quantity: number;
    unit: string;
    pickupAddress: string;
    pickupDate: string;
    pickupTime: string;
    expiryTime: string;
    isPrepared?: boolean;
  }): Promise<Donation> {
    const created = await apiRequest<DonationApiItem>('/donations', {
      method: 'POST',
      body: JSON.stringify({
        food_item_name: input.foodItemName,
        category: input.category,
        quantity: input.quantity,
        unit: input.unit,
        pickup_address: input.pickupAddress,
        pickup_date: input.pickupDate,
        pickup_time: input.pickupTime,
        expiry_time: input.expiryTime,
        is_prepared: input.isPrepared ?? false,
      }),
    });
    return toDonation(created);
  }

  async requestDonation(input: {
    donationId: string;
    requestedQuantity: number;
    unit: string;
    pickupTime: string;
    notes?: string;
  }): Promise<DonationRequest> {
    const created = await apiRequest<RequestApiItem>('/donations/requests', {
      method: 'POST',
      body: JSON.stringify({
        donation_id: input.donationId,
        requested_quantity: input.requestedQuantity,
        unit: input.unit,
        pickup_time: input.pickupTime,
        notes: input.notes,
      }),
    });
    return toRequest(created);
  }

  async updateRequestStatus(
    requestId: string,
    status: 'Accepted' | 'Rejected' | 'Collected',
  ): Promise<DonationRequest> {
    const updated = await apiRequest<RequestApiItem>(`/donations/requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return toRequest(updated);
  }
}

export const donationService = new DonationService();
