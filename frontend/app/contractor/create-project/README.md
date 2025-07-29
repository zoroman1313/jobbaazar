# Contractor Project Creation Page

## Overview
This is a fully isolated project creation page specifically designed for contractors. The page is located at `/contractor/create-project` and is completely self-contained with no dependencies on other parts of the application.

## Features

### 🏗️ Room Selection
- **Predefined Rooms**: Kitchen, Bathroom, Bedroom, Living Room, Dining Room, Hallway, Garage, Stairs
- **Multiple Selection**: Click room buttons to increment counters (e.g., "Bedroom (2)")
- **Size Input**: Optional size field for each room instance in square meters
- **Custom Rooms**: "افزودن اتاق جدید" button to add custom room types
- **Visual Icons**: Each room type has a distinctive icon for easy recognition

### 🗺️ Postcode Input + Address Autocomplete
- **Real API Integration**: Uses `https://api.postcodes.io/postcodes?q=NW` for UK postcode suggestions
- **Debounced Search**: API calls are debounced to prevent excessive requests
- **Rich Suggestions**: Shows postcode with area names (e.g., "NW10 - Harlesden")
- **Auto-fill**: Selecting a suggestion fills postcode, address, and coordinates

### 📍 Use My Location
- **Geolocation**: Uses `navigator.geolocation` to get current position
- **Reverse Geocoding**: Uses Nominatim API to convert coordinates to address
- **Auto-fill**: Automatically fills postcode and address fields
- **Error Handling**: Proper error messages for location failures

### 📁 File Upload
- **Drag & Drop**: Modern file upload interface
- **Format Support**: JPG, JPEG, PDF files
- **Size Validation**: Maximum 10MB per file, up to 5 files
- **File Management**: Remove individual files

## Technical Implementation

### File Structure
```
frontend/app/contractor/create-project/
├── page.tsx          # Main page component
└── README.md         # This documentation
```

### Key Components
- **RoomSelector**: Grid of room buttons with increment functionality
- **PostcodeAutoComplete**: Real-time postcode search with API integration
- **LocationPicker**: Geolocation and reverse geocoding
- **FileUpload**: Drag & drop file upload with validation
- **CustomRoomModal**: Modal for adding custom room types

### State Management
- `selectedRooms`: Array of rooms with counts and instances
- `formData`: Project information (title, description, location, etc.)
- `postcodeSuggestions`: Dynamic postcode suggestions from API
- `uploadedFiles`: Array of uploaded file objects

### API Integrations
1. **Postcodes.io**: UK postcode search and validation
2. **Nominatim**: Reverse geocoding for location services
3. **Browser Geolocation**: Current position detection

## Persian Localization

### RTL Layout
- Complete right-to-left (RTL) layout support
- Persian text and labels throughout
- Proper spacing and alignment for RTL

### Persian Features
- All UI text in Persian
- Persian number formatting
- RTL-compatible icons and layouts
- Persian error messages and validation

## Usage

### For Contractors
1. Navigate to `/contractor/create-project`
2. Fill in project information (title, description, budget, timeline)
3. Select rooms by clicking room buttons
4. Add custom rooms if needed
5. Enter postcode or use "Use My Location"
6. Upload floor plan files (optional)
7. Submit the project

### For Developers
- **Isolated**: No dependencies on other app components
- **Self-contained**: All logic within this directory
- **Modern React**: Uses hooks, TypeScript, and modern patterns
- **Responsive**: Works on all screen sizes
- **Accessible**: Full keyboard navigation and screen reader support

## Browser Compatibility
- Modern browsers with geolocation support
- HTTPS required for geolocation features
- File upload support for JPG, PDF formats

## Future Enhancements
- **Real Map Integration**: Add Leaflet or Google Maps for location display
- **AutoCAD Support**: Add .dwg file upload capability
- **Project Templates**: Save and reuse project configurations
- **Offline Support**: Work without internet connection
- **Advanced Validation**: More sophisticated form validation

## Security Considerations
- HTTPS required for geolocation
- File type validation on client and server
- Input sanitization for all user inputs
- API rate limiting for postcode searches

## Performance
- Debounced API calls to prevent excessive requests
- Efficient state management with React hooks
- Optimized re-renders with proper dependency arrays
- Lazy loading for heavy components 