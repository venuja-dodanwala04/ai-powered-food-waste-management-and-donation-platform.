import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_business_1',
    name: 'Grand Colombo',
    email: 'manager@greenkites.com',
    phone: '+94 11 234 5678',
    address: 'Galle Face Terrace, Colombo 03, Sri Lanka',
    role: 'BUSINESS',
    businessType: 'Hotel',
    branch: 'Grand Colombo Main Branch',
    verificationStatus: 'VERIFIED',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'usr_charity_1',
    name: 'Hope Food Bank',
    email: 'charity@hopefoodbank.org',
    phone: '+94 11 987 6543',
    address: '142 Marine Drive, Colombo 04, Sri Lanka',
    role: 'CHARITY',
    charityType: 'Food Bank',
    verificationStatus: 'VERIFIED',
    createdAt: '2025-02-01T10:30:00Z',
  },
  {
    id: 'usr_charity_2',
    name: 'Community Care NGO',
    email: 'contact@communitycare.lk',
    phone: '+94 11 555 4321',
    address: '88 High Level Road, Nugegoda, Sri Lanka',
    role: 'CHARITY',
    charityType: 'Community NGO',
    verificationStatus: 'VERIFIED',
    createdAt: '2025-03-10T12:00:00Z',
  },
];
