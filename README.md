# Lampu

Why am I getting "iOS Bundled 1050ms index.ts (1577 modules)
 ERROR  [runtime not ready]: Invariant Violation: Your JavaScript code tried to access a native module that doesn't exist. 

If you're trying to use a module that is not supported in Expo Go, you need to create a development build of your app. See https://docs.expo.dev/development/introduction/ for more info., js engine: hermes"  if with SDK 52 my app worked?

## BackEnd:

Change verificationLink
Change appDeepLink`
Remove NODE_ENV=development and user in FirebaseAuthGuard 

## FrontEnd:

Register com.yourname.lampu.client (com.anonymous.client) in Apple Developer portal

Profile, change info, update password
Forgot password
Enrollment, cancelation
Admin panel (create/delete/update events, assign membership)
Notification reminders for users
Notifications if users cancel booking
Protect routes and redirect