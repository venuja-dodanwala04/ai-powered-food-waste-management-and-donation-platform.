import { Donation, DonationRequest } from '../types';
import { MOCK_DONATIONS, MOCK_DONATION_REQUESTS } from '../data/mockDonations';

class DonationService {
  private donations: Donation[] = [...MOCK_DONATIONS];
  private requests: DonationRequest[] = [...MOCK_DONATION_REQUESTS];

  getDonations(): Donation[] {
    return [...this.donations];
  }

  getRequests(): DonationRequest[] {
    return [...this.requests];
  }

  createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'status'>): Donation {
    const newDonation: Donation = {
      ...donation,
      id: `don_${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
    };
    this.donations.unshift(newDonation);
    return newDonation;
  }

  requestDonation(request: Omit<DonationRequest, 'id' | 'createdAt' | 'status'>): DonationRequest {
    const newReq: DonationRequest = {
      ...request,
      id: `req_${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.requests.unshift(newReq);
    
    // update donation status to Reserved
    const don = this.donations.find((d) => d.id === request.donationId);
    if (don) don.status = 'Reserved';

    return newReq;
  }

  updateRequestStatus(requestId: string, status: 'Accepted' | 'Rejected' | 'Collected'): DonationRequest | null {
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) return null;
    req.status = status;

    const don = this.donations.find((d) => d.id === req.donationId);
    if (don) {
      if (status === 'Accepted') don.status = 'Reserved';
      if (status === 'Collected') don.status = 'Collected';
      if (status === 'Rejected') don.status = 'Available';
    }

    return req;
  }
}

export const donationService = new DonationService();
