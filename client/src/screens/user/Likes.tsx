import React from 'react'
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native'

const Likes = () => {
   const { t } = useTranslation();
   return (
      <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
         <Text>
            {t('likes')}
         </Text>
      </View>
   )
}

export default Likes
