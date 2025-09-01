import React from 'react';
import { FilterOptions, BRANCH_GROUPS } from '../../types/filters';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  branches: Array<{ id: number; name: string }>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  branches 
}) => {
  const handleBranchGroupChange = (branchGroup: FilterOptions['branchGroup']) => {
    const groupBranches = branchGroup === 'all' 
      ? [] 
      : BRANCH_GROUPS.find(g => g.id === branchGroup)?.branchIds || [];
    
    onFiltersChange({
      ...filters,
      branchGroup,
      selectedBranches: groupBranches
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      searchTerm
    });
  };

  const handleQuickFilterChange = (quickFilter: FilterOptions['quickFilter']) => {
    onFiltersChange({
      ...filters,
      quickFilter
    });
  };

  const handleBranchToggle = (branchId: number) => {
    const isSelected = filters.selectedBranches.includes(branchId);
    const newSelectedBranches = isSelected
      ? filters.selectedBranches.filter(id => id !== branchId)
      : [...filters.selectedBranches, branchId];
    
    onFiltersChange({
      ...filters,
      selectedBranches: newSelectedBranches,
      branchGroup: 'all'
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      branchGroup: 'all',
      searchTerm: '',
      quickFilter: 'all',
      selectedBranches: []
    });
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">ตัวกรองข้อมูล</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          ล้างตัวกรองทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Branch Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            กลุ่มสาขา
          </label>
          <select
            value={filters.branchGroup}
            onChange={(e) => handleBranchGroupChange(e.target.value as FilterOptions['branchGroup'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            {BRANCH_GROUPS.map(group => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.branchIds.length} สาขา)
              </option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ค้นหาชื่อสาขา
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="พิมพ์ชื่อสาขา..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Quick Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ตัวกรองด่วน
          </label>
          <select
            value={filters.quickFilter}
            onChange={(e) => handleQuickFilterChange(e.target.value as FilterOptions['quickFilter'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="top10">Top 10 สาขา</option>
            <option value="bottom10">Bottom 10 สาขา</option>
          </select>
        </div>

        {/* Selected Branches Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สาขาที่เลือก
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
            <span className="text-sm text-gray-600">
              {filters.selectedBranches.length === 0 
                ? 'ทั้งหมด' 
                : `${filters.selectedBranches.length} สาขา`}
            </span>
          </div>
        </div>
      </div>

      {/* Branch Selection (when searching or custom selection) */}
      {(filters.searchTerm || filters.branchGroup === 'all') && filters.selectedBranches.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สาขาที่พบ ({filteredBranches.length})
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
            {filteredBranches.map(branch => (
              <label key={branch.id} className="flex items-center py-1 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.selectedBranches.includes(branch.id)}
                  onChange={() => handleBranchToggle(branch.id)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  ID{branch.id} - {branch.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(filters.branchGroup !== 'all' || filters.searchTerm || filters.quickFilter !== 'all') && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="text-sm text-blue-800">
            <strong>ตัวกรองที่ใช้งาน:</strong>
            {filters.branchGroup !== 'all' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {BRANCH_GROUPS.find(g => g.id === filters.branchGroup)?.name}
              </span>
            )}
            {filters.searchTerm && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ค้นหา: "{filters.searchTerm}"
              </span>
            )}
            {filters.quickFilter !== 'all' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {filters.quickFilter === 'top10' ? 'Top 10' : 'Bottom 10'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};