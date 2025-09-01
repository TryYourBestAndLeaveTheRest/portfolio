# Raji Sherifdeen Ayinla (KuriousDev) - Backend Developer Portfolio

A professional portfolio website built with vanilla HTML, CSS, and JavaScript, featuring a Node.js/Express backend for the contact form.

## Features

- **Pure Vanilla Frontend**: No React or other frontend frameworks - just HTML, CSS, and JavaScript
- **GitHub-Inspired Dark Theme**: Professional dark color scheme with accent colors
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Contact Form**: Working contact form with backend API and form validation
- **Smooth Animations**: CSS animations and smooth scrolling navigation
- **Professional Sections**: Hero, About, Skills, Projects, and Contact sections

## Quick Start

### Prerequisites
- Node.js 18+ installed on your system

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TryYourBestAndLeaveTheRest/portfolio.git
   cd portfolio-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5000`

## File Structure

```
portfolio-website/
├── server/                 # Backend Express.js server
│   ├── public/            # Static website files (HTML, CSS, JS)
│   │   ├── index.html     # Main HTML file
│   │   ├── styles.css     # All styling
│   │   └── script.js      # JavaScript functionality
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes (contact form)
│   └── storage.ts         # Data storage (in-memory by default)
├── shared/                # Shared TypeScript schemas
│   └── schema.ts          # Contact form validation schemas
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Customization

### Updating Content
- **Personal Information**: Edit the HTML content in `server/public/index.html`
- **Styling**: Modify colors and layout in `server/public/styles.css`
- **Functionality**: Add features in `server/public/script.js`

### Color Scheme
The website uses a GitHub-inspired color palette:
- Primary: `#0D1117` (GitHub dark)
- Secondary: `#21262D` (code grey)  
- Accent: `#58A6FF` (GitHub blue)
- Text: `#F0F6FC` (light text)
- Success: `#238636` (green)

### Adding Database (Optional)
The contact form currently uses in-memory storage. To use a PostgreSQL database:

1. Set up your PostgreSQL database
2. Add your database URL to environment variables:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Deployment Options

### 1. Static Hosting (Netlify, Vercel, GitHub Pages)
For static-only deployment (without contact form):
- Upload the files from `server/public/` directory
- Remove the contact form functionality from the JavaScript

### 2. Full-Stack Hosting (Railway, Render, Heroku)
For full functionality including contact form:
- Deploy the entire project
- Set up environment variables for database (if using)
- Use the start script: `npm start`

### 3. VPS/Cloud Server
- Upload the project files
- Install Node.js and PostgreSQL
- Run `npm install` and `npm start`
- Configure reverse proxy (nginx) if needed

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (optional)
- `PORT`: Server port (defaults to 5000)
- `NODE_ENV`: Environment mode (development/production)

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run db:push`: Push database schema changes

## Contact Form API

The contact form sends POST requests to `/api/contact` with the following structure:

```json
{
  "name": "Full Name",
  "email": "email@example.com", 
  "subject": "Message Subject",
  "message": "Message content"
}
```

## License

This project is open source and available under the MIT License.