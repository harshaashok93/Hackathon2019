const commonHeaderSteps = [
  {
    element: '.search-input-text-box',
    intro: 'Quickly find what you\'re looking for with our all-new search and auto suggestions. See search results appear instantly as you type your query.',
    isCommonStep: true,
  },
  {
    element: '.hamburgerMenu',
    intro: 'Click on the megamenu to view all the pages available on the portal.',
    isCommonStep: true,
    highlightClass: 'bgWhite'
  },
  {
    element: '#bmo-data',
    intro: 'This new page includes Models, Stock Screener, Change Summary, BMO RED, and Global Comparables.',
    isCommonStep: true,
    highlightClass: 'bgWhite',
    hideForDebt: true,
  }
];

export default {
  '/': {
    initialStep: 0,
    apiFlag: 'has_visited_home_page',
    steps: [
      ...commonHeaderSteps,
    ],
  },
  '/library/': {
    initialStep: 0,
    apiFlag: 'has_visited_library_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '.intro-show-more-section',
        intro: 'Click on "Show More Detail" or "Show Less Detail" based on the amount of detail you\'d like to see.'
      },
      {
        element: '#intro-library-filter-part',
        intro: 'Instantly filter your search without having to refresh the page.',
        position: 'right',
        highlightClass: 'bgWhite',
      },
      {
        element: '#first-author-intro-id',
        intro: 'Hover over an analyst\'s last name to view their full name and contact information, or to follow them.',
        highlightClass: 'bgWhite',
      },
      {
        element: '#first-ticker-intro-id',
        intro: 'Click on a ticker to see data for that specific company.',
        highlightClass: 'bgWhite',
        hideForDebt: true,
      },
      {
        element: '#first-bookmark-intro-id',
        intro: 'Bookmark a publication to easily revisit it later on. Access your bookmarks from the icon on the top-right of the screen.'
      }
    ],
  },
  '/our-department/': {
    initialStep: 0,
    apiFlag: 'has_visited_department_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#intro-view-all-btn-our-dept',
        intro: 'See our full list of analysts and the sectors they cover.',
        hideForDebt: true,
      },
      {
        element: '#intro-see-all-btn-our-dept',
        intro: 'See the full list of companies we cover.',
        hideForDebt: true,
      }
    ],
  },
  '/our-department/our-analysts/': {
    initialStep: 0,
    apiFlag: 'has_visited_our_analysts_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#intro-our-analyst-name-id',
        intro: 'Click on an analyst\'s name to view their biography and coverage list.',
        highlightClass: 'bgWhite'
      }
    ],
  },
  '/our-analysts/': {
    initialStep: 0,
    apiFlag: 'has_visited_our_analysts_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#intro-our-analyst-name-id',
        intro: (window.unchainedSite && window.unchainedSite.sitename === 'Corp') ? 'Click on an analyst\'s name to view their biography.' : 'Click on an analyst\'s name to view their biography and coverage list.',
        position: 'bottom',
        highlightClass: 'bgWhite'
      }
    ],
  },
  '/our-department/our-coverage/': {
    initialStep: 0,
    apiFlag: 'has_visited_our_coverage_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#intro-our-coverage-name-id',
        intro: 'Click on a company name to view more data.',
        highlightClass: 'bgWhite',
        hideForDebt: true,
      },
      {
        element: '#intro-our-coverage-analyst-info-id',
        intro: 'Click on an analyst\'s name to view their biography and coverage list.',
        highlightClass: 'bgWhite',
        hideForDebt: true,
      }
    ],
  },
  '/featured-research/following/': {
    initialStep: 0,
    apiFlag: 'has_visited_featured_research_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#popular',
        intro: 'See what\'s trending amongst other research users.',
        position: 'right'
      },
      {
        element: '#following',
        intro: 'A feed of research from the analysts, industries, and companies you have chosen to follow.'
      },
      {
        element: '#most-recent',
        intro: 'Our most recently published research.'
      },
      {
        element: '#top-15',
        intro: 'View Top 15 lists. Clicking on a company on the list will bring you a library page filtered to show research for that company.',
        hideForDebt: true,
      }
    ],
  },
  '/research/': {
    initialStep: 0,
    apiFlag: 'has_visited_publication_page',
    steps: [
      ...commonHeaderSteps,
      {
        element: '#show-intro-div-centered',
        intro: 'Research is now displayed in responsive, mobile-friendly HTML5 with a PDF link. The amount of content shown as HTML depends on the publication type.',
      },
      {
        element: '#view-full-publication',
        intro: 'Click on the "Load full report" button to see the full PDF.',
        position: 'right',
      },
      {
        element: '#intro-research-layout-filter-part',
        intro: 'There are a variety of tools here which allow you to follow the analyst, industry, or company, bookmark the publication, send it via email, print the PDF, search the content, or adjust font size.',
        position: 'right',
        highlightClass: 'bgWhite',
      }
    ],
  }
};
