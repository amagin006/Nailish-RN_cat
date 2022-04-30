import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// redux
import { useAppSelector } from '~/redux/hooks';

// components
import { TextAtom, TextInputAtom } from '~/components/atoms';
import { TipsColumnInputMolecules } from '~/components/molecules/ColumnMolecules/TipsColumnInputMolecules';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

// styles
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';

// util
import { MENU_ITME_COLORS } from '~/util/Consts/MenuItemColorConst';
import { IMenuItem } from '~/modules/Menu/MenuInterfaces';

// type
import { MainStackNavParamList } from '~/route/types';
import { MenuServices } from '~/modules/Menu/services/MenuServices';

interface AddEditMenuItemScreenProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'AddEditMenuItemScreen'>;
  route: RouteProp<MainStackNavParamList, 'AddEditMenuItemScreen'>;
}

const AddEditMenuItemScreen: React.FC<AddEditMenuItemScreenProps> = props => {
  const [selectedColor, setSelectedColor] = useState<string>(MENU_ITME_COLORS[0]);
  const [inputItemName, setInputItemName] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [error, setError] = useState<{
    nameError: string;
    tipError: string;
  }>({ nameError: '', tipError: '' });

  const userRedux = useAppSelector(state => state.user);

  useEffect(() => {
    const item = props.route.params?.menuItem;
    if (item) {
      setSelectedColor(item.color);
      setInputItemName(item.menuName);
      setTips(item.price);
    }
  }, []);

  const _onSelectItem = (item: string) => {
    setSelectedColor(item);
  };

  const _onChangeText = (text: string) => {
    setError(error => {
      error.nameError = '';
      return error;
    });
    setInputItemName(text);
  };

  const _onChangeTips = (text: string) => {
    setError(error => {
      error.tipError = '';
      return error;
    });
    setTips(text);
  };

  const _onPressAddNewItem = async () => {
    // error
    if (!inputItemName || !tips) {
      let newError = { ...error };
      if (!inputItemName) {
        newError.nameError = 'Please input item name';
      }
      if (!tips) {
        newError.tipError = 'Please input item name';
      }
      setError(newError);
      return;
    }

    const itemBody: IMenuItem = {
      menuName: inputItemName,
      color: selectedColor,
      price: tips,
    };
    const isSuccess = await MenuServices.addMenuItem(userRedux, itemBody);
    console.log('_onPressAddNewItem ,isSuccess', isSuccess);

    if (!isSuccess) {
      Alert.alert('', 'Something goes wrong.\nPlease try again.');
      props.navigation.pop();
      return;
    }
    props.navigation.navigate('SelectMenuListScreen', { updateItems: true });
  };

  const _onSelectedColor = () => {};

  const _renderColorItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity
        onPress={() => _onSelectItem(item)}
        style={[styles.colorBtnWrapper, { backgroundColor: item }]}>
        {item === selectedColor ? (
          <View style={styles.checkIconWrapper}>
            <FontAwesome5 name="check" color={AppGeneralColor.Palette.White} size={24} />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const _keyExtractor = (item: string) => {
    return `${item}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextAtom style={styles.nameInputTitleText}>Item name</TextAtom>
        <TextInputAtom
          containerStyle={styles.textInputContainerStyle}
          onChangeText={_onChangeText}
          value={inputItemName}
          error={!!error.nameError}
          errorText={error.nameError}
        />
        <TipsColumnInputMolecules
          container={styles.columnWrapper}
          onChangeTips={_onChangeTips}
          value={tips}
          error={error.tipError}
        />
      </View>

      <FlatList
        data={MENU_ITME_COLORS}
        renderItem={_renderColorItem}
        keyExtractor={_keyExtractor}
        numColumns={5}
        columnWrapperStyle={{ justifyContent: 'space-evenly' }}
      />

      <RoundButton
        containerStyle={styles.addBtnContainer}
        buttonColorType={IButtonColorType.Confirm}
        text={'Add New Item'}
        onPress={_onPressAddNewItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GeneralViewStyle.bodyWrapper,
  },
  inputContainer: {
    marginVertical: 30,
  },
  nameInputTitleText: {
    ...generalTextStyles.boldLittleNormalText,
  },
  textInputContainerStyle: {
    marginVertical: 8,
  },
  columnWrapper: {
    marginTop: 20,
  },
  colorBtnWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  checkIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnContainer: {
    marginTop: 40,
  },
  listFooter: {
    marginTop: 14,
    alignItems: 'center',
  },
  errorText: {
    color: AppGeneralColor.TextInput.Error,
  },
});

export default AddEditMenuItemScreen;
