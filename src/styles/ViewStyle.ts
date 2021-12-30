import { StyleSheet } from 'react-native';
import { AppGeneralColor } from './ColorStyle';
import { generalTextStyles } from './TextStyle';

export const GeneralNavStyles = StyleSheet.create({
  headerRight: {
    marginRight: 20,
  },
  headerRightText: {
    color: AppGeneralColor.Navigation.HeaderTextPrimary,
    fontSize: 16,
  },
});

export const GeneralViewStyle = StyleSheet.create({
  bodyWrapper: {
    marginHorizontal: '5%',
    marginBottom: 40,
  },
  menuWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftColumn: {
    width: '28%',
  },
  leftColumnText: {
    ...generalTextStyles.mediumLittleNormalText,
    color: AppGeneralColor.TextColor.Primary,
  },
  rightColumn: {
    width: '50%',
  },
  priceColumn: {
    marginTop: 10,
  },
  price: {
    width: 80,
    textAlign: 'right',
  },
  priceText: {
    ...generalTextStyles.mediumNormalText,
  },
});
