# 💧 Drink Water Tracker

A beautiful and intuitive water intake tracking app built with React Native and Expo, featuring stunning Lottie animations, glassmorphism design, and comprehensive health tracking capabilities.

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0.31-purple)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## 🔗 Preview

You can view the live version of this project here:

👉 [Drink Water Tracker Demo](#) <!-- Add your deployment link here -->

<!-- Add your app screenshot here -->
<!-- <img width="1200" height="800" alt="Drink-Water-Tracker" src="screenshot-url" /> -->

## ✨ Features

- 💧 **Daily Water Tracking** - Track your daily water intake with an intuitive tap-to-add interface
- 🎬 **Beautiful Lottie Animations** - Smooth, professional animations for water drops, achievements, and interactions
- 📊 **Half-Circle Progress Indicator** - Visual representation of daily goal completion
- 🌓 **Dark/Light Theme Toggle** - Switch between dark and light modes for comfortable viewing any time
- 📅 **History Tracking** - View your water intake history and monitor progress over time
- 🎯 **Customizable Daily Goals** - Set personalized water intake targets based on your needs
- 📱 **iPhone Frame Design** - Optimized iOS 26 design with modern glassmorphism effects
- 🔔 **Smart Notifications** - Configurable reminders to stay hydrated throughout the day
- 📳 **Haptic Feedback** - Tactile responses for button presses and achievements
- 💾 **Persistent Storage** - All data saved locally using AsyncStorage (works offline)
- ⏪ **Undo Function** - Quickly undo the last water entry if added by mistake
- 🎉 **Goal Completion Animation** - Celebrate when you reach your daily water goal
- 📱 **Fully Responsive** - Works seamlessly on iOS, Android, and Web platforms
- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth transitions

## 📱 Screenshots
Follow these steps to set up and run the project on your local machine:

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Expo CLI (installed automatically with project)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sina-soroush/Drink-water-React.git
   cd Drink-water-React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Web Browser**: Press `w` in the terminal or run `npm run web`
   - **Physical Device**: Scan the QR code with Expo Go app (iOS/Android)

### Build for Production

Build for Android:
```bash
npx expo build:android
```

Build for iOS:
```bash
npx expo build:ios
```

For EAS Build (recommended):
```bash
eas build --platform ios
eas build --platform android
``
### Running the App

- **iOS**: Press `i` in the terminal or run `npm run ios`
- **Android**: Press `a` in the terminal or run `npm run android`
- **Web**: Press `w` in the terminal or run `npm run web`

## 🛠️ Built With

- **[React Native](https://reactnative.dev/)** - Mobile app framework
- **[Expo](https://expo.dev/)** - Development platform
- **[React Navigation](https://reactnavigation.org/)** - Navigation library
- **[Lottie](https://lottiefiles.com/)** - Animation library
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local storage
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Gradient backgrounds
- **[Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/)** - Glassmorphism effects
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Advanced animations
How It Works

### HomeScreen (Main Interface)
- **Water Drop Animation**: Animated Lottie water drops that appear when adding intake
- **Half-Circle Progress**: Dynamic SVG-based progress indicator showing completion percentage
- **Add/Remove Buttons**: Quick-action buttons with haptic feedback to log water intake
- **Undo Functionality**: Quickly revert the last water entry with a single tap
- **Daily Goal Display**: Shows current intake vs. target goal in ml
- **Theme-Aware Design**: Automatically adapts to light/dark mode settings
- **Glassmorphism Card**: Frosted glass effect container with backdrop blur

### HistoryScreen (Progress Tracking)
- **Calendar View**: Visual representation of past water intake
- **Daily Statistics**: View intake amounts for specific dates
- **Completion Trends**: Track your hydration consistency over time
- **Data Visualization**: Bar charts showing weekly/monthly patterns
- **Export Options**: Share your progress data

### SettingsScreen (Customization Hub)
- **Daily Goal Slider**: Adjust your target water intake (ml)
- **Theme Toggle**: Switch between dark and light themes with animation
- **Notification Settings**: Configure reminder frequency and timing
- **Unit Preferences**: Choose between ml and oz
- **Reset Data**: Clear all history and start fresh
- **App Information**: Version, credits, and links

## 🎯 Key Components

### `HalfCircleProgress.js`
Custom SVG-based progress indicator with:
- Smooth animated transitions using React Native Reanimated
- Dynamic color changes based on progress percentage
- Percentage text display
- Responsive sizing

### `WaterDropAnimation.js`
Lottie animation component featuring:
- High-quality water drop animations
- Triggered on each water intake addition
- Smooth loop for goal completion
- Performance-optimized rendering

### `GoalCompletionAnimation.js`
Celebration animation component with:
- Confetti/checkmark animation on goal achievement
- One-time display per day
- Haptic feedback integration
- Auto-dismiss after completion

### `LottieIcon.js`
Reusable Lottie icon wrapper with:
- Support for all Lottie animations in assets
- Customizable size and color
- Play/pause control
- Loop configuration

### `IPhoneFrame.js`
iOS device frame component with:
- Realistic iPhone bezels and notch
- Safe area management
- Glassmorphism background
- Responsive to device dimensions

## 🧪 Technologies & Patterns

- **Context API** - Global theme and state management without Redux
- **AsyncStorage** - Persistent local data storage for offline support
- **Custom Hooks** - Reusable logic for water tracking, theme, and storage
- **Functional Components** - Modern React with hooks (useState, useEffect, useContext)
- **Glassmorphism UI** - Frosted glass effects using Expo Blur
- **React Native Reanimated** - High-performance animations at 60fps
- **Lottie Animations** - Professional vector animations from LottieFiles
- **React Navigation** - Stack-based navigation with custom transitions
- **Expo Vector Icons** - Extensive icon library (Ionicons)
- **Haptic Feedback** - Native vibration patterns for user feedback

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in web browser |
| `npx expo start` | Alternative start command with options menu |

## 🎨 Customization

### Change Water Goal Default Value

Edit `screens/SettingsScreen.js`:

```javascript
const [dailyGoal, setDailyGoal] = useState(2000); // Change default ml
```

### Customize Theme Colors

Edit `contexts/ThemeContext.js`:

```javascript
export const lightTheme = {
  primary: '#2196F3',    // Main blue color
  background: '#FFFFFF', // Background color
  card: '#F5F5F5',       // Card background
  // ... modify other colors
};
```

### Add Custom Lottie Animations

1. Download .json animation from [LottieFiles](https://lottiefiles.com/)
2. Place in `assets/lottie/` folder
3. Import in `assets/lottie/animations.js`:

```javascript
export const myAnimation = require('./my-animation.json');
```

### Change Water Increment Amount

Edit `screens/HomeScreen.js`:

```javascript
const waterIncrement = 250; // Change from default 250ml
```

## 🐛 Troubleshooting

### Expo server won't start
- Clear the cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 19000/19001 is available

### Animations not showing
- Ensure Lottie JSON files exist in `assets/lottie/` directory
- Check console for animation loading errors
- Verify `lottie-react-native` is properly installed

### Data not persisting
- Check AsyncStorage permissions in app settings
- Clear app data and restart
- Verify `@react-native-async-storage/async-storage` is installed

### App crashes on iOS
- Run `npx expo install --fix` to fix dependency versions
- Rebuild the app: `npx expo run:ios`
- Check for iOS version compatibility

### Haptic feedback not working
- Ensure device supports haptic feedback (not all Android devices do)
- Check device settings for vibration enabled
- Test on physical device (simulators may not support haptics)

### Theme not switching
- Verify `ThemeContext` is wrapping the app in `App.js`
- Check if theme value is being stored in AsyncStorage
- Restart the app after theme change

## 🚀 Future Enhancements

- [ ] Add weekly/monthly progress charts and statistics
- [ ] Implement water intake reminders with push notifications
- [ ] Add hydration streak tracking and achievements
- [ ] Include weather-based hydration recommendations
- [ ] Add Apple Health / Google Fit integration
- [ ] Multiple drink types (water, tea, coffee, juice)
- [ ] Social features - share progress with friends
- [ ] Widget support for quick logging
- [ ] Siri/Google Assistant shortcuts
- [ ] Export data to CSV/PDF
- [ ] Customizable water cup sizes
- [ ] Badge system for milestones
- [ ] Daily hydration tips and health facts

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [LottieFiles](https://lottiefiles.com/) for beautiful free animations
- [React Native](https://reactnative.dev/) for the powerful framework
- [@expo/vector-icons](https://icons.expo.fyi/) for comprehensive icon library
- Inspired by iOS Health app and modern material design principles
- Animation files: water.json, checkmark-circle.json, and others from LottieFiles community

## 👨‍💻 Author

**Sina Soroush**
- GitHub: [@sina-soroush](https://github.com/sina-soroush)
- Repository: [Drink-water-React](https://github.com/sina-soroush/Drink-water-React)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Feel free to check the [issues page](https://github.com/sina-soroush/Drink-water-React/issues) for open issues or create a new one.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you stay hydrated!

## 📞 Support

For support, open an issue in the GitHub repository or contact via email.

---

**Stay Hydrated! 💧💪**