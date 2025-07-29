# Project Creation Page Guide

## Overview
The Project Creation Page (`/create-project`) is a comprehensive form designed for contractors to create detailed project specifications. The page features an intuitive, icon-based interface that's accessible to users with low English literacy.

## Features

### 1. Room Selection Section
- **Predefined Rooms**: Kitchen, Bathroom, Bedroom, Living Room, Dining Room, Hallway, Stairs, Garage, and Other
- **Multiple Selection**: Users can select the same room type multiple times (e.g., "2 Bedrooms")
- **Size Input**: Optional size field for each room in square meters
- **Custom Rooms**: "Add New Room" button allows users to create custom room types
- **Visual Icons**: Each room type has a distinctive icon for easy recognition

### 2. Project Location Section
- **UK Postcode Input**: Text field for entering UK postcodes
- **Autocomplete**: Suggests postcodes after 2-3 characters (e.g., "NW" shows London areas)
- **Partial Postcode Support**: Users can submit with partial postcodes
- **Map Placeholder**: Visual placeholder for future map integration

### 3. Map Upload Section
- **File Upload**: Drag & drop or click to upload floor plans
- **Supported Formats**: JPG, JPEG, PDF
- **Future Support**: Placeholder for AutoCAD (.dwg) files
- **File Management**: Remove uploaded files individually
- **Size Limit**: Maximum 10MB per file, up to 5 files

### 4. Additional Features
- **Multilingual Support**: English, Farsi, Arabic, and Turkish
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Required field validation
- **Visual Feedback**: Loading states and success messages

## Technical Implementation

### File Structure
```
frontend/app/create-project/
└── page.tsx          # Main project creation page
```

### Key Components
- **Room Selection**: Grid of predefined room buttons with icons
- **Custom Room Modal**: Popup for adding new room types
- **Postcode Autocomplete**: Dropdown with UK postcode suggestions
- **File Upload**: Drag & drop interface with preview
- **Form Validation**: Client-side validation with user feedback

### Data Flow
1. User selects rooms from predefined list or creates custom rooms
2. User enters project location with postcode autocomplete
3. User uploads floor plan files (optional)
4. Form validates required fields
5. Data is submitted (currently simulated with console.log)

### State Management
- `selectedRooms`: Array of selected rooms with sizes
- `customRooms`: Array of custom room names
- `formData`: Project title, description, budget, timeline, postcode
- `uploadedFiles`: Array of uploaded file objects
- `postcodeSuggestions`: Dynamic postcode suggestions

## Usage Instructions

### For Contractors
1. Navigate to the home page
2. Click the "Contractors" (hammer icon) button
3. Fill in project information:
   - Project title and description
   - Budget and timeline (optional)
4. Select rooms:
   - Click room type buttons to add rooms
   - Enter size for each room (optional)
   - Use "Add New Room" for custom room types
5. Enter project location:
   - Type UK postcode (autocomplete will help)
   - Partial postcodes are accepted
6. Upload floor plans (optional):
   - Drag & drop or click to upload
   - Supported: JPG, PDF files
7. Click "Create Project" to submit

### For Developers
- The page is self-contained and doesn't break other parts of the system
- All styling uses inline styles for consistency
- Icons are from react-icons/fa library
- Form validation prevents submission with missing required fields
- File upload includes type and size validation

## Future Enhancements
- **Real API Integration**: Connect to backend for actual project creation
- **Map Integration**: Add real map display using Google Maps or similar
- **AutoCAD Support**: Add .dwg file upload capability
- **Room Templates**: Predefined room configurations
- **Project Templates**: Save and reuse project configurations
- **Image Preview**: Preview uploaded floor plans
- **Advanced Validation**: More sophisticated form validation
- **Offline Support**: Work without internet connection

## Accessibility Features
- **Icon-Based Interface**: Visual cues for low-literacy users
- **Multilingual Support**: Tooltips and labels in 4 languages
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast**: Clear visual hierarchy and contrast
- **Responsive Design**: Works on all screen sizes

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App (PWA) features supported
- Offline capability with service worker

## Performance Considerations
- Lazy loading of components
- Optimized image handling
- Efficient state management
- Minimal bundle size impact
- Fast page load times 