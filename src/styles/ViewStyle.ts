import { StyleSheet } from 'react-native';
import { AppGeneralColor } from './ColorStyle';

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
    marginHorizontal: '8%',
  },
  menuWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftColumn: {
    fontSize: 15,
    width: '28%',
    color: '#9c9c9c',
  },
  rightColumn: {
    width: '50%',
  },
  price: {
    fontSize: 16,
    width: 80,
    textAlign: 'right',
  },
});
