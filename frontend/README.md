# 💧 Hydration Hero - Smart Water Tracking App

A modern, responsive web application for tracking water intake with real-time monitoring, personalized hydration goals, and beautiful data visualization.

## ✨ Features

- **Smart Hydration Tracking**: Real-time water intake monitoring
- **Personalized Goals**: Calculate daily hydration needs based on weight and activity level
- **Beautiful UI**: Modern design with dark/light theme support
- **Interactive Charts**: Real-time intake graphs and daily trend analysis
- **Bluetooth Integration**: Connect to smart water bottles (Web Bluetooth API)
- **Demo Mode**: Test the app with mock data
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Optional: Install enhanced UI libraries for animations and icons**
   ```bash
   npm install framer-motion lucide-react clsx
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🎨 Modern UI Features

### Design System
- **CSS Variables**: Consistent theming with CSS custom properties
- **Responsive Grid**: Mobile-first responsive design
- **Modern Typography**: Inter font for excellent readability
- **Smooth Animations**: Fade-in effects and hover interactions
- **Gradient Accents**: Beautiful gradient backgrounds and progress bars

### Components
- **Interactive Metrics Cards**: Hover effects and visual feedback
- **Animated Progress Bars**: Smooth progress animations with shimmer effects
- **Status Indicators**: Color-coded connection and sync status
- **Modern Form Elements**: Styled inputs with focus states
- **Chart Integration**: Recharts with custom styling

### Theme Support
- **Dark Mode**: Professional dark theme with proper contrast
- **Light Mode**: Clean light theme for daytime use
- **Automatic Switching**: Toggle between themes with smooth transitions

## 📱 Usage

### Setting Up Your Profile
1. Enter your weight in kilograms
2. Optionally add your age
3. Select your activity level (Low/Moderate/High)
4. Your daily hydration goal will be automatically calculated

### Tracking Water Intake
- **Bluetooth Mode**: Connect your smart water bottle for automatic tracking
- **Demo Mode**: Enable mock mode to see the app in action with simulated data

### Monitoring Progress
- View real-time intake metrics
- Track progress toward your daily goal
- Analyze trends with interactive charts
- Monitor connection status and sync times

## 🔧 Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Charts**: Recharts for beautiful data visualization
- **Styling**: Modern CSS with CSS Variables
- **Icons**: Emoji fallbacks (upgradeable to Lucide React)
- **Animations**: CSS transitions (upgradeable to Framer Motion)
- **Bluetooth**: Web Bluetooth API for device connectivity

## 🎯 Browser Support

- **Chrome/Edge**: Full support including Web Bluetooth
- **Firefox/Safari**: Core functionality (Bluetooth requires Chrome/Edge)
- **Mobile**: Responsive design works on all modern mobile browsers

## 🔮 Future Enhancements

- **PWA Support**: Install as a mobile app
- **Data Export**: Export hydration data to CSV/JSON
- **Reminders**: Smart hydration reminders
- **Social Features**: Share progress with friends
- **Health Integration**: Connect with fitness trackers
- **Advanced Analytics**: Weekly/monthly reports

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
frontend/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── styles.css       # Modern CSS design system
│   └── ble.ts          # Bluetooth connectivity
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🎨 Customization

The app uses CSS variables for easy theming. Modify the `:root` section in `styles.css` to customize:

- Colors and gradients
- Spacing and typography
- Border radius and shadows
- Animation timings

## 📄 License

This project is open source and available under the MIT License.

---

**Stay hydrated, stay healthy!** 💧✨
