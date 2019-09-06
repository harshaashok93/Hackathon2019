export const config = {
  leftNavClick: { // Whenever we click on a specific navigation item on the strategy landing page
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Navigation',
  },
  subCategorySelect: { // When we select a subcategory from the dropdown
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'subcategory',
  },
  strategyBookmarkClick: { // Whenever we click to bookmark a specific strategy report
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Bookmark',
  },
  strategyPreviewClick: { // Whenever we click to preview a piece of research
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Preview',
  },
  analystPicClick: { // Whenever we click on a specific analyst to load their profile
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Analyst Click',
  },
  strategyLeftMenuClick: {
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Navigation',
  },
  strategyPublictaionClick: { // Whenever we click title to open a specific publication
    trigger: 'click',
    type: 'event',
    category: 'Strategy',
    action: 'Research Click',
  },
};
