import { TextInput, View, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

import { useTranslation } from 'react-i18next';


interface SearchProps {
   searchQuery: string;
   setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery }) => {
   const { t } = useTranslation();
   return(
      <View style={styles.container}>
      <Ionicons name="search" size={20} color="#aaa" style={styles.icon} />
      <TextInput
         placeholder={t('findAnEvent')}
         value={searchQuery}
         onChangeText={setSearchQuery}
         style={styles.input}
      />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#FF8011',
      color: '',
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 10,
      margin: 10,
   },
   icon: {
      marginRight: 8,
   },
   input: {
      flex: 1,
      height: 40,
   },
});

export default Search;