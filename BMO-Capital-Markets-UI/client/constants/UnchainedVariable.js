const unchainedSite = window.unchainedSite || {};
const appSettings = (unchainedSite && unchainedSite.AppSettings) || {};
const sitename = (unchainedSite && unchainedSite.sitename) || '';

export const sitenameVariable = {
  sitename,
  isEquity: sitename === 'Equity',
  isCorp: sitename === 'Corp',
};

export const appsettingsVariable = {};
Object.keys(appSettings).map(data => { appsettingsVariable[data] = appSettings[data]; });

export const unchainedRoles = unchainedSite && unchainedSite.Roles;

export const blurredImages = {
  libraryImage: unchainedSite && unchainedSite.BlurredImage && unchainedSite.BlurredImage.library_subject_images,
  publicationDetailImage: unchainedSite && unchainedSite.BlurredImage && unchainedSite.BlurredImage.publication_details_images,
};

export const unchainedSearchDefault = unchainedSite && unchainedSite.SearchDefaults;

export const unchainedAllowedEmailDomains = unchainedSite && unchainedSite.AllowedSSOEmailDomains;

export const unchainedPage = unchainedSite && unchainedSite.page;

export const unchainedStaticContent = unchainedSite && unchainedSite.StaticContent;
