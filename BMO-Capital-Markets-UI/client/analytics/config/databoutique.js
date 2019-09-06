export const config = {
  searchFilter: { // Whenever filter options are clicked
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO RED',
    action: 'Company'
  },
  companyClick: { // Whenever any particular company name/ticker is clicked
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'Company',
  },
  pdfDownload: { // Whenever PDF file is downloaded
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'PDF Download'
  },
  excelDownload: { // Whenever Excel file is downloaded
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'Excel Download'
  },
  companyDropdownSelect: { // Whenever Company/ticker drop down menu is used
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'Company/Ticker Drop down'
  },
  analystsDropdownSelect: { // Whenever Company/ticker drop down menu is used
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'Analyst Drop down'
  },
  fieldRangeClick: { // Whenever Field Range button is clicked
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
    action: 'Field Range'
  },
  companyTickerClick: { // Whenever Company/ticker drop down menu is used
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO Model',
    action: 'Company/ticker Drop down'
  },
  datasetClick: { // Whever company dataset is clicked
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO Model',
    action: 'Company Dataset'
  },
  companyDataSetDownload: { // Whever company dataset is Downloaded
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO Model',
    action: 'Company Dataset Download'
  },
  dateRangeChanged: { // Whenever we change the active date range
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO Model',
    action: 'Date Range Filter'
  },
  setFieldRange: {
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: BMO RED',
  },
  stockScreenerSubmit: {
    trigger: 'click',
    type: 'event',
    category: 'Data Boutique: Stock Screener',
  }
};
