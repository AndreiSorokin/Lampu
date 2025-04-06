import { NavigatorScreenParams } from '@react-navigation/native';

export type EventStackParamList = {
   Home: undefined;
   Events: undefined;
   Event: undefined;
   'Create event': undefined;
};

export type RootTabParamList = {
   Events: NavigatorScreenParams<EventStackParamList>;
   Login: undefined;
};