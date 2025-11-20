import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { view } from './storybook.requires'

const StorybookUI = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
})

export default function StorybookUIRoot() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StorybookUI />
    </GestureHandlerRootView>
  )
}
