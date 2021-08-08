import React from 'react';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// components
import { TextAtom, TextInputAtom } from '~/components/atoms';
import { TextLeftAtom } from '~/components/atoms/TextAtom';
import { TipsColumnInputMolecules } from '~/components/molecules/ColumnMolecules/TipsColumnInputMolecules';

// styles
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';

// util
import { IMENU_ITME_COLORS, MENU_ITME_COLORS } from '~/util/Consts/MenuItemColorConst';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

interface AddMenuItemScreenProps {}

const AddMenuItemScreen: React.FC<AddMenuItemScreenProps> = () => {
  const [selectedItem, setSelectedItem] = useState<IMENU_ITME_COLORS | undefined>(undefined);
  const [inputItemName, setInputItemName] = useState<string>('');
  const [tips, setTips] = useState<string>('');

  const _onSelectItem = (item: IMENU_ITME_COLORS) => {
    setSelectedItem(item);
  };

  const _onChangeText = (text: string) => {
    setInputItemName(text);
  };

  const _onChangeTips = (text: string) => {
    setTips(text);
  };

  const _onPressAddNewItem = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextAtom style={styles.nameInputTitleText}>Item name</TextAtom>
        <TextInputAtom
          containerStyle={styles.textInputContainerStyle}
          onChangeText={_onChangeText}
          value={inputItemName}
        />
        <TipsColumnInputMolecules
          container={styles.columnWrapper}
          onChangeTips={_onChangeTips}
          value={tips}
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
    marginTop: 60,
  },
});

export default AddMenuItemScreen;
