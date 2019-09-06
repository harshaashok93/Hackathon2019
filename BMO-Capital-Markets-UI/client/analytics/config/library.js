export const config = {
  locationFilterAdded: { // Whenever a location filter is added
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Location Filter',
  },
  researchFilterAdded: { // Whenever a research type filter is added
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Research Type Filter',
  },
  dateRangeChanged: { // Whenever we change the active date range
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Date Range Filter',
  },
  additionalFilterAdded: { // Whenever we add an additional filter
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Additional Filter',
  },
  analystPicClick: { // Whenever we click on a specific analyst to load their profile
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Analyst Click',
  },
  researchPublictaionClick: { // Whenever we click title to open a specific publication
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Research Click',
  },
  researchBookmarkClick: { // Whenever we click to bookmark a piece of research
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Bookmark',
  },
  researchPreviewClick: { // Whenever we click to preview a piece of research
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Preview',
  },
  loadPreviewOverlay: { // Whenever the search result preview overlay appears on the homepage
    trigger: 'click',
    type: 'page',
    name: 'Preview Overlay',
  },
  libraryFollowClick: { // Whenever we click to follow an analyst
    trigger: 'click',
    type: 'event',
    category: 'Search Results',
    action: 'Follow'
  }
};
