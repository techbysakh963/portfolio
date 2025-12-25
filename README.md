# Salah Khatib - Portfolio

A modern, responsive portfolio website with animated geometric background and bilingual support (English/Arabic).

## Features

- Animated geometric background with particles and shapes
- Responsive design for all devices
- English/Arabic language toggle with RTL support
- Smooth scroll animations and reveal effects
- Typewriter effect with language-aware words
- Project filtering system
- Work experience timeline
- Education and certifications section
- Counter animations
- Mobile-friendly navigation
- Dark theme with cyan/teal accent colors

## Structure

```
portfolio/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles, animations, and RTL support
├── js/
│   └── main.js         # JavaScript functionality and language switcher
├── assets/
│   └── images/         # Image assets
└── README.md           # This file
```

## Setup

1. Clone or download this repository
2. Open `index.html` in your browser
3. Click EN/AR buttons to switch language

## Customization

### Personal Information
Edit `index.html` to update:
- Name and contact details
- Skills and technologies
- Work experience
- Projects with descriptions
- Education and certifications

### Colors
Edit `css/styles.css` CSS variables:
```css
:root {
    --primary: #06b6d4;      /* Main accent color */
    --secondary: #10b981;     /* Secondary accent */
    --accent: #3b82f6;        /* Additional accent */
}
```

### Typewriter Words
Edit `js/main.js` LanguageSwitcher class:
```javascript
this.wordsEN = ['Systems Engineer', 'DevOps Specialist', ...];
this.wordsAR = ['مهندس أنظمة', 'متخصص DevOps', ...];
```

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to Settings > Pages
3. Select "main" branch and root folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

## Technologies Used

- HTML5 & CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter + Tajawal for Arabic)
- Canvas API for geometric background

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact

- Email: Salahkhatib606@outlook.com
- GitHub: [@techbysakh](https://github.com/techbysakh)
- LinkedIn: [/in/salah-khatib](https://linkedin.com/in/salah-khatib)

## License

Feel free to use this template for your personal portfolio.
