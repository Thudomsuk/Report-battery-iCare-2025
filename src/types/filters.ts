export interface FilterOptions {
  branchGroup: 'all' | 'bangkok' | 'metropolitan' | 'provinces';
  searchTerm: string;
  quickFilter: 'all' | 'top10' | 'bottom10';
  selectedBranches: number[];
}

export interface BranchGroup {
  id: string;
  name: string;
  description: string;
  branchIds: number[];
}

export const BRANCH_GROUPS: BranchGroup[] = [
  {
    id: 'bangkok',
    name: 'กรุงเทพฯ',
    description: 'สาขาในกรุงเทพมหานคร',
    branchIds: [
      227,  // Paradise Park-Srinakarin
      614,  // The Mall-Bangkapi  
      658,  // Central-Westgate2.1
      678,  // Central-Rama2
      711,  // Central-Salaya
      718,  // The Mall-Bangkae
      769,  // Mega-Bangna
      1704, // Central (Pinklao)-Bangkoknoi-Bangkok
      2303, // Central-Ladprao-Bangkok
      2306, // Central-Pinklao-Bangkok
      2352, // The Mall-Bangkae (S7)
      2353, // The Mall-Bangkapi (S7)
      2547, // Emquartier-Sukhumvit (S7)
      2548, // Emsphere-Khlongtoei (S7)
      2559  // Central-Salaya (S7)
    ]
  },
  {
    id: 'metropolitan',
    name: 'ปริมณฑล',
    description: 'สาขาในเขตปริมณฑล',
    branchIds: [
      615,  // Future Park-Rangsit
      641,  // Drop-Point-iCare
      1561, // Central-Mueang-Ayutthaya
      1625, // Robinson-Mueang-Chachoengsao
      1989, // Future Park-Rangsit-Pathaumthani R.2
      2307, // Central-Westgate-Nonthaburi
      638,  // Central-Chonburi
      739   // Robinson-Saraburi
    ]
  },
  {
    id: 'provinces',
    name: 'ต่างจังหวัด',
    description: 'สาขาในต่างจังหวัด',
    branchIds: [
      602,  // Market Village-Huahin
      603,  // Central-Phitsanulok
      606,  // Central-Chiangmai Airport
      616,  // Robinson-Suphanburi
      617,  // Central-Udonthani
      628,  // Central-Khonkaen
      630,  // The Mall-Korat
      688,  // Central-Suratthani
      721,  // Central-Pattaya
      731,  // V Square-Nakhonsawan
      897,  // MAYA-Chiangmai
      1118, // Central-East Vile
      1786, // Central-Mueang-Phitsanulok 2
      2304, // Central-Pattaya-Chonburi (S7)
      2305, // Central-Chiangmai Festival
      2573  // Central-Hatyai
    ]
  }
];

export const getBranchGroup = (branchId: number): string => {
  for (const group of BRANCH_GROUPS) {
    if (group.branchIds.includes(branchId)) {
      return group.id;
    }
  }
  return 'unknown';
};

export const getBranchGroupName = (branchId: number): string => {
  const groupId = getBranchGroup(branchId);
  const group = BRANCH_GROUPS.find(g => g.id === groupId);
  return group ? group.name : 'ไม่ระบุ';
};