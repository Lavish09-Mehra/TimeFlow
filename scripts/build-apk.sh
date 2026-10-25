#!/usr/bin/env bash
set -euo pipefail

# Local toolchain paths used to build the TimeFlow debug APK.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export JAVA_HOME="$ROOT/.tools/jdk-21.0.13+9"
export ANDROID_HOME="$ROOT/.tools/android-sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

cd "$ROOT/Frontend"
npm run build
npx cap sync android
cd android
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
cp "$APK" "$ROOT/TimeFlow-debug.apk"
ls -lh "$ROOT/TimeFlow-debug.apk"
