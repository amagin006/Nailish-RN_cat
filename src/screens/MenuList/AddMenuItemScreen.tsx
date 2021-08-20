import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// components
import { TextAtom, TextInputAtom } from '~/components/atoms';
import { TipsColumnInputMolecules } from '~/components/molecules/ColumnMolecules/TipsColumnInputMolecules';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

// styles
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';

// util
import { IMENU_ITME_COLORS, MENU_ITME_COLORS } from '~/util/Consts/MenuItemColorConst';
import MenuFactory from '~/modules/Menu/services/MenuFactory';
import { RootState } from '~/redux/store';
import { IMenuItem } from '~/modules/Menu/MenuInterfaces';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';

interface AddMenuItemScreenProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'AddMenuItemScreen'>;
}

const MenuPresenter = MenuFactory.getCustomerListPresenter();

const AddMenuItemScreen: React.FC<AddMenuItemScreenProps> = props => {
  const [selectedItem, setSelectedItem] = useState<IMENU_ITME_COLORS | undefined>(undefined);
  const [inputItemName, setInputItemName] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [error, setError] = useState<{
    nameError: string;
    tipError: string;
    colorError: string;
  }>({ nameError: '', tipError: '', colorError: '' });

  const userRedux = useSelector((state: RootState) => state.user);

  const _onSelectItem = (item: IMENU_ITME_COLORS) => {
    setError(error => {
      error.colorError = '';
      return error;
    });
    setSelectedItem(item);
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
    if (!inputItemName || !tips || !selectedItem) {
      let newError = { ...error };
      if (!inputItemName) {
        newError.nameError = 'Please input item name';
      }
      if (!tips) {
        newError.tipError = 'Please input item name';
      }
      if (!selectedItem) {
        newError.colorError = 'Please select color';
      }
      setError(newError);
      return;
    }

    const itemBody: IMenuItem = {
      menuName: inputItemName,
      color: selectedItem.value,
      price: tips,
    };
    const isSuccess = await MenuPresenter.addMenuItem(userRedux, itemBody);
    if (!isSuccess) {
      Alert.alert('', 'Something goes wrong.\nPlease try again.');
    }
    props.navigation.pop();
    console.log('_onPressAddNewItem');
  };

  const _renderColorItem = ({ item }: { item: IMENU_ITME_COLORS }) => {
    const bgcolor = item.value;
    return (
      <TouchableOpacity
        onPress={() => _onSelectItem(item)}
        style={[styles.colorBtnWrapper, { backgroundColor: bgcolor }]}>
        {item.id === selectedItem?.id ? (
          <View style={styles.checkIconWrapper}>
            <FontAwesome5 name="check" color={AppGeneralColor.Palette.White} size={24} />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const _keyExtractor = (item: IMENU_ITME_COLORS) => {
    return `${item.id}`;
  };

  const _menuColorFooter = () => {
    return (
      <>
        {!!error.colorError ? (
          <View style={styles.listFooter}>
            <TextAtom style={styles.errorText}>{error.colorError}</TextAtom>
          </View>
        ) : (
          <View />
        )}
      </>
    );
  };

  console.log('error.nameError----return ', error.nameError);
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
        ListFooterComponent={_menuColorFooter}
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

export default AddMenuItemScreen;
