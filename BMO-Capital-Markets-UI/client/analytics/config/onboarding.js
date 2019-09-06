export const config = {
  sectorOverlay: { // When the interested sectors overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Interested Sectors Overlay'
  },
  subSectorOverlay: { // When the interested sub-sectors overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Interested Subsectors Overlay'
  },
  analystsOverlay: { // When the interested analysts overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Interested Analysts Overlay'
  },
  registrationCompOverlay: { // When the registration complete overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Registration Setup Complete Overlay'
  },
  trialMemberOverlay: { // When the trial welcome overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login:  Trial Membership Welcome Overlay'
  },
  trialMemberErrorOverlay: { // When the trial registration error overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Trial Membership Error Overlay'
  },
  skipSectorOverlay: { // Whenever we choose to skip the selection of sectors
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Skip'
  },
  sectorNextBtnClick: { // Whenever the next button is clicked with the sectors chosen
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Interested Sectors'
  },
  subSectorNextBtnClick: { // When the sub-sectors overlay panel is loaded
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Interested Sub-Sectors'
  },
  analystsNextBtnClick: { // Whenever the next button is clicked with the analysts chosen
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Interested Analysts'
  },
  trialMemberContinueBtnClick: { // When we click to submit with the continue button
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Welcome'
  },
  trialMemberCancelBtnClick: { // When there is an error and we click to cancel the account creation
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Error',
    label: 'Cancel Registration'
  },
  trialMemberContactUsBtnClick: { // When there is an error and we click to contact BMO about the issue
    trigger: 'click',
    type: 'event',
    category: 'Onboarding',
    action: 'Error',
    label: 'Contact BMO'
  }
};
