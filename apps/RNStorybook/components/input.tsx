import { useState } from 'react'
import { Text, TextInput, type TextInputProps, View } from 'react-native'

type InputProps = TextInputProps & {
  label?: string
  error?: string
  disabled?: boolean
}

const getBorderColor = (isFocused: boolean, error?: string) => {
  if (error) {
    return '#FF3B30'
  }

  return isFocused ? '#007AFF' : '#D1D1D6'
}

export const Input = ({ disabled, label, error, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const borderColor = getBorderColor(isFocused, error)

  return (
    <View style={{ gap: 4 }}>
      <Text id="input-label" style={{ fontSize: 14, color: '#3C3C43' }}>
        {label}
      </Text>

      <TextInput
        aria-labelledby="input-label"
        aria-disabled={disabled}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          borderColor,
          backgroundColor: disabled ? '#F5F5F5' : 'transparent',
        }}
        editable={!disabled}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
        {...props}
      />

      {error && <Text style={{ fontSize: 12, color: '#FF3B30' }}>{error}</Text>}
    </View>
  )
}
