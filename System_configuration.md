#System Setup


## Platform-Specific Setup

### Windows Setup Guide

For Windows users, follow these steps to set up your development environment:

#### Install Node.js with NVM for Windows

NVM (Node Version Manager) is recommended for managing Node.js versions:

```bash
# Download NVM for Windows:
# https://github.com/coreybutler/nvm-windows/releases

# After installation, open a new command prompt and install Node.js
nvm install 16.x
nvm use 16.x

# Verify installation
node -v
npm -v
```

#### Java Development Kit (JDK) Setup

React Native Android development requires JDK 11:

```bash
# Check Java version
java -version

# Install using Chocolatey (recommended)
choco install openjdk11

# Set JAVA_HOME in Windows environment variables
# Open Environment Variables > System Variables > New
# Variable name: JAVA_HOME
# Variable value: C:\Program Files\Java\jdk-11
```

#### Android Studio & SDK Configuration

1. Download and install Android Studio from [https://developer.android.com/studio](https://developer.android.com/studio)
2. During installation, make sure to select:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
3. Configure the ANDROID_HOME environment variable:
   ```
   # Open Environment Variables > System Variables > New
   # Variable name: ANDROID_HOME
   # Variable value: C:\Users\USERNAME\AppData\Local\Android\Sdk
   ```
4. Add platform-tools to your Path:
   ```
   # Open Environment Variables > System Variables > Find Path > Edit
   # Add new entry:
   %ANDROID_HOME%\platform-tools
   ```

#### Create a Virtual Device

1. Open Android Studio
2. Click on "More Actions" > "Virtual Device Manager"
3. Click "Create Device"
4. Select a device (e.g., Pixel 4) and click "Next"
5. Download a system image (recommend API 30: Android 11) and click "Next"
6. Name your device and click "Finish"

#### Windows-Specific Troubleshooting

##### Path Length Limitations
Windows has path length limitations. To resolve this:

```bash
# Enable long paths in Windows 10/11
# Run in PowerShell as Administrator
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
```

##### Permission Issues
If you encounter permission issues:

```bash
# Run as Administrator:
# Command Prompt or PowerShell shortcut > Right-click > Run as administrator
```

##### Port Issues
If Metro bundler can't start due to port conflicts:

```bash
# Check what's using port 8081
netstat -ano | findstr 8081
# Kill the process
taskkill /PID <PID> /F
```

### Mac Setup Guide

For macOS users, follow these additional steps to set up your development environment properly:

#### Essential Tools

##### Homebrew Installation

Homebrew is the recommended package manager for macOS:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to your PATH (for Apple Silicon Macs)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

##### Xcode & Command Line Tools

Xcode is required for iOS development:

```bash
# Install Xcode from the Mac App Store
# Then install Command Line Tools
xcode-select --install

# Verify installation
xcode-select -p
# Should output something like: /Applications/Xcode.app/Contents/Developer

# Accept Xcode license
sudo xcodebuild -license accept
```

##### Node.js & npm/yarn

Using Node Version Manager (nvm) is recommended:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Add to shell profile
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zprofile
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zprofile
source ~/.zprofile

# Install and use Node.js
nvm install 16
nvm use 16
```

##### CocoaPods

CocoaPods is a dependency manager for iOS projects:

```bash
# Install using Homebrew (recommended)
brew install cocoapods

# Alternative: Install using gem
sudo gem install cocoapods

# Verify installation
pod --version
```

#### iOS Development Setup

##### Configure Environment Variables

Add these to your ~/.zshrc or ~/.bash_profile:

```bash
# For Android development on Mac
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Load changes
source ~/.zshrc  # or source ~/.bash_profile
```

##### iOS Project Setup

```bash
# Navigate to your project
cd MobileAppAndroid

# Install dependencies
yarn install  # or npm install

# Install iOS pods
cd ios
pod install
cd ..

# Start Metro bundler
npx react-native start
```

##### Running on iOS Simulator

```bash
# List available simulators
xcrun simctl list devices

# Run on default simulator
npx react-native run-ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

#### Mac-Specific Troubleshooting

##### CocoaPods Issues

```bash
# If CocoaPods installation fails
sudo gem install cocoapods -n /usr/local/bin

# If pod install fails
cd ios
pod deintegrate
pod install
cd ..
```

##### iOS Build Failures

```bash
# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset iOS simulator
xcrun simctl erase all

# Clean project
cd ios
xcodebuild clean
cd ..
```


##### Metro Bundler Issues

```bash
# Clear Metro bundler cache and restart
npx react-native start --reset-cache
```

