export const config = {
  profileNavBtnClick: { // Whenever we navigate the profile menu and select an item
    trigger: 'click',
    type: 'event',
    category: 'Profile',
    action: 'Menu Click',
  },
  downloadReport: { // Whenever we click to download a consumption report
    trigger: 'click',
    type: 'event',
    category: 'Profile: Consumption',
    action: 'Download',
  },
  emailPreferenceAddAlert: { // Whenever we add an alert to our email preferences list
    trigger: 'click',
    type: 'event',
    category: 'Profile: Email Alerts',
    action: 'Add Alert',
  },
  emailPreferenceRemoveAlert: { // Whenever we remove an alert to our email preferences list
    trigger: 'click',
    type: 'event',
    category: 'Profile: Email Alerts',
    action: 'Remove Alert',
  },
  followingAddAlert: { // Whenever we add an alert to our follow history
    trigger: 'click',
    type: 'event',
    category: 'Profile: Following',
    action: 'Add Alert',
  },
  followingRemoveAlert: { // Whenever we remove an alert to our follow history
    trigger: 'click',
    type: 'event',
    category: 'Profile: Following',
    action: 'Remove Alert',
  },
  viewContentGuide: { // Whenever we click the Content Guide link
    trigger: 'click',
    type: 'event',
    category: 'Profile: Following',
    action: 'Use Our Content Guide',
    label: ''
  },
  researchBookmarkClick: { // Whenever we click the bookmark icon to remove a publication from our bookmarks
    trigger: 'click',
    type: 'event',
    category: 'Profile: Bookmarks',
    action: 'Remove Bookmark',
  },
  requestForEvent: { // Whenever we click the bookmark icon to remove a publication from our bookmarks
    trigger: 'click',
    type: 'event',
    category: 'Profile: Bookmarks',
    action: 'Remove Bookmark',
  },
  researchPublicationClick: { // Whenever we click title to open a specific publication
    trigger: 'click',
    type: 'event',
    category: 'Profile: Bookmarks',
    action: 'Open Bookmark',
  },
};
