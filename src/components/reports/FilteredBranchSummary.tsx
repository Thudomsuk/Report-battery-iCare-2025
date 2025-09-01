import React, { useState, useMemo } from 'react';
import { BookingData } from '../../types/booking';
import { FilterOptions } from '../../types/filters';
import { FilterPanel } from '../common/FilterPanel';
import { BranchSummary } from './BranchSummary';
import { getBranchGroup } from '../../types/filters';

interface FilteredBranchSummaryProps {
  data: BookingData[];
  isLoading?: boolean;
}

export const FilteredBranchSummary: React.FC<FilteredBranchSummaryProps> = ({ 
  data, 
  isLoading 
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    branchGroup: 'all',
    searchTerm: '',
    quickFilter: 'all',
    selectedBranches: []
  });

  const branches = useMemo(() => {
    return data.map(item => ({
      id: item.branchId,
      name: item.branchName
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by branch group
    if (filters.branchGroup !== 'all') {
      filtered = filtered.filter(item => 
        getBranchGroup(item.branchId) === filters.branchGroup
      );
    }

    // Filter by selected branches (when manually selected)
    if (filters.selectedBranches.length > 0 && filters.branchGroup === 'all') {
      filtered = filtered.filter(item => 
        filters.selectedBranches.includes(item.branchId)
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.branchName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply quick filters
    if (filters.quickFilter === 'top10') {
      filtered = filtered
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    } else if (filters.quickFilter === 'bottom10') {
      filtered = filtered
        .sort((a, b) => a.total - b.total)
        .slice(0, 10);
    }

    return filtered;
  }, [data, filters]);

  return (
    <div>
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        branches={branches}
      />
      
      <BranchSummary 
        data={filteredData}
        isLoading={isLoading}
      />
      
      {filteredData.length !== data.length && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-sm text-yellow-800">
            <span className="font-medium">ผลการกรอง:</span>
            {' '}แสดง {filteredData.length} สาขาจากทั้งหมด {data.length} สาขา
          </div>
        </div>
      )}
    </div>
  );
};