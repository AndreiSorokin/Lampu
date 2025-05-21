import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native'

const Enrollments = () => {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{t(`tickets`)}</Text>
    </View>
  )
}

export default Enrollments
