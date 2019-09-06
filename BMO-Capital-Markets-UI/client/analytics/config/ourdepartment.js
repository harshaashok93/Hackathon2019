export const config = {
  viewAllAnalysts: { // Whenever we click to view all BMO analysts
    trigger: 'click',
    type: 'event',
    category: 'Our Departments',
    action: 'View All Analysts',
    label: ''
  },
  viewAllCoverage: { // Whenever we click to view all BMO coverage - Our Department page
    trigger: 'click',
    type: 'event',
    category: 'Our Departments',
    action: 'All Coverage',
    label: ''
  },
  featuredAnalystClick: { // Whenever we click to view a specific featured analyst
    trigger: 'click',
    type: 'event',
    category: 'Our Departments',
    action: 'Featured Analyst'
  },
  featuredCoverageClick: { // Whenever we click to view a specific item of features coverage
    trigger: 'click',
    type: 'event',
    category: 'Our Departments',
    action: 'Featured Coverage'
  },
  ourcoverageLeftNavSel: { // Whenever we click on a specific navigation item in a specific category
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage',
    action: 'Navigation'
  },
  ourcoverageBookmarkClick: { // Whenever we click to bookmark a specific coverage item
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage',
    action: 'Bookmark'
  },
  ourcoverageRelatedLinksClick: { // Whenever we a specific related link
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage',
    action: 'Related Links'
  },
  ourcoverageOpenClick: { // Whenever we click to open specific coverage
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage',
    action: 'Open Coverage'
  },
  ourcoverageAnalystNameClick: { // Whenever we click a specific analyst's name or photo
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage',
    action: 'Analyst Click'
  },
  OurCoverageOverlayPage: { // Whenever we click on a specific related lin
    trigger: 'click',
    type: 'event',
    category: 'Our Coverage: Overlay',
  },
  ouranalystsLeftNavSel: { // Whenever we click on a specific navigation item in a specific category
    trigger: 'click',
    type: 'event',
    category: 'Our Analysts',
    action: 'Navigation'
  },
  ouranalystClick: { // Whenever we click on a specific analyst to view their detail page
    trigger: 'click',
    type: 'event',
    category: 'Our Analysts',
    action: 'Analyst'
  },
  ouranalystFollowClick: { // Whenever we click to follow a specific analyst
    trigger: 'click',
    type: 'event',
    category: 'Analyst Detail',
  },
  analystsEmailClick: { // Whenever we click a specific analyst email
    trigger: 'click',
    type: 'event',
    category: 'Analyst Detail',
    action: 'Analyst Email'
  },
  industryTeamMemberClick: { // Whenever we click a specific industry team member associated with the analyst
    trigger: 'click',
    type: 'event',
    category: 'Analyst Detail',
    action: 'Industry Team Members'
  },
  coverageStockList: { // Whenever we click a specific industry team member associated with the analyst
    trigger: 'click',
    type: 'event',
    category: 'Analyst Detail',
    action: 'Coverage Stock List'
  }
};
