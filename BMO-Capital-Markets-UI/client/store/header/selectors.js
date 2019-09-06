export const initialState = {
  megaMenuOpen: false,
  selectedText: '',
  isOpen: false,
};
export const isMegaMenuOpen = (state = initialState) => state.megaMenuOpen;
export const getSelectedText = (state = initialState) => state.selectedText;
export const isOpen = (state = initialState) => state.isOpen;
