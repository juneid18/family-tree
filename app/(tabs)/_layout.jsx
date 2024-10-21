import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY, // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 10,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,
          paddingVertical:10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={25} color={color} />,
          accessibilityLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={25} color={color} />,
          accessibilityLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Entypo name="flow-tree" size={25} color={color} />,
          accessibilityLabel: 'Family Tree',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={25} color={color} />,
          accessibilityLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
