import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, HandHeart, Truck, HeartHandshake, MapPin, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { donationService } from '../../services/donationService';
import { Donation, DonationRequest } from '../../types';

export const CharityDashboardPage: React.FC = () => {
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAvailableDonations(
      donationService.getDonations().filter((d) => d.status === 'Available')
    );
    setRequests(donationService.getRequests());
  }, []);

  const handleRequestClick = (don: Donation) => {
    donationService.requestDonation({
      donationId: don.id,
      charityId: 'usr_charity_1',
      charityName: 'Hope Food Bank',
      requestedFood: don.foodItemName,
      requestedQuantity: don.quantity,
      unit: don.unit,
      pickupTime: don.pickupTime,
      distanceKm: don.distanceKm || 2.4,
      notes: 'Requesting collection for evening community dinner service.',
    });

    setAvailableDonations(
      donationService.getDonations().filter((d) => d.status === 'Available')
    );
    setRequests(donationService.getRequests());
    navigate('/charity/requests');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Charity Partner Dashboard"
        subtitle="Hope Food Bank • Colombo District Branch"
      />

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Donations Nearby"
          value={availableDonations.length}
          trend="Within 5 km radius"
          trendDirection="up"
          subtitle="Ready for pickup"
          icon={Gift}
          accentColor="green"
        />
        <StatCard
          title="Pending Requests"
          value={requests.filter((r) => r.status === 'Pending').length}
          trend="Awaiting business approval"
          trendDirection="neutral"
          subtitle="Submitted requests"
          icon={HandHeart}
          accentColor="warning"
        />
        <StatCard
          title="Confirmed Collections"
          value={requests.filter((r) => r.status === 'Accepted').length}
          trend="Scheduled for today"
          trendDirection="up"
          subtitle="Ready for dispatch"
          icon={Truck}
          accentColor="blue"
        />
        <StatCard
          title="Food Collected This Month"
          value="420 Kg"
          trend="1,260 Meals Distributed"
          trendDirection="up"
          subtitle="Community contribution"
          icon={HeartHandshake}
          accentColor="purple"
        />
      </div>

      {/* NEARBY AVAILABLE DONATIONS */}
      <div className="eco-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-outfit">
              Nearby Available Food Donations
            </h2>
            <p className="text-xs text-eco-muted">Surplus offers ready for immediate charity request</p>
          </div>
          <button
            onClick={() => navigate('/charity/donations')}
            className="text-xs font-semibold text-eco-green hover:underline flex items-center gap-1"
          >
            Explore All Listings <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDonations.map((don) => (
            <div
              key={don.id}
              className="eco-card p-5 border-eco-green/40 bg-eco-surface/80 flex flex-col justify-between space-y-3 hover:border-eco-green transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit">
                      {don.foodItemName}
                    </h3>
                    <p className="text-xs text-eco-green font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {don.donorName} ({don.distanceKm} km away)
                    </p>
                  </div>
                  <StatusBadge status="Available" size="sm" />
                </div>

                <div className="p-3 rounded-xl bg-eco-card border border-eco-border space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-eco-muted">Quantity:</span>
                    <span className="font-bold text-white">
                      {don.quantity} {don.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-eco-muted">Pickup Window:</span>
                    <span className="font-semibold text-eco-purple flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {don.pickupTime}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRequestClick(don)}
                className="w-full py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl shadow-glow-green"
              >
                Request Donation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
