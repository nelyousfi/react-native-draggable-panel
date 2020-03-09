import * as React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import DraggablePanel from 'react-native-draggable-panel';

import data from './data/data';
import Content from './components/Content';
import CloseButton from './components/CloseButton';

export default function() {
  const [statePanelVisible, toggleStatePanelVisibility] = React.useState(false);
  const refPanel = React.useRef();
  const animationPanel = React.useRef();
  const expandablePanel = React.useRef();
  const hideOnPressOutsidePanel = React.useRef();
  const overlayBackgroundColorPanel = React.useRef();
  const overlayOpacityPanel = React.useRef();
  const borderRadiusPanel = React.useRef();
  const heightPanel = React.useRef();
  const scrollablePanel = React.useRef();

  function renderItem({item}) {
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => {
          switch (item.key) {
            case 'state':
              toggleStatePanelVisibility(true);
              break;
            case 'ref':
              refPanel.current.show();
              break;
            case 'animation':
              animationPanel.current.show();
              break;
            case 'expandable':
              expandablePanel.current.show();
              break;
            case 'hideOnPressOutside':
              hideOnPressOutsidePanel.current.show();
              break;
            case 'overlayBackgroundColor':
              overlayBackgroundColorPanel.current.show();
              break;
            case 'overlayOpacity':
              overlayOpacityPanel.current.show();
              break;
          }
        }}
        style={[
          styles.item,
          {backgroundColor: `${item.color}11`, borderColor: item.color},
        ]}>
        <Text style={[styles.itemText, {color: item.color}]}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  function renderStatePanel() {
    return (
      <DraggablePanel
        visible={statePanelVisible}
        onDismiss={() => toggleStatePanelVisibility(false)}>
        <Content title={'State Panel'} />
      </DraggablePanel>
    );
  }

  function renderRefPanel() {
    return (
      <DraggablePanel ref={refPanel}>
        <CloseButton
          onPress={() => {
            refPanel.current.hide();
          }}
        />
        <Content title={'Ref Panel'} />
      </DraggablePanel>
    );
  }

  function renderAnimationPanel() {
    return (
      <DraggablePanel ref={animationPanel} animationDuration={2000}>
        <Content title={'Animation Panel'} />
      </DraggablePanel>
    );
  }

  function renderExpandablePanel() {
    return (
      <DraggablePanel ref={expandablePanel} expandable>
        <Content title={'Expandable Panel'} />
        <Content title={'Expandable Panel'} />
      </DraggablePanel>
    );
  }

  function renderHideOnPressOutsidePanel() {
    return (
      <DraggablePanel ref={hideOnPressOutsidePanel} hideOnPressOutside>
        <Content title={'Hide On Press Outside Panel'} />
      </DraggablePanel>
    );
  }

  function renderOverlayBackgroundColorPanel() {
    return (
      <DraggablePanel
        ref={overlayBackgroundColorPanel}
        overlayBackgroundColor={'#7e7e81'}>
        <Content title={'Overlay Background Color Panel'} />
      </DraggablePanel>
    );
  }

  function renderOverlayOpacityPanel() {
    return (
      <DraggablePanel ref={overlayOpacityPanel} overlayOpacity={1}>
        <Content title={'Overlay Opacity Panel'} />
      </DraggablePanel>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList style={styles.list} data={data} renderItem={renderItem} />
      {renderStatePanel()}
      {renderRefPanel()}
      {renderAnimationPanel()}
      {renderExpandablePanel()}
      {renderHideOnPressOutsidePanel()}
      {renderOverlayBackgroundColorPanel()}
      {renderOverlayOpacityPanel()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  item: {
    flex: 1,
    borderWidth: 1,
    padding: 40,
  },
  itemText: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 16,
  },
});
