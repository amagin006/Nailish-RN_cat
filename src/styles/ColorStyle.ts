import { GeneralDarkColor } from './colors/GeneralDarkColor';
import { GeneralNormalColor } from './colors/GeneralNormalColor';

const isDarkTheme = (): boolean => {
  // TODO: return boolean if darktheme or not
  return false;
};

export const AppGeneralColor = isDarkTheme() ? GeneralDarkColor : GeneralNormalColor;
