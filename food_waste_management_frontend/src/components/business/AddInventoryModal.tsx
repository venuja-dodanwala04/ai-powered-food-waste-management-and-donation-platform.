import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { FoodItem, FoodCategory, StorageLocation } from '../../types';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<FoodItem, 'id'>) => Promise<void>;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Prepared Food');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<'kg' | 'units' | 'liters' | 'packs'>('kg');
  const [purchaseDate, setPurchaseDate] = useState('2026-07-19');
  const [expiryDate, setExpiryDate] = useState('2026-07-21');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('Refrigerator');
  const [unitCost, setUnitCost] = useState<number>(1000);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    await onAdd({
      userId: 'usr_business_1',
      foodName,
      category,
      quantity,
      unit,
      purchaseDate,
      expiryDate,
      expiryHoursLeft: 48,
      storageLocation,
      status: 'Fresh',
      unitCost,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="eco-card max-w-lg w-full p-6 relative border-eco-border shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-eco-border/40">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Plus className="w-5 h-5 text-eco-green" /> Add New Inventory Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-eco-muted hover:text-white rounded-lg hover:bg-eco-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-eco-muted mb-1">Food Name *</label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Chicken Curry (Prepared)"
              className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              >
                <option value="Prepared Food">Prepared Food</option>
                <option value="Meat">Meat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Bakery">Bakery</option>
                <option value="Seafood">Seafood</option>
                <option value="Beverages">Beverages</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Storage Location</label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value as StorageLocation)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              >
                <option value="Prepared Food Area">Prepared Food Area</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Freezer">Freezer</option>
                <option value="Dry Storage">Dry Storage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Quantity</label>
              <input
                type="number"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              >
                <option value="kg">kg</option>
                <option value="units">units</option>
                <option value="liters">liters</option>
                <option value="packs">packs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Unit Cost (LKR)</label>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-eco-border/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-eco-surface hover:bg-eco-border text-white text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg text-xs font-extrabold rounded-xl shadow-glow-green"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
