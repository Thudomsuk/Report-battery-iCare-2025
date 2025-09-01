# Claude Code Configuration

This file contains configuration and instructions for Claude Code to better assist with this project.

## Project Overview

Battery Booking Promotion Reporting System - A web-based dashboard that aggregates data from multiple iCare branch Google Sheets to create comprehensive booking reports. The system displays various analytics views for battery booking promotions across 39 branches in Thailand.

### Key Features
- Real-time data aggregation from 39 branch Google Sheets (updates every 5 minutes)
- Multiple report views with tabbed interface
- Direct links to individual branch sheets for detailed analysis
- Responsive design with attractive table styling

## Branch Data Sources

The system integrates data from 39 iCare branches across Thailand:

**Branch Count**: 39 branches
**Data Format**: Google Sheets with standardized structure
**Update Frequency**: Every 5 minutes
**Geographic Coverage**: Bangkok, Central regions, and major provinces

### Key Branches Include:
- Paradise Park Srinakarin (ID227)
- Central Chiangmai Airport (ID606) 
- Future Park Rangsit (ID615)
- Central Pattaya (ID721)
- MAYA Chiangmai (ID897)
- EmQuartier Sukhumvit (ID2547)
- And 33 additional locations

## Report Types Required

### 1. Summary_ByBranch
**Purpose**: Drive booking performance by staff per day
- **Data**: Daily booking totals by branch
- **Sorting**: Descending order (highest to lowest)
- **Update**: Every 5 minutes
- **Key Metrics**: MAR, APR, MAY columns with totals

### 2. Summary_ByCategory  
**Purpose**: Customer booking preferences by device model per day per branch
- **Data**: iPhone models booked daily by branch
- **Structure**: Device models as rows, branch IDs as columns
- **Key Models**: iPhone 12/12 Pro, iPhone 13, iPhone 14 series, etc.

### 3. SummaryTotal_ByCategory
**Purpose**: Total device model bookings across all days per branch
- **Data**: Cumulative bookings by device model
- **Scope**: All-time totals per branch per device type

### 4. Summary_ByMonth
**Purpose**: Monthly booking distribution (September vs October)
- **Data**: Customer preference for September and October delivery
- **Breakdown**: By branch showing month selection patterns

## Google Sheets Integration

### Authentication Requirements
- Google Sheets API access
- Service account or OAuth2 authentication
- Read permissions for all 39 sheet IDs

### Data Structure Expected
Each sheet contains:
- Branch identification (ID + Name)
- Booking date columns  
- Device model rows
- Monthly preference data
- Staff performance metrics

### API Endpoints Needed
```javascript
// Example sheet URL structure
const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/';
const SHEET_EXPORT_FORMAT = '/export?format=csv&gid=';

// Branch configurations
const branches = [
  { id: 227, name: 'iCare-Paradise Park-Srinakarin', sheetId: '1H9rVD_1056Hu-c1I0XeYnezpG6bLrkgZJXkv6EW3hEw' },
  { id: 602, name: 'iCare-Market Village-Huahin', sheetId: '1CSz92ui3F1wC-PVyNg84JnEPM8Wc1LQc5t83tbpAWKk' },
  // ... additional 37 branches
];
```

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technical Requirements

### Frontend Framework
- **Recommended**: React with TypeScript or Vue.js
- **Styling**: Tailwind CSS or styled-components
- **State Management**: Context API or Zustand
- **Data Fetching**: Tanstack Query or SWR

### Key Components Needed
1. **TabNavigation** - Switch between 4 report types
2. **BranchSummaryTable** - Summary_ByBranch display
3. **CategoryMatrix** - Device model booking grid
4. **MonthlyBreakdown** - September/October comparison
5. **DataRefreshIndicator** - 5-minute update status
6. **BranchDetailLink** - Direct links to Google Sheets

### Styling Guidelines
```css
/* Header colors for visual appeal */
.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-table {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .summary-table { font-size: 14px; }
}
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── TabNavigation.tsx
│   │   └── LoadingSpinner.tsx
│   ├── reports/
│   │   ├── BranchSummary.tsx
│   │   ├── CategorySummary.tsx
│   │   ├── TotalCategory.tsx
│   │   └── MonthlySummary.tsx
│   └── common/
│       ├── DataTable.tsx
│       └── RefreshIndicator.tsx
├── services/
│   ├── googleSheetsApi.ts
│   ├── dataProcessor.ts
│   └── branchConfig.ts
├── hooks/
│   ├── useSheetData.ts
│   └── useAutoRefresh.ts
├── types/
│   ├── branch.ts
│   ├── booking.ts
│   └── report.ts
└── utils/
    ├── dateHelpers.ts
    └── sortingHelpers.ts
```

## Data Processing Logic

### Auto-refresh Implementation
```javascript
// Update every 5 minutes
const REFRESH_INTERVAL = 5 * 60 * 1000;

useEffect(() => {
  const interval = setInterval(() => {
    refetchAllBranchData();
  }, REFRESH_INTERVAL);
  
  return () => clearInterval(interval);
}, []);
```

### Sorting Requirements
- All tables sort by total bookings (descending)
- Preserve branch ID and name associations
- Handle empty/null values gracefully

## API Integration Notes

### Google Sheets API Limits
- 100 requests per 100 seconds per user
- Implement caching strategy
- Use batch requests when possible

### Error Handling
- Network timeout handling
- Sheet access permission errors  
- Malformed data validation
- Graceful degradation for offline mode

## Performance Considerations

- **Caching**: Implement 4-minute cache to optimize API calls
- **Lazy Loading**: Load tab content on demand
- **Virtualization**: For large data tables
- **Compression**: Gzip responses from Google Sheets

## Notes

1. **Thai Language Support**: Ensure proper UTF-8 encoding for branch names in Thai
2. **Time Zone**: All timestamps in Thailand timezone (UTC+7)
3. **Color Scheme**: Use professional colors suitable for business reporting
4. **Mobile Responsiveness**: Tables should be scrollable on mobile devices
5. **Direct Links**: Each branch summary should link to original Google Sheet
6. **Data Validation**: Verify sheet structure matches expected format before processing
7. **Loading States**: Show loading indicators during 5-minute refresh cycles
8. **Export Functionality**: Consider adding CSV/Excel export options for reports

### Critical Implementation Details
- Handle rate limiting from Google Sheets API
- Implement retry logic for failed requests
- Ensure data consistency across all 39 branches
- Validate that all sheets have required columns before processing
- Create fallback UI when sheets are temporarily unavailable