export const config = {
  autosuggestSearchClick: { // Whenever someone clicks to select an auto-suggestion from a search
    trigger: 'click',
    type: 'event',
    category: 'Homepage',
    action: 'Search',
  },
  loadSearchOverlay: { // Whenever the search overlay appears on the homepage
    trigger: 'click',
    type: 'page',
    name: 'Search Overlay',
  },
  analystLinkClick: { // Whenever we click on the analyst suggestions in the overlay
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
    action: 'Analyst Name',
  },
  companyTickerClick: { // Whenever we click on the company ticker in the overlay
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
    action: 'Company Ticker',
  },
  researchSuggestionClick: { // Whenever we click on the research suggestions in the overlay
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
    action: 'Research Publication Link',
  },
  otherlinkClick: { // Whenever we click on the other suggestions in the overlay
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
    action: 'Other Links',
  },
  industrySuggestionClick: { // Whenever we click on the industry suggestions in the overlay
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
    action: 'Industry',
  },
  footerlinksClick: { // Whenever we click on "Recent Searches" & "Most Often Searched" links in blue panel
    trigger: 'click',
    type: 'event',
    category: 'Homepage Overlay',
  }
};
