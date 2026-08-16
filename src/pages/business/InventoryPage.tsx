import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Plus, AlertOctagon, DollarSign, Gift, Trash2, Edit2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { FilterBar } from '../../components/common/FilterBar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AddInventoryModal } from '../../components/business/AddInventoryModal';
import { inventoryService } from '../../services/inventoryService';
import { FoodItem } from '../../types';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    inventoryService.getItems().then(setItems).catch(console.error);
  }, []);

  const handleAddItem = async (newItem: Omit<FoodItem, 'id'>) => {
    const added = await inventoryService.addItem(newItem);
    setItems((current) => [added, ...current]);
  };

  const handleDeleteItem = async () => {
    if (deleteItemId) {
      await inventoryService.deleteItem(deleteItemId);
      setItems((current) => current.filter((i) => i.id !== deleteItemId));
      setDeleteItemId(null);
    }
  };

  // Metrics
  const totalItems = items.length;
  const lowStockCount = items.filter((i) => i.status === 'Low Stock').length;
  const expiringSoonCount = items.filter(
    (i) => i.status === 'Expiring Soon' || i.status === 'Critical Expiry'
  ).length;
  const totalValueLKR = items.reduce((acc, i) => acc + i.quantity * i.unitCost, 0);

  const categoryOptions = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Prepared Food', value: 'Prepared Food' },
    { label: 'Vegetables', value: 'Vegetables' },
    { label: 'Seafood', value: 'Seafood' },
    { label: 'Fruits', value: 'Fruits' },
    { label: 'Rice & Grains', value: 'Rice & Grains' },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Critical Expiry', value: 'Critical Expiry' },
    { label: 'Expiring Soon', value: 'Expiring Soon' },
    { label: 'Fresh', value: 'Fresh' },
    { label: 'Low Stock', value: 'Low Stock' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Monitor food ingredient stock, storage locations, and shelf-life tracking."
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-glow-green flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Inventory Item
          </button>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory Items"
          value={totalItems}
          subtitle="Active stock records"
          icon={Boxes}
          accentColor="blue"
        />
        <StatCard
          title="Low Stock Warning"
          value={lowStockCount}
          subtitle="Reorder required"
          icon={AlertOctagon}
          accentColor="warning"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoonCount}
          subtitle="Action needed"
          icon={AlertOctagon}
          accentColor="danger"
        />
        <StatCard
          title="Inventory Value"
          value={`LKR ${totalValueLKR.toLocaleString()}`}
          subtitle="Total stock valuation"
          icon={DollarSign}
          accentColor="green"
        />
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="eco-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search food item..."
          className="w-full sm:w-72"
        />
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <FilterBar
            options={categoryOptions}
            activeValue={categoryFilter}
            onChange={setCategoryFilter}
          />
          <FilterBar
            options={statusOptions}
            activeValue={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="eco-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Food Item</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Quantity</th>
                <th className="py-3 px-4 font-semibold">Storage Location</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold">Unit Cost</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/40 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-eco-surface/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{item.foodName}</td>
                  <td className="py-3.5 px-4 text-eco-muted">{item.category}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-eco-muted">{item.storageLocation}</td>
                  <td className="py-3.5 px-4 text-eco-muted">{item.expiryDate}</td>
                  <td className="py-3.5 px-4 text-white">LKR {item.unitCost}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(item.status === 'Critical Expiry' || item.status === 'Expiring Soon') && (
                        <button
                          onClick={() =>
                            navigate('/business/donations', {
                              state: { prefillItem: item.foodName, prefillQty: item.quantity },
                            })
                          }
                          title="Post as Donation"
                          className="px-2.5 py-1 bg-eco-green/15 text-eco-green hover:bg-eco-green hover:text-eco-bg text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Gift className="w-3 h-3" /> Donate
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteItemId(item.id)}
                        className="p-1.5 text-eco-muted hover:text-eco-danger rounded-lg hover:bg-eco-surface transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteItemId !== null}
        title="Delete Inventory Item"
        description="Are you sure you want to delete this food item from inventory? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteItemId(null)}
      />
    </div>
  );
};
