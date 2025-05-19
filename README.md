# Lampu

I am using Expo go, not development build
If I use development build I need to provide REVERSE_CLIENT_ID field which in its turn requires setting up Google login on firebase
I am NOT going to use google login, I only need login with email and password

Do I need to use development build and set op the google auth on firebase, even though I am not going to use it anyway?
Or I can go with Expo Go
users have to stay logged in across restarts


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