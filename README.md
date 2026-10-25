<div align="center">

<img src="./Frontend/assets/icon-only.png" alt="TimeFlow app icon" width="150" />

<h1>TimeFlow</h1>

<p><strong>Time flows. Make it count.</strong></p>

<p>
  A dark, offline-first deadline countdown, stopwatch, and notes workspace for the web and Android.
</p>

<p>
  <a href="./TimeFlow-debug.apk">
    <img src="https://img.shields.io/badge/Download-Debug%20APK-2ea44f?style=for-the-badge&logo=android&logoColor=white" alt="Download TimeFlow APK" />
  </a>
  <a href="https://github.com/Lavish09-Mehra/TimeFlow">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository" />
  </a>
  <a href="https://www.linkedin.com/in/lavish09dev">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn profile" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Capacitor-8.5-119EFF?style=flat-square&logo=capacitor&logoColor=white" alt="Capacitor 8" />
  <img src="https://img.shields.io/badge/Android-7.0%2B-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android 7.0+" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Download](#download)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Android Build](#android-build)
- [Usage Guide](#usage-guide)
- [Data and Privacy](#data-and-privacy)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author and Connect](#author-and-connect)
- [Acknowledgements](#acknowledgements)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

**TimeFlow** is a personal productivity app built around one idea: a deadline should be visible, honest, and hard to ignore.

It combines three tools in one dark, focused interface:

1. **A live countdown** to a single meaningful deadline.
2. **A daily stopwatch** for tracking focused work and sessions.
3. **A notes workspace** for plain notes, checklists, and hand-drawn canvas notes.

The web app is built with React, TypeScript, Vite, and Tailwind CSS. The Android app wraps the same web experience with **Capacitor**, so the interface and data model stay consistent across platforms.

Everything runs locally on the device. There is no account, no backend, and no analytics.

---

## Download

### Android APK

| Item | Details |
| --- | --- |
| **Download** | [**TimeFlow-debug.apk**](./TimeFlow-debug.apk) |
| **Size** | 8.3 MB (8,637,848 bytes) |
| **App name** | TimeFlow |
| **Package** | `com.timeflow.app` |
| **Version** | 1.0 (versionCode 1) |
| **Minimum Android** | Android 7.0 / API 24 |
| **Target Android** | Android 16 / API 36 |
| **Build type** | Debug, signed with the Android debug key |

**SHA-256 checksum:**

```text
81e29a3544366e3aff55507596fb4865a0ee64732f70ba204f79e4df1c927c4e
```

The checksum is also available in [`TimeFlow-debug.apk.sha256`](./TimeFlow-debug.apk.sha256).

> For versioned public downloads, use the repository's [GitHub Releases](https://github.com/Lavish09-Mehra/TimeFlow/releases) page. Upload `TimeFlow-debug.apk` there if you want a stable download URL outside the repository.

### How to install on Android

1. Download or copy `TimeFlow-debug.apk` to your phone.
2. Open the APK from **Files**, **Downloads**, or your browser.
3. If prompted, allow **Install unknown apps** for the app you are installing from.
4. If Google Play Protect shows a warning because this is a debug build, tap **Install anyway**.
5. Open **TimeFlow** from your app drawer.

If an older TimeFlow build is already installed with a different signing key, uninstall it first, then install this APK.

---

## Features

### Deadline countdown

- Counts down in six units: **months, weeks, days, hours, minutes, and seconds**.
- Updates every second with a blinking separator animation.
- Month-aware date math handles month-end differences correctly.
- Shows a finished state when the target time passes.
- The selected target is saved in `localStorage` and restored on the next launch.
- The default target is **January 1 of the following year** until you choose your own.

### First-run commitment flow

The first time you set a deadline, TimeFlow asks you to slow down:

1. Choose your target date and time.
2. Write **why** this deadline matters.
3. Confirm your commitment with a checkbox.
4. Start the countdown.

This flow is shown only once. After completion, the app remembers that setup is done.

### Change Date protection

Changing a deadline should not be a casual click. When a countdown is active, **Settings → Change target date/time** opens a **Note to Self** screen first.

You have two honest choices:

- **“I am sorry. I will not even think of quitting.”** — closes the note and returns home.
- **“I give up. The reason is me. Sorry to myself.”** — unlocks the date/time picker.

This friction is intentional. It protects the promise you made to yourself.

### Stopwatch and session tracking

- Embedded stopwatch powered by `public/stopwatch.html`.
- **Start**, **Pause**, **Resume**, and **Reset today** controls.
- **Reset today** archives the current day's session into **Earlier days** before clearing the active timer.
- Tracks sessions for today and earlier days.
- Keeps running state, today's sessions, and archived history in `localStorage` under `stopwatch-v1`.
- Uses a large digital display designed for the same dark visual language as the app.

### Notes, lists, and canvas

The notes workspace is designed as a focused dark panel with a three-button dock:

- **+ New Note** — create a plain text note.
- **New List** — create a checklist.
- **Canvas** — draw a sketch and save it as a note.

Notes support:

- Titles and body text.
- Pinned notes.
- Color labels: **Neutral, Warm Amber, Emerald, Sky Blue, Purple, and Rose Pink**.
- Categories: **All, Personal, Work, Ideas, and Urgent**.
- Checklist items with add, toggle, and delete actions.
- A delete confirmation modal.
- Canvas sketches stored as image data.

The notes UI intentionally avoids visual noise:

- No white cards.
- No box shadows.
- No “Saved” or “Deleted item” toast popups.
- No “Last updated” timestamp.
- Cards use the selected note color as a translucent tint and border.

Notes persist in `localStorage` under `timeflow_notepad_items_v1`.

### Settings

The settings menu includes:

- **Change target date/time**
- **Change background color**
- **Delete data**
- **About this project**

### Background picker

- Choose from a curated set of dark background colors.
- Use the custom color input for any color.
- Reset to the default slate background.
- The selected background is saved in `localStorage` and restored on launch.

### About and external links

The About panel contains the TimeFlow story, the GitHub repository link, and the LinkedIn profile link. On Android, links open in the system browser through the **Capacitor Browser** plugin instead of trapping you inside the WebView.

### Dark, responsive interface

- Always-dark visual theme with the TimeFlow logo at the top and a smaller logo divider in the middle.
- Mobile-first spacing and sizing.
- Countdown and notes panels are constrained for comfortable reading on phones.
- Designed for both the browser and the Android WebView.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19.3, React DOM 19.3 |
| Language | TypeScript 6.0 |
| Build tool | Vite 8.3 |
| Styling | Tailwind CSS 4.3, custom CSS, inline styles |
| Icons | lucide-react 1.61 |
| Native wrapper | Capacitor 8.5.3 |
| External links | @capacitor/browser 8.0.5 |
| Android build | Gradle 8.14.3, Android Gradle Plugin 8.13.0 |
| Android SDK | compileSdk 36, targetSdk 36, minSdk 24 |
| Icon and splash generation | @capacitor/assets 3.0.5, sharp |
| Storage | Browser/WebView `localStorage` |

---

## Project Structure

```text
TimerDate/
├── Frontend/
│   ├── src/
│   │   ├── App.tsx                     # Countdown, settings, commitment flows, page shell
│   │   ├── AndroidNotepad.tsx          # Notes, lists, canvas, note editor
│   │   ├── index.css                   # Tailwind import, scrollbar and animation styles
│   │   ├── main.tsx                    # React entry point
│   │   ├── App.css                     # Reserved app stylesheet
│   │   ├── Pages/home.tsx              # Legacy/unused home component
│   │   └── TimeFlow Geometric Logo.png # Source logo
│   ├── public/
│   │   ├── stopwatch.html              # Embedded stopwatch and session history
│   │   └── jot-notepad.html            # Legacy notepad page
│   ├── assets/
│   │   ├── icon-only.png               # App icon source
│   │   ├── icon-foreground.png         # Adaptive icon foreground
│   │   ├── icon-background.png         # Adaptive icon background
│   │   ├── splash.png                  # Splash source
│   │   └── splash-dark.png             # Dark splash source
│   ├── android/                        # Capacitor Android project
│   │   ├── app/
│   │   ├── gradle/
│   │   ├── build.gradle
│   │   ├── variables.gradle            # SDK and AndroidX versions
│   │   └── gradlew
│   ├── dist/                           # Production web build (generated)
│   ├── capacitor.config.ts             # App ID, app name, web directory
│   ├── index.html                      # Vite HTML entry and page title
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── scripts/
│   └── build-apk.sh                    # Local web + Capacitor + Gradle build
├── Plan.md                             # Original project idea
├── TimeFlow-debug.apk                  # Installable debug APK
├── TimeFlow-debug.apk.sha256           # APK checksum
├── .env                                # Local environment (ignored by git)
├── .env.example                        # Global environment template
├── README.md
├── LICENSE                             # MIT License
└── .gitignore
```

Generated Android build outputs, copied web assets, local SDK paths, the `.tools/` toolchain, and the local `.env` file are intentionally excluded from version control.

---

## Getting Started

### Prerequisites

For the web app:

- **Node.js 20+** (tested with Node 24.22.0)
- **npm 10+**
- A modern browser

For the Android build:

- **JDK 21**
- **Android SDK Platform 36**
- **Android SDK Build-Tools 36.0.0** (the build may also install 35.0.0 automatically)
- Android Studio is optional but useful for inspecting the native project

> The actual app dependencies live in `Frontend/package.json`. You can run commands from `Frontend/`, or use the root convenience scripts such as `npm run dev` and `npm run build`, which delegate to the frontend.

### Clone the repository

```bash
git clone https://github.com/Lavish09-Mehra/TimeFlow.git
cd TimeFlow

# Optional: create your local environment file from the template
cp .env.example .env

cd Frontend
```

The root `.env` file is optional. The app has safe fallbacks for every environment value, so it still runs if the file is missing.

### Install dependencies

```bash
npm install
```

### Run the web app in development

```bash
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

### Build the web app for production

```bash
npm run build
```

The output is written to `Frontend/dist/`.

To preview the production build locally:

```bash
npm run preview
```

---

## Android Build

### Option 1: Install the prebuilt APK

Download [`TimeFlow-debug.apk`](./TimeFlow-debug.apk) and follow the [installation steps](#how-to-install-on-android).

### Option 2: Build the APK from source

From the repository root:

```bash
./scripts/build-apk.sh
```

The script performs the full pipeline:

1. Builds the web app with `npm run build`.
2. Syncs the web build and Capacitor plugins with `npx cap sync android`.
3. Runs `./gradlew assembleDebug`.
4. Copies the APK to `TimeFlow-debug.apk` in the repository root.

The script uses the local toolchain paths from this workspace:

```text
.tools/jdk-21.0.13+9
.tools/android-sdk
```

If your JDK or Android SDK lives somewhere else, edit the `JAVA_HOME` and `ANDROID_HOME` values in `scripts/build-apk.sh`, or set them in your shell before building.

### Manual Android build

```bash
cd Frontend

# 1. Build the web assets
npm run build

# 2. Copy assets and plugins into the Android project
npx cap sync android

# 3. Build the debug APK
cd android
./gradlew assembleDebug
```

The generated APK is here:

```text
Frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### Set up the Android SDK manually

If `sdkmanager` is available:

```bash
export JAVA_HOME=/path/to/jdk-21
export ANDROID_HOME=/path/to/android-sdk
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"
```

Create `Frontend/android/local.properties` if Gradle cannot find the SDK:

```properties
sdk.dir=/absolute/path/to/android-sdk
```

### Open the native project

If Android Studio is installed:

```bash
cd Frontend
npx cap open android
```

### Signing notes

- The included APK is a **debug build**. It is signed with the standard Android debug keystore, which is fine for personal sideloading but not for Play Store distribution.
- To publish, create a release keystore, configure a `release` signing config in `Frontend/android/app/build.gradle`, and run `./gradlew assembleRelease`.
- Never commit a production keystore or its passwords to this repository.

---

## Usage Guide

### 1. First launch

1. Open the app.
2. Pick your target date and time.
3. Press **Start**.
4. Write the reason behind your deadline.
5. Check the commitment box.
6. Confirm and begin the countdown.

### 2. Read the countdown

The main panel shows six digit groups:

```text
Months : Weeks : Days : Hours : Minutes : Seconds
```

The values update every second. When the target passes, the panel switches to a finished state and the status line tells you the deadline has arrived.

### 3. Track focused time

Use the stopwatch panel below the countdown:

- **Start** begins a session.
- **Pause** stops the active timer.
- **Resume** continues it.
- **Reset today** archives the current session under **Earlier days**, then clears today's active timer.
- Session history is grouped into **Sessions today** and **Earlier days**.

### 4. Create a note

1. Tap **+ New Note**.
2. Add a title and body.
3. Optionally pin it, choose a color, and assign a category.
4. Save the note.
5. Tap a card to reopen and edit it.

### 5. Create a checklist

1. Tap **New List**.
2. Add a title.
3. Type an item and add it to the checklist.
4. Tap an item to mark it complete.
5. Use the delete control to remove an item.

### 6. Draw a canvas note

1. Tap **Canvas**.
2. Pick a pen color.
3. Draw with a mouse, stylus, or finger.
4. Use the eraser or clear button as needed.
5. Save the sketch as a note.

### 7. Change the background

1. Open **Settings**.
2. Choose **Change background color**.
3. Pick a preset, use the custom color input, or press **Reset**.
4. Press **Done**.

The choice is saved and restored the next time you open the app.

### 8. Change the target date

1. Open **Settings**.
2. Choose **Change target date/time**.
3. If a countdown is active, read the **Note to Self** screen.
4. Select **“I give up. The reason is me. Sorry to myself.”** to unlock the picker.
5. Choose the new date and time.
6. Confirm the change.

### 9. Delete all data

1. Open **Settings**.
2. Choose **Delete data**.
3. Confirm the browser/WebView dialog.

This clears the countdown setup, target, notes, lists, canvas sketches, and stopwatch history, and resets the background to its default color.

---

## Data and Privacy

TimeFlow is local-first. It does **not** send your notes, deadlines, or stopwatch history to a server.

Data is stored in the browser or Android WebView `localStorage`:

| Key | Purpose |
| --- | --- |
| `timerdate-setup` | Marks the first-run commitment flow as complete |
| `timerdate-why` | The reason you wrote for your deadline |
| `timerdate-target` | The saved target date in ISO format |
| `timerdate-bg` | The selected page background color |
| `timeflow_notepad_items_v1` | Notes, checklists, colors, categories, pins, and canvas sketches |
| `stopwatch-v1` | Stopwatch state, today's sessions, and earlier-day history |
| `android_notepad_todo_items` | Legacy key cleared by **Delete data** |
| `android_notepad_theme` | Legacy key cleared by **Delete data** |
| `jot-v1` | Legacy key cleared by **Delete data** |

### Important storage notes

- Data is scoped to the browser origin or Android app WebView.
- Clearing browser site data, clearing Android app storage, or uninstalling the app removes your data.
- There is no cloud backup or account sync yet. Export/import is on the roadmap.
- The only network activity is opening external links from the About panel in your browser.

---

## Configuration

| File | What it controls |
| --- | --- |
| `Frontend/capacitor.config.ts` | App ID, app name, web directory, background color, Android behavior |
| `Frontend/android/variables.gradle` | `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`, AndroidX versions |
| `Frontend/android/app/build.gradle` | Application ID, version code/name, dependencies, signing |
| `Frontend/android/app/src/main/res/values/strings.xml` | Android app label and package strings |
| `Frontend/android/app/src/main/res/values/colors.xml` | Android theme colors |
| `Frontend/android/app/src/main/res/values/styles.xml` | Status bar, navigation bar, splash theme |
| `Frontend/index.html` | Web page title and theme color |
| `Frontend/vite.config.ts` | React and Tailwind Vite plugins; reads the root `.env` through `envDir: '..'` |
| `Frontend/assets/` | Icon and splash source images |
| `.env` | Local global environment values (ignored by git) |
| `.env.example` | Tracked template for the global environment |

### Global environment

The repository uses one root-level `.env` file. Vite loads it through `envDir: '..'` in `Frontend/vite.config.ts`, so the frontend and Android build share the same public configuration. The real `.env` is ignored by Git; commit only `.env.example`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_APP_NAME` | `TimeFlow` | Browser tab title and public app name |
| `VITE_APP_ID` | `com.timeflow.app` | Android application ID reference |
| `VITE_APP_VERSION` | `1.0.0` | Public app version reference |
| `VITE_DEFAULT_BG` | `#36454F` | Default page background before the user picks one |
| `VITE_ANDROID_MIN_SDK` | `24` | Minimum Android SDK reference |
| `VITE_ANDROID_TARGET_SDK` | `36` | Target Android SDK reference |
| `VITE_GITHUB_URL` | TimeFlow repository URL | GitHub link shown in About |
| `VITE_LINKEDIN_URL` | Author LinkedIn URL | LinkedIn link shown in About |

Only variables prefixed with `VITE_` are exposed to the browser. Do not put private tokens or secrets in a `VITE_` variable.

### App identity

```text
App name:   TimeFlow
App ID:     com.timeflow.app
Web assets: Frontend/dist
```

### Regenerate Android icons and splash screens

After changing the source images in `Frontend/assets/`:

```bash
cd Frontend
npx capacitor-assets generate --android
npx cap sync android
```

Then rebuild the APK.

---

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with TypeScript and build production assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Capacitor and Android

| Command | Description |
| --- | --- |
| `npx cap sync android` | Copy web assets and update native plugins |
| `npx cap open android` | Open the Android project in Android Studio |
| `npx capacitor-assets generate --android` | Generate launcher icons and splash screens |
| `./gradlew assembleDebug` | Build the debug APK |
| `./gradlew assembleRelease` | Build a release APK (requires signing setup) |

### Repository root

These convenience scripts delegate to the frontend:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production web app |
| `npm run preview` | Preview the production web app |
| `npm run lint` | Run ESLint |
| `npm run apk` | Build the web app, sync Capacitor, build the APK, and copy it to the root |
| `./scripts/build-apk.sh` | Run the APK build script directly |

---

## Troubleshooting

### `java: command not found` or Gradle cannot find Java

Set `JAVA_HOME` before building:

```bash
export JAVA_HOME=/path/to/jdk-21
export PATH="$JAVA_HOME/bin:$PATH"
```

Verify:

```bash
java -version
```

### `SDK location not found`

Create `Frontend/android/local.properties`:

```properties
sdk.dir=/absolute/path/to/android-sdk
```

Or export:

```bash
export ANDROID_HOME=/absolute/path/to/android-sdk
```

### `sdkmanager: command not found`

Use the full path:

```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --version
```

If the command-line tools are missing, download the Android command-line tools and place them under `$ANDROID_HOME/cmdline-tools/latest/`.

### The first Gradle build is slow

The first Android build downloads Gradle, AndroidX dependencies, and possibly Build-Tools. Expect several hundred megabytes of downloads. Later builds are much faster.

### `App not installed` or signature mismatch

Uninstall any existing TimeFlow build first:

```bash
adb uninstall com.timeflow.app
```

Then install the new APK. Different signing keys cannot upgrade the same package.

### Play Protect warns about the APK

This is a debug build signed with a debug key. Choose **Install anyway** if you trust the source. For public distribution, build and sign a release APK.

### External links do not open on Android

Make sure the Browser plugin is synced and the APK was rebuilt after adding it:

```bash
cd Frontend
npx cap sync android
cd android
./gradlew assembleDebug
```

### White screen after launching the Android app

Rebuild the web assets and sync them:

```bash
cd Frontend
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

### Notes or countdown data disappeared

Data lives in `localStorage`. Clearing app storage, clearing browser site data, or uninstalling the app removes it. There is currently no cloud sync or automatic backup.

### The countdown shows the default date after an update

Older builds did not persist the target date. The current build stores it under `timerdate-target`. Set your target once with the current build and it will be restored on future launches.

---

## Roadmap

- [ ] Add JSON export/import for notes and settings.
- [ ] Add local notifications and deadline reminders.
- [ ] Add a home-screen widget for the countdown.
- [ ] Add a release-signed APK and a GitHub Releases workflow.
- [ ] Add automated tests for date math and notes persistence.
- [ ] Improve tablet and foldable layouts.
- [ ] Add more canvas tools and note templates.
- [ ] Add optional, privacy-first cloud sync.
- [ ] Improve accessibility labels and keyboard navigation.

---

## Contributing

Contributions, bug reports, and design feedback are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes.
4. Run the checks:

   ```bash
   cd Frontend
   npm run lint
   npm run build
   ```

5. Commit and push your branch.
6. Open a pull request with a clear description and screenshots if the UI changed.

### Notes UI guidelines

Please keep the notes workspace consistent with the current design:

- No white cards.
- No box shadows.
- No toast popups for save/delete actions.
- Use the selected note color as a translucent tint and border.
- Keep spacing compact and mobile-friendly.

---

## Author and Connect

**Lavish Mehra**

- **GitHub:** [@Lavish09-Mehra](https://github.com/Lavish09-Mehra)
- **Repository:** [Lavish09-Mehra/TimeFlow](https://github.com/Lavish09-Mehra/TimeFlow)
- **LinkedIn:** [lavish09dev](https://www.linkedin.com/in/lavish09dev)

If TimeFlow helps you take your own deadline seriously, consider starring the repository or sharing it with someone who needs the push.

---

## Acknowledgements

- [React](https://react.dev/) for the UI foundation.
- [Vite](https://vite.dev/) for the fast development and build workflow.
- [Tailwind CSS](https://tailwindcss.com/) for the styling utilities.
- [Capacitor](https://capacitorjs.com/) for the Android wrapper and native bridge.
- [lucide-react](https://lucide.dev/) for the icon set.
- [Android](https://www.android.com/) for the platform and build tools.

The TimeFlow name, logo, story, and interface were created for this project.

---

## Disclaimer

TimeFlow is an independent personal project. It is not affiliated with Google, Android, or any other company mentioned in this repository.

The APK provided here is a **debug build** intended for personal testing and sideloading. It is not published on the Google Play Store and comes with no warranty. Back up anything important before clearing app data or reinstalling.

---

## License

TimeFlow is released under the [MIT License](./LICENSE).

Copyright (c) 2026 Lavish Mehra.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided the copyright notice and permission notice are included. The software is provided **“as is”**, without warranty of any kind.

Forking, remixing, and building on TimeFlow are welcome.
