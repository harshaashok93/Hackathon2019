export const config = {
  topMenuNav: { // Whenever we click links in upper white menu bar (Menu, Captial Markets, Economics, Corporate Debt)
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'Top Menu',
  },
  bmoEquityHeaderResearchOptions: { // Whenever we click links in the wider navigation bar in white (below top menu)
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'BMO Equity Research',
  },
  topRightHeaderLinks: { // Whenever anyone clicks a top-right link (Profile, Bookmarks)
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'Top Menu',
  },
  bmoLogoClick: { // Whenever anyone clicks on the BMO logo
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'Top Menu',
    label: 'Header Home Logo',
  },
  megaMenuLinks: { // Whenever we click on a specific item in the Mega Menu
    trigger: 'click',
    type: 'event',
    category: 'Mega Menu',
  },
  footerLinks: { // Whenever we click any links in the main footer (Legal, Client, BMO, Contact, Follow)
    trigger: 'click',
    type: 'event',
    category: 'Footer',
    action: 'Footer Links',
  },
  outboundLink: { // Whenever we click on any of the outbound links
    trigger: 'click',
    type: 'event',
    category: 'Outbound Links',
  }
};
