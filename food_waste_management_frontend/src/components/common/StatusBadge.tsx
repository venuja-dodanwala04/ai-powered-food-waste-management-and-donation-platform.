import React from 'react';

export type StatusType =
  | 'Fresh'
  | 'Low Stock'
  | 'Expiring Soon'
  | 'Critical Expiry'
  | 'Expired'
  | 'Approved'
  | 'Stock Out'
  | 'Overstocked'
  | 'Logged'
  | 'Donated'
  | 'Wasted'
  | 'Sold Out'
  | 'Available'
  | 'Reserved'
  | 'Collected'
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'VERIFIED';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'Fresh':
      case 'Approved':
      case 'Sold Out':
      case 'Available':
      case 'Accepted':
      case 'Collected':
      case 'VERIFIED':
        return 'bg-eco-green/15 text-eco-green border-eco-green/30';

      case 'Low Stock':
      case 'Expiring Soon':
      case 'Overstocked':
      case 'Reserved':
      case 'Pending':
        return 'bg-eco-warning/15 text-eco-warning border-eco-warning/30';

      case 'Critical Expiry':
      case 'Expired':
      case 'Stock Out':
      case 'Wasted':
      case 'Rejected':
        return 'bg-eco-danger/15 text-eco-danger border-eco-danger/30';

      case 'Logged':
      case 'Donated':
      default:
        return 'bg-eco-blue/15 text-eco-blue border-eco-blue/30';
    }
  };

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${px} ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};
