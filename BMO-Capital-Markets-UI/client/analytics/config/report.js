export const config = {
  reportFollow: { // Whenever we click to follow an analyst/sector, etc
    trigger: 'click',
    type: 'event',
    category: 'Report',
    action: 'Follow'
  },
  reportEvents: { // Whenever we click to bookmark a specific report
    trigger: 'click',
    type: 'event',
    category: 'Report'
  },
  reportRelatedResearch: { // Whenever we click to bookmark a specific report
    trigger: 'click',
    type: 'event',
    category: 'Report',
    action: 'Related Research'
  },
};
