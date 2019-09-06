export const config = {
  researchOptionsLink: { // Whenever we click on a research option (Featured Research, Think Series, Industry Conference, BMO Data)
    trigger: 'click',
    type: 'event',
    category: 'Homepage',
    action: 'Landing Page',
  },
  aboutBMOResearchLink: { // Whenever we click any links in the main footer of the page (Legal, Client, BMO, Contact, Follow)
    trigger: 'click',
    type: 'event',
    category: 'Homepage',
    action: 'Landing Page',
  }
};
