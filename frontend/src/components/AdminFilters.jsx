import React, { useState } from 'react';
import { RotateCcw, Calendar, MapPin } from 'lucide-react';

/**
 * AdminFilters Component
 * Global filter bar for Admin Dashboard
 * Includes date range, city/zone, and status filters
 */
export const AdminFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    dateRange: initialFilters.dateRange || 'today',
    city: initialFilters.city || 'all',
    status: initialFilters.status || 'all',
  });

  const [cities] = useState([
    { id: 'all', name: 'All Cities' },
    { id: 'karachi', name: 'Karachi' },
    { id: 'lahore', name: 'Lahore' },
    { id: 'islamabad', name: 'Islamabad' },
    { id: 'rawalpindi', name: 'Rawalpindi' },
  ]);

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'l7d', label: 'Last 7 Days' },
    { value: 'l30d', label: 'Last 30 Days' },
  ];

  const handleFilterChange = (filterKey, value) => {
    const updatedFilters = { ...filters, [filterKey]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    const defaultFilters = { dateRange: 'today', city: 'all', status: 'all' };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div
      style={{
        background: 'white',
        padding: '16px 20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Date Range */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={18} style={{ color: '#666' }} />
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontWeight: 600,
            cursor: 'pointer',
            background: 'white',
          }}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MapPin size={18} style={{ color: '#666' }} />
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontWeight: 600,
            cursor: 'pointer',
            background: 'white',
          }}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: '8px 16px',
          background: '#f0f0f0',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#f0f0f0';
        }}
      >
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
};

export default AdminFilters;
