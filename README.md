# Fabric Design Application

A full-stack web application for customizing fabric designs with various mockups. Built with React (frontend) and Node.js/Express (backend).

## Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library (Radix UI based)
- **React Router** - Navigation
- **React Query** - Server state management
- **Fabric.js** - Canvas manipulation for fabric designs

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL (Neon) + Sequelize** - Database
- **JWT** - Authentication
- **Nodemailer** - Email sending

---

## File Structure with Explanations

### Root Configuration Files

| File                                       | Purpose                                                      |
| ------------------------------------------ | ------------------------------------------------------------ |
| [`package.json`](package.json)             | Frontend dependencies and scripts (npm run dev, build, etc.) |
| [`vite.config.ts`](vite.config.ts)         | Vite build configuration for the React app                   |
| [`tailwind.config.ts`](tailwind.config.ts) | Tailwind CSS theme and plugin configuration                  |
| [`tsconfig.json`](tsconfig.json)           | TypeScript compiler options                                  |
| [`postcss.config.js`](postcss.config.js)   | PostCSS configuration for Tailwind                           |
| [`eslint.config.js`](eslint.config.js)     | ESLint code linting rules                                    |
| [`components.json`](components.json)       | shadcn/ui component configuration                            |
| [`index.html`](index.html)                 | HTML entry point for the app                                 |

---

### `public/` - Static Assets

| File/Folder                                        | Purpose                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`public/fabrics/`](public/fabrics/)               | Fabric texture images (PNG files like abstract-warm.png, botanical-green.png, etc.)                |
| [`public/mockups/`](public/mockups/)               | Product mockup images (base images and mask images for T-shirts, dresses, pillows, curtains, etc.) |
| [`public/1.jpg` - `7.jpg`](public/)                | Hero/landing page images                                                                           |
| [`public/favicon.svg`](public/favicon.svg)         | Website favicon                                                                                    |
| [`public/placeholder.svg`](public/placeholder.svg) | Placeholder image for loading states                                                               |
| [`public/robots.txt`](public/robots.txt)           | Search engine crawling rules                                                                       |

---

### `server/` - Backend Application

#### Server Entry Point

| File                                 | Purpose                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`server/index.js`](server/index.js) | Express server entry point. Sets up middleware (CORS, JSON), connects to PostgreSQL, and mounts routes at `/api/auth` and `/api/designs` |

#### Server Configuration

| File                                         | Purpose                         |
| -------------------------------------------- | ------------------------------- |
| [`server/package.json`](server/package.json) | Server dependencies and scripts |
| [`server/README.md`](server/README.md)       | Server-specific documentation   |

#### Database Models (`server/models/`)

| File                                                 | Purpose                                                                                                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`server/models/User.js`](server/models/User.js)     | Sequelize User model with fields for username, email, password (hashed), names, avatar, and password reset tokens. Includes bcrypt password hashing and comparison methods |
| [`server/models/Design.js`](server/models/Design.js) | Sequelize Design model storing each user's fabric design configuration in PostgreSQL JSONB                                                                                    |

#### API Routes (`server/routes/`)

| File                                                   | Purpose                                                                                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [`server/routes/auth.js`](server/routes/auth.js)       | Authentication endpoints: signup, login, get current user, update profile, change password, forgot password, reset password. Uses JWT tokens |
| [`server/routes/designs.js`](server/routes/designs.js) | Design CRUD endpoints: create design, get all designs, get single design, update design, delete design. Requires JWT authentication          |

#### Server Utilities (`server/utils/`)

| File                                             | Purpose                                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| [`server/utils/email.js`](server/utils/email.js) | Nodemailer email sending utility for password reset emails |

---

### `src/` - Frontend Application

#### Entry Points

| File                                     | Purpose                                                                                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`src/main.tsx`](src/main.tsx)           | React app entry point. Renders the App component into the DOM                                                                                                                      |
| [`src/App.tsx`](src/App.tsx)             | Main app component with routing setup. Defines routes for all pages (Index, Login, Signup, Dashboard, ResetPassword, NotFound). Includes ProtectedRoute and PublicRoute components |
| [`src/index.css`](src/index.css)         | Global CSS styles including Tailwind directives                                                                                                                                    |
| [`src/App.css`](src/App.css)             | App-specific CSS styles                                                                                                                                                            |
| [`src/vite-env.d.ts`](src/vite-env.d.ts) | Vite type declarations                                                                                                                                                             |

#### Pages (`src/pages/`)

| File                                                         | Purpose                                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [`src/pages/Index.tsx`](src/pages/Index.tsx)                 | Landing/marketing page with hero section, features, FAQ, and login modal                                             |
| [`src/pages/Login.tsx`](src/pages/Login.tsx)                 | User login page with email/password form                                                                             |
| [`src/pages/Signup.tsx`](src/pages/Signup.tsx)               | User registration page with username, email, password fields                                                         |
| [`src/pages/Dashboard.tsx`](src/pages/Dashboard.tsx)         | Main design editor dashboard. Contains the fabric canvas, control panel, and mockup selector for customizing designs |
| [`src/pages/ResetPassword.tsx`](src/pages/ResetPassword.tsx) | Password reset flow - request reset link and set new password                                                        |
| [`src/pages/NotFound.tsx`](src/pages/NotFound.tsx)           | 404 page for undefined routes                                                                                        |

#### Components (`src/components/`)

| File                                                                     | Purpose                                                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`src/components/Navbar.tsx`](src/components/Navbar.tsx)                 | Navigation header with logo, nav links, and auth buttons                                               |
| [`src/components/Hero.tsx`](src/components/Hero.tsx)                     | Hero section on landing page with tagline and CTA                                                      |
| [`src/components/Footer.tsx`](src/components/Footer.tsx)                 | Site footer with links and copyright                                                                   |
| [`src/components/FAQ.tsx`](src/components/FAQ.tsx)                       | FAQ accordion with common questions                                                                    |
| [`src/components/Features.tsx`](src/components/Features.tsx)             | Feature highlights section on landing page                                                             |
| [`src/components/LoginModal.tsx`](src/components/LoginModal.tsx)         | Login/signup modal overlay component                                                                   |
| [`src/components/MockupSelector.tsx`](src/components/MockupSelector.tsx) | Component to select product type (T-shirt, dress, pillow, etc.)                                        |
| [`src/components/FabricSelector.tsx`](src/components/FabricSelector.tsx) | Component to select fabric texture pattern                                                             |
| [`src/components/FabricCanvas.tsx`](src/components/FabricCanvas.tsx)     | Main canvas component using Fabric.js for rendering fabric designs                                     |
| [`src/components/ControlPanel.tsx`](src/components/ControlPanel.tsx)     | Sidebar with all design customization controls (scale, rotation, offset, brightness, contrast, colors) |
| [`src/components/OverlayManager.tsx`](src/components/OverlayManager.tsx) | Manages mask overlays for realistic mockup rendering                                                   |
| [`src/components/NavLink.tsx`](src/components/NavLink.tsx)               | Custom navigation link component                                                                       |

#### shadcn/ui Components (`src/components/ui/`)

40+ reusable UI components built on Radix UI primitives:

| File                                                                 | Purpose                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| [`src/components/ui/button.tsx`](src/components/ui/button.tsx)       | Reusable button component                                 |
| [`src/components/ui/input.tsx`](src/components/ui/input.tsx)         | Text input component                                      |
| [`src/components/ui/card.tsx`](src/components/ui/card.tsx)           | Card container component                                  |
| [`src/components/ui/dialog.tsx`](src/components/ui/dialog.tsx)       | Modal dialog component                                    |
| [`src/components/ui/label.tsx`](src/components/ui/label.tsx)         | Form label component                                      |
| [`src/components/ui/toast.tsx`](src/components/ui/toast.tsx)         | Toast notification component                              |
| [`src/components/ui/sonner.tsx`](src/components/ui/sonner.tsx)       | Sonner toast notifications                                |
| [`src/components/ui/carousel.tsx`](src/components/ui/carousel.tsx)   | Carousel/slider component                                 |
| [`src/components/ui/select.tsx`](src/components/ui/select.tsx)       | Dropdown select component                                 |
| [`src/components/ui/slider.tsx`](src/components/ui/slider.tsx)       | Range slider component                                    |
| [`src/components/ui/switch.tsx`](src/components/ui/switch.tsx)       | Toggle switch component                                   |
| [`src/components/ui/accordion.tsx`](src/components/ui/accordion.tsx) | Accordion component                                       |
| [`src/components/ui/progress.tsx`](src/components/ui/progress.tsx)   | Progress bar component                                    |
| [`src/components/ui/avatar.tsx`](src/components/ui/avatar.tsx)       | User avatar component                                     |
| And more...                                                          | Other UI components (table, tabs, tooltip, popover, etc.) |

#### Context (`src/context/`)

| File                                                         | Purpose                                                                                                                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) | React Context for authentication state. Provides login, signup, logout, updateProfile functions. Manages JWT token in localStorage |

#### Custom Hooks (`src/hooks/`)

| File                                                           | Purpose                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`src/hooks/useFabricCanvas.ts`](src/hooks/useFabricCanvas.ts) | Custom hook for Fabric.js canvas operations (loading fabric, applying effects, etc.) |
| [`src/hooks/use-mobile.tsx`](src/hooks/use-mobile.tsx)         | Hook to detect mobile device viewport                                                |
| [`src/hooks/use-toast.ts`](src/hooks/use-toast.ts)             | Hook for toast notification functionality                                            |

#### Data (`src/data/`)

| File                                         | Purpose                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| [`src/data/mockups.ts`](src/data/mockups.ts) | Static configuration data for mockups (product types, image paths, etc.) |

#### Types (`src/types/`)

| File                                         | Purpose                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| [`src/types/fabric.ts`](src/types/fabric.ts) | TypeScript type definitions for fabric-related types |

#### Utilities (`src/lib/`)

| File                                   | Purpose                                          |
| -------------------------------------- | ------------------------------------------------ |
| [`src/lib/utils.ts`](src/lib/utils.ts) | Common utility functions (cn - className merger) |

#### Tests (`src/test/`)

| File                                                   | Purpose                  |
| ------------------------------------------------------ | ------------------------ |
| [`src/test/example.test.ts`](src/test/example.test.ts) | Example test file        |
| [`src/test/setup.ts`](src/test/setup.ts)               | Test setup configuration |

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description               | Auth Required |
| ------ | ------------------ | ------------------------- | ------------- |
| POST   | `/signup`          | Register new user         | No            |
| POST   | `/login`           | User login                | No            |
| GET    | `/me`              | Get current user          | Yes           |
| PUT    | `/profile`         | Update user profile       | Yes           |
| PUT    | `/change-password` | Change password           | Yes           |
| POST   | `/forgot-password` | Request password reset    | No            |
| POST   | `/reset-password`  | Reset password with token | No            |

### Design Routes (`/api/designs`)

| Method | Endpoint | Description          | Auth Required |
| ------ | -------- | -------------------- | ------------- |
| GET    | `/`      | Get all user designs | Yes           |
| POST   | `/`      | Create new design    | Yes           |
| GET    | `/:id`   | Get single design    | Yes           |
| PUT    | `/:id`   | Update design        | Yes           |
| DELETE | `/:id`   | Delete design        | Yes           |

### Health Check

| Method | Endpoint      | Description          | Auth Required |
| ------ | ------------- | -------------------- | ------------- |
| GET    | `/api/health` | Server health status | No            |

---

## Running the Application

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on http://localhost:5173

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm run dev
```

The backend runs on http://localhost:5000

Set `server/.env` with either:

```bash
DATABASE_URL=postgresql://username:password@your-project-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

or the local fallback variables in `server/.env.example`.

---

## Data Models

### User Model (`server/models/User.js`)

```javascript
{
  id: UUID,
  username: String,       // Unique, 3-30 chars
  email: String,         // Unique
  password: String,     // Hashed with bcrypt
  firstName: String,
  lastName: String,
  avatar: String,
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Design Model (`server/models/Design.js`)

```javascript
{
  id: UUID,
  userId: UUID,          // Reference to User
  name: String,          // Design name
  settings: {
    fabric: String,     // Selected fabric texture
    mockup: String,    // Selected product mockup
    scale: Number,     // Fabric scale/zoom
    rotation: Number,  // Fabric rotation
    offsetX: Number,   // Horizontal offset
    offsetY: Number,   // Vertical offset
    brightness: Number,
    contrast: Number,
    backgroundColor: String,
    productColor: String
  },
  thumbnail: String,    // Design preview image
  createdAt: Date,
  updatedAt: Date
}
```
#   m y f i n a l p r o j e c t  
 