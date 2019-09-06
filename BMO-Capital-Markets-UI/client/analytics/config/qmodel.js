export const config = {
  overviewLinks: { // Whenever we click a specific overview link
    trigger: 'click',
    type: 'event',
    category: 'Q Model',
    action: 'Overview'
  },
  qmodelLinks: { // Whenever we click a specific daily list link
    trigger: 'click',
    type: 'event',
    category: 'Q Model'
  },
  qModelDailyList: {
    trigger: 'click',
    type: 'event',
    category: 'Q Model: Daily List',
  },
  viewReport: { // Whenever we click to view the Canadian Report
    trigger: 'click',
    type: 'event',
    category: 'Q Model',
  },
  leftMenuClick: { // Whenever we Q model Daily list GTM triggers
    trigger: 'click',
    type: 'event',
    category: 'Q Model'
  },
  submitFieldRange: { // Whenever we submit a field range configuration
    trigger: 'click',
    type: 'event',
    category: 'Q Model: Daily List Overlay',
    action: ''
  }
};
