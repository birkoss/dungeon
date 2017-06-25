cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore game.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk game

rm game.apk

~/Code/sdk/android/build-tools/23.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk game.apk
