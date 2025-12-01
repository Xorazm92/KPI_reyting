# Mehnat Muhofazasi Reyting Tizimi (Workplace Safety Rating System)

## Project Overview

This is a comprehensive workplace safety rating and management system designed for Uzbekistan enterprises. The system evaluates, ranks, and compares companies based on 15 key safety performance indicators (KPIs).

**Purpose**: Monitor and assess workplace safety effectiveness across multiple companies using automated rating, visualization, and hierarchical organization.

**Target Users**:
- Companies (internal monitoring)
- Government regulatory agencies
- Safety departments
- Safety specialists

## Current State

The project is fully set up and running in the Replit environment:
- ✅ Static web application serving on port 5000
- ✅ Firebase integration active and connected
- ✅ 30 companies currently loaded from Firebase database
- ✅ All features operational (rating, comparison, statistics, hierarchical views)
- ✅ Deployment configured for static hosting

## Technology Stack

### Frontend
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with Grid, Flexbox, CSS Variables, animations
- **JavaScript (ES6+)**: Vanilla JavaScript modules
- **Chart.js 4.4.0**: Data visualization library

### Backend/Data
- **Firebase Firestore**: Cloud database for real-time data sync
- **LocalStorage**: Local data caching and offline support

### Hosting
- **Development**: Python HTTP server on port 5000
- **Production**: Static hosting (configured)

## Project Structure

```
.
├── index.html           # Main application interface
├── app.js              # Core application logic & KPI calculations
├── styles.css          # Application styling
├── hierarchy.js        # Hierarchical organization module
├── roles.js            # Role-based access control
├── data.js             # Department profiles and KPI weights
├── data-loader.js      # Firebase data loading module
├── filter.js           # Filtering and organization logic
├── companies.json      # Company data structure
├── README.md           # Project documentation
├── GUIDE.md            # Comprehensive usage guide
├── CALCULATION.md      # KPI calculation formulas
└── firebase-rules.txt  # Firebase security rules
```

## Key Features

### 1. 15 KPI Assessment System
- LTIFR (Lost Time Injury Frequency Rate)
- TRIR (Total Recordable Incident Rate)
- No-incident Days
- Training Coverage
- Risk Assessment Coverage
- Near Miss Reporting
- Response Time
- Prevention Programs
- PPE Compliance
- Equipment Maintenance
- Safety Inspections
- Occupational Health
- Regulatory Compliance
- Emergency Preparedness
- Safety Violations

### 2. 3-Level Hierarchy
- 🏢 **Management** (Boshqaruv): Full access to all companies
- 👔 **Supervisor** (Nazoratchi): Access to assigned branches
- 🏭 **Company** (Korxona): Access to own data only

### 3. Risk Groups
- 🔴 **High Risk**: Manufacturing, Construction (min KPI: 85)
- 🟡 **Medium Risk**: Logistics, Industry (min KPI: 75)
- 🟢 **Low Risk**: Office, Services (min KPI: 65)

### 4. Rating & Analysis
- Automatic MM Index calculation
- Zone classification (Green/Yellow/Red)
- Top 3 Podium display
- Comparison and benchmarking

### 5. Modern UI
- Responsive design (mobile/tablet/desktop)
- Dark theme with gradient colors
- Real-time updates
- Professional appearance

## Firebase Configuration

The application uses Firebase (NBT-KPI project) for cloud data storage:

```javascript
Project ID: nbt-kpi
Auth Domain: nbt-kpi.firebaseapp.com
Storage: nbt-kpi.firebasestorage.app
```

**Note**: Firebase credentials are already configured in `app.js`. The application connects automatically on load.

## Development Setup

### Running Locally
The application is configured to run with a Python HTTP server:

```bash
python -m http.server 5000
```

The workflow "Start application" is already configured and will start automatically.

### File Modifications
All application files are static - no build process required. Simply edit HTML, CSS, or JavaScript files and refresh the browser.

### Data Management
- **Development Data**: Stored in Firebase Firestore (real-time sync)
- **Local Cache**: Uses browser LocalStorage for offline support
- **Export/Import**: Available through the UI (JSON, CSV, PDF formats)

## User Roles & Permissions

### 🏢 Management (Boshqaruv)
**Permissions**:
- ✅ View all companies
- ✅ Edit all data
- ✅ Add/remove companies
- ✅ Export reports
- ✅ Manage users

### 👔 Supervisor (Nazoratchi)
**Permissions**:
- ✅ View assigned branches
- ✅ Edit branch data
- ✅ Add new branches
- ✅ Export reports
- ❌ Access other supervisors' data

### 🏭 Company (Korxona)
**Permissions**:
- ✅ View own data
- ✅ Enter/update KPIs
- ❌ View other companies
- ❌ Export functions

## KPI Calculation

The MM Index (Mehnat Muhofazasi Index) is calculated as:
- Each KPI receives a score (0-100)
- Weighted average based on department profile
- Final score determines zone:
  - 🟢 Green (80-100): Safe
  - 🟡 Yellow (50-79): Needs improvement
  - 🔴 Red (0-49): Dangerous

Detailed formulas are documented in `CALCULATION.md`.

## Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Deployment

The project is configured for static hosting deployment:
- **Type**: Static
- **Public Directory**: Root (.)
- **Files Served**: All HTML, CSS, JS, and assets

To deploy, use the Replit deployment feature in the UI.

## Troubleshooting

### Data Not Saving
- Check LocalStorage is enabled
- Clear browser cache
- Verify not in incognito mode
- Check Firebase connectivity

### Charts Not Displaying
- Verify internet connection (Chart.js CDN)
- Check browser console for errors
- Refresh page (Ctrl+F5)

### Firebase Connection Issues
- Check internet connectivity
- Verify Firebase configuration in app.js
- Check browser console for error messages

## Recent Changes

**2025-12-01**: Project imported and set up in Replit environment
- Configured Python HTTP server workflow on port 5000
- Verified Firebase connectivity
- Configured static deployment
- All 30 companies loaded successfully

## Version Information

- **Version**: 2.0.0
- **Last Updated**: 2025-12-01
- **Language**: Uzbek (uz)
- **License**: Custom for Uzbekistan enterprises

## Additional Resources

- `README.md`: Quick start guide
- `GUIDE.md`: Comprehensive 1800+ line user manual
- `CALCULATION.md`: Detailed KPI formulas and methodology
