import React from 'react'
import { View, Text, ScrollView, TouchableOpacity  } from 'react-native'
import { useTranslation } from 'react-i18next';

import CustomButton from 'src/components/CustomButton';
import Arrow from '../../../assets/images/arrow_left.svg';
import FriendsIcon from '../../../assets/images/membership/friends.svg';
import DocIcon from '../../../assets/images/membership/doc.svg';
import SearchIcon from '../../../assets/images/membership/search.svg';
import HeadIcon from '../../../assets/images/membership/head.svg';


const Membership: React.FC<Props> = ({ navigation }) => {
   const { t } = useTranslation();

   const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
   };

   const currentDate = new Date();
   const oneYearLater = new Date();
   oneYearLater.setFullYear(currentDate.getFullYear() + 1);
   return (
      <ScrollView contentContainerStyle={{ marginTop: 100, padding: 20, alignItems: 'center' }}>
         {/* Header Section */}
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Arrow width={36} height={36} style={{ left: -170, top: -20 }} />
          </TouchableOpacity>
         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' }}>
           <Text style={{ fontWeight: 'bold', fontSize: 36, marginLeft: 10 }}>{t('membership')}</Text>
         </View>

         {/* Membership Duration Block */}
         <View style={{
           justifyContent: 'center',
           alignItems: 'center',
           backgroundColor: '#FF9A42',
           width: 350,
           height: 100,
           borderRadius: 10,
           marginBottom: 20
         }}>
           <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{t('membership_duration')}</Text>
           <Text style={{ padding: 10 }}>
             {t('membershipInEffect')}: {formatDate(currentDate)} – {formatDate(oneYearLater)}
           </Text>
         </View>

         {/* Description Section */}
         <View style={{ width: 350 }}>
           <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20 }}>{t('membershipWhy')}</Text>
           <Text>{t('membershipWhyText')}</Text>
      
           <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 40 }}>{t('membershipWhat')}</Text>
         </View>

         {/* Info Cards */}
         {[
           { Icon: HeadIcon, text: t('whatText1') },
           { Icon: SearchIcon, text: t('whatText2') },
           { Icon: DocIcon, text: t('whatText3') },
           { Icon: FriendsIcon, text: t('whatText4') }
         ].map(({ Icon, text }, idx) => (
           <View
             key={idx}
             style={{
               flexDirection: 'row',
               marginTop: 30,
               alignItems: 'center',
               borderColor: '#FF9A42',
               borderWidth: 2,
               borderRadius: 10,
               backgroundColor: '#fff',
               padding: 10,
               width: 350
             }}
           >
             <View style={{
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: '#FF9A42',
               borderRadius: 10,
               width: 80,
               height: 80,
               marginRight: 10
             }}>
               <Icon />
             </View>
             <Text style={{ flex: 1 }}>{text}</Text>
           </View>
         ))}

         {/* Logout Button */}
         <CustomButton
           title={t('logout')}
           // onPress={}
           style={{
               justifyContent: 'center',
               alignItems: 'center',
               width: 200,
               height: 60,
               marginTop: 40
           }}
         />
         </ScrollView>
   )
}

export default Membership
