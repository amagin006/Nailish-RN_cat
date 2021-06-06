import { Platform } from 'react-native';
import { fontScale } from '~/util/scaling/ScalingUtil';

export const FONT_SIZE = {
  BIG_XL: fontScale(34),
  BIG: fontScale(24),
  LITTLE_BIG: fontScale(22),
  MEDIUM: fontScale(20),
  LITTLE_MEDIUM: fontScale(18),
  NORMAL: fontScale(16),
  LITTLE_NORMAL: fontScale(14),
  THIN: fontScale(12),
  LITTLE_THIN: fontScale(10),
  SMALL: fontScale(8),
};

//TODO: Change font family
export const FONT_FAMILY = {
  FONT_REGULAR: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  FONT_MEDIUM: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  FONT_BOLD: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  FONT_ITALIC: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
};
