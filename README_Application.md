# Mobile Banking Application

A modern mobile banking application built with React Native that allows users to manage their accounts, view transactions, and perform transfers between accounts.

## Application Features

- **User Authentication**: Secure login and user profile management
- **Account Dashboard**: View all your accounts and balances at a glance
- **Transaction History**: Browse your transaction history grouped by date (Today, Yesterday, This Week, This Month)
- **Money Transfers**: Transfer funds between your accounts
  - Select source and destination accounts
  - Enter amount and add transaction details
  - Real-time balance updates
- **Account Details**: View detailed information for each account

## Technical Features

- React Native for cross-platform mobile development
- Custom UI components with modern design
- API integration for account and transaction data

## API Integration

### Backend API Endpoints

The application communicates with the following API endpoints:

- **Authentication**
  - `POST /api/auth/login` - User login
  - `GET /api/auth/user` - Get current user profile

- **Accounts**
  - `GET /api/accounts/` - Get specific account details

- **Transactions**
  - `GET /api/transactions` - List user transactions
  - `POST /api/transactions` - Create a new transaction/transfer


## Project Structure

- `/screens` - Main application screens
- `/components` - Reusable UI components
- `/context` - React Context providers
- `/src/services` - API services
- `/src/constants` - Application constants
- `/assets` - Images and other static assets

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)
- React Native CLI
- Java Development Kit (JDK `17)
- Git (for version control)

### Windsurf IDE Setup

#### Windsurf Installation
- Download Windsurf from the official site (https://windsurf.com/editor/download-windows)
- Run the installer and finish the installation
- Launch Windsurf and sign in

#### Integrating GitHub with Windsurf

##### Required Extensions
Install these from the Extensions panel:
- GitHub (by KnisterPeter)
- GitHub Action Demo Extension (by chrisbibby)
- GitHub Pull Requests and Issues (by GitHub)

##### Connecting Your Repo
1. Open the Command Palette
2. Search for "GitHub: Sign in" and authenticate
3. Go to the Source Control panel
4. Click "Clone Repository" and enter your repo URL: https://github.com/aiToolsTest/MobileNativeApp
5. Select a local folder for the cloned repository
6. Open the cloned project folder

##### Working with GitHub in Windsurf
- **Pull changes**: Use the Pull button in Source Control
- **Stage, Commit, Push**: Add files, commit with a message, and push
- **Branching**: Click branch icon to switch/create branches
- **PRs & Issues**: Use the dedicated sidebar for PR/issue management

### Git Workflow

#### Git Installation

```bash
# For Windows
# Download and install from https://git-scm.com/download/win

# For macOS
# Using Homebrew
brew install git

# Verify installation
git --version
```

#### Git Configuration

```bash
# Set your username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: Set default editor
git config --global core.editor "code --wait"
```

#### Common Git Commands

```bash
# Check Git status
git status

# Pull latest changes
git pull origin main

# Create a new branch
git checkout -b feature/your-feature-name

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push origin feature/your-feature-name

# Merge branches (after PR approval)
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```


## Troubleshooting

### Java Version Issues (Windows)
Make sure you're using a compatible Java version:

```bash
# Check your Java version
java -version

# Set JAVA_HOME in Windows environment variables
# Open Environment Variables > System Variables > New
# Variable name: JAVA_HOME
# Variable value: C:\Program Files\Java\jdk-11
```

For this project, JDK 11 is recommended. If you have multiple Java versions installed, you can use:
```bash
# Using Chocolatey to install specific version
choco install openjdk11

# Or manually set the PATH to use a specific version
SET PATH=C:\Program Files\Java\jdk-11\bin;%PATH%
```

### Gradle Issues
If you encounter Gradle build failures:

```bash
# Clean the Gradle cache and rebuild
cd android
./gradlew clean
# On Windows, use:
gradlew.bat clean

# You can also try with full rebuild
./gradlew clean build
```

### Legacy Peer Dependencies
If you see warnings about legacy peer dependencies when installing packages:

```bash
# Install with legacy peer dependency support
npm install --legacy-peer-deps

# Or with Yarn
yarn install --ignore-engines
```

To permanently set this configuration:
```bash
npm config set legacy-peer-deps true
```

### Rebuilding the Android Folder
If the Android folder gets corrupted or has issues:

```bash
# Remove the android folder
rm -rf android

# Recreate it using React Native
npx react-native eject
```

### Common Issues
- **"Unable to resolve module" errors**: Try clearing cache and reinstalling node_modules
  ```bash
  rm -rf node_modules
  yarn cache clean
  yarn install
  npx react-native start --reset-cache
  ```

- **Android build errors**: Check for proper Android SDK configuration
  ```bash
  # In android/local.properties (create if not exists)
  sdk.dir=/path/to/your/Android/sdk
  ```
