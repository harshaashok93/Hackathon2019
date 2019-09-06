export const config = {
  loginHeaderBtnClick: { // Whenever we click to log in from the Header
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'Login',
  },
  loginSubmitBtnClick: { // Whenever we click the 'Login' link in the Login overlay
    trigger: 'click',
    type: 'event',
    category: 'Login & Register',
    action: 'Login Submit',
  },
  registerBtnClick: { // Whenever we click the 'Register' link in the Login overlay
    trigger: 'click',
    type: 'event',
    category: 'Login & Register',
    action: 'Register',
  },
  registerSubmitBtnClick: { // Whenever we Submit a new registration via the overlay
    trigger: 'click',
    type: 'event',
    category: 'Login & Register',
    action: 'Register Submit',
  },
  loginOverlay: { // When the login overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Login Overlay',
  },
  forgotPwdOverlay: { // When the password recovery overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Password Recovery Overlay',
  },
  forgotEmailOverlay: { // When the email recovery overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Email Recovery Overlay',
  },
  registrationOverlay: { // When the registration overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Registration Overlay',
  },
  registrationOverlayThankyou: { // When the regiatration submitted overlay panel is loaded
    trigger: 'click',
    type: 'page',
    name: 'Login - Registration Overlay - Thankyou',
  },
  logoutClick: { // Whenever we click to log out from the header
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
    action: 'Log Out',
  },
  profileNavItem: { // Whenever we navigate from the profile dropdown (Profile Settings/Featured Research/Calendar/Consumption Report)
    trigger: 'click',
    type: 'event',
    category: 'Main Menu',
  }
};
