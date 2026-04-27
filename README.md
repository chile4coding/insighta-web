
# Insighta Web Portal

Web interface for the Insighta Labs+ Profile Intelligence Platform.

## Overview

A Next.js-based web application providing a user-friendly interface for managing and searching profiles with secure authentication and role-based access control.

## Features

- **Secure Authentication**: GitHub OAuth with HTTP-only cookies
- **Role-Based Access**: Different features for admins vs analysts
- **Profile Management**: View, search, and create profiles (admin)
- **Natural Language Search**: Intuitive query interface
- **Data Export**: Download profiles as CSV
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Next.js middleware, HTTP-only cookies
- **State Management**: React Context API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running ([see backend setup](../insighta-backend/README.md))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd insighta-web

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

### Environment Variables

Create `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE=http://localhost:4888/api

# Next.js settings (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript

## Application Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── login/                # Login page
│   ├── dashboard/            # Dashboard home
│   ├── profiles/             # Profile list
│   ├── search/               # Search page
│   ├── create/               # Create profile (admin)
│   └── account/              # Account settings
├── components/               # React components
├── contexts/                 # React contexts (Auth)
├── lib/                      # API client and utilities
└── middleware.ts             # Auth middleware
```

## Pages

### Login (`/login`)

GitHub OAuth authentication page. Users click "Continue with GitHub" to authenticate.

### Dashboard (`/dashboard`)

Overview page showing:
- Total profiles count
- Male/female distribution
- Recent profiles (last 7 days)
- Quick action cards

### Profiles (`/profiles`)

Browse all profiles with:
- Filter by gender, country, age group
- Advanced age filtering (min/max)
- Sorting options
- Pagination
- Export to CSV

### Search (`/search`)

Natural language search interface. Examples:
- "female adults from US"
- "males over 30"
- "senior profiles from Germany"

### Account (`/account`)

User profile settings:
- Username and email
- Role display
- Account status
- Sign out

### Create Profile (`/create`)

Admin-only page to create new profiles by name.

## Authentication

### How It Works

1. User clicks "Continue with GitHub" on login page
2. Redirected to GitHub OAuth authorization
3. GitHub redirects back to callback URL
4. Backend processes callback, sets HTTP-only cookies
5. User redirected to dashboard

### Security Features

- **HTTP-only Cookies**: Tokens inaccessible to JavaScript
- **SameSite Strict**: Prevents CSRF attacks
- **Secure Flag**: HTTPS-only in production
- **CSRF Protection**: Double-submit cookie pattern
- **Session Management**: Automatic token refresh

### Protected Routes

All pages except `/login` require authentication. Unauthenticated users are redirected.

## Role-Based Access

- **Admin**: Full access (create, delete, export)
- **Analyst**: Read-only (browse, search, export)

## API Integration

The application uses a custom API client (`src/lib/api.ts`) that:
- Handles authentication automatically
- Refreshes expired tokens
- Includes required headers (X-API-Version, X-CSRF-Token)
- Manages errors gracefully

## UI Components

### Data Table

Responsive table for displaying profiles with:
- Sortable columns
- Pagination controls
- Loading states
- Export options

### Cards

Information cards for dashboard stats with icons and colors.

### Forms

Filter forms with validation and real-time feedback.

### Navigation

Responsive navbar with:
- User info display
- Role badges
- Logout button

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Colors**: Blue primary, gray neutrals
- **Responsive**: Mobile-first design
- **Dark Mode Ready**: (can be added)

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
NEXT_PUBLIC_API_BASE=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## CI/CD

GitHub Actions workflow runs on PR:
- Linting (ESLint)
- Type checking (TypeScript)
- Build verification

## Performance

- Code splitting with Next.js
- Image optimization (future)
- Font optimization
- Static optimization where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management
- Color contrast compliant

## Testing

Currently manual testing. Future plans:
- Jest for unit tests
- React Testing Library for components
- Cypress for E2E

## Troubleshooting

### Login Redirect Loop

Ensure cookies are enabled and same-site settings match your domain.

### API Errors

Check that backend is running and CORS is configured correctly.

### Styling Issues

Run `npm install` to ensure all Tailwind dependencies are installed.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following existing patterns
4. Test thoroughly
5. Submit pull request

## License

MIT

## See Also

- [Insighta Backend](../insighta-backend)
- [Insighta CLI](../insighta-cli)
# insighta-web
