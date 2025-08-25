NOTE: its a 3D interface you can interact using your mouse/cursor and rotate too.

# Solar System Simulation

A beautiful and interactive 3D solar system simulation built with Three.js and Vite. This project features realistic planetary textures, orbital mechanics, and a stunning star field background.

## 🌟 Features

- **Realistic Planetary Textures**: High-resolution 2K textures for the Sun, Mercury, Venus, Earth, Mars, and Moon
- **Orbital Mechanics**: Planets orbit the Sun with realistic relative speeds and distances
- **Moon Systems**: Earth has its Moon, and Mars has both Phobos and Deimos
- **Self-Rotation**: All celestial bodies rotate on their axes
- **Interactive Controls**: Orbit controls allow you to navigate and explore the solar system
- **Starry Background**: Procedurally generated star field with cubemap background
- **Responsive Design**: Adapts to different screen sizes and resolutions

## 🪐 Celestial Bodies Included

- **Sun** - Central star with glowing texture
- **Mercury** - Closest planet to the Sun
- **Venus** - Earth's sister planet
- **Earth** - Our home planet with its Moon
- **Mars** - The Red Planet with moons Phobos and Deimos

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd solar
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local server address (usually `http://localhost:5173`)

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 🎮 Controls

- **Mouse Drag**: Rotate the camera around the scene
- **Mouse Wheel**: Zoom in and out
- **Right-click Drag**: Pan the camera

## 🛠️ Technologies Used

- **Three.js** - 3D graphics library
- **Vite** - Build tool and development server
- **Tweakpane** - GUI for debugging and controls (currently not fully implemented)
- **HTML5 Canvas** - WebGL rendering

## 📁 Project Structure

```
solar/
├── public/
│   └── texture/          # High-resolution planetary textures
│       ├── 2k_sun.jpg
│       ├── 2k_mercury.jpg
│       ├── 2k_venus_surface.jpg
│       ├── 2k_earth_daymap.jpg
│       ├── 2k_mars.jpg
│       ├── 2k_moon.jpg
│       └── cubemap/      # Star background textures
├── src/
│   ├── main.js          # Main Three.js application
│   └── style.css        # CSS styles
├── index.html           # Main HTML file
├── package.json         # Project dependencies
└── README.md           # This file
```

## 🎨 Customization

You can modify the solar system parameters in `src/main.js`:

- **Planet sizes**: Adjust the `radius` values
- **Orbital distances**: Modify the `distance` values
- **Rotation speeds**: Change the `speed` values
- **Add new planets**: Extend the `planets` array

## 🌌 Texture Sources

The project uses high-quality 2K textures from various astronomical sources. All textures are properly color-space corrected for realistic rendering.



## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more planets and moons
- Improve the lighting and shading
- Add realistic orbital physics
- Enhance the user interface
- Fix any bugs or issues



**Enjoy exploring our solar system!** 🚀
