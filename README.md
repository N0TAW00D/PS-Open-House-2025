# 🎟️ PS Open House 2025 - Event Management System

This project is a **Next.js**-based web application for managing event registrations and staff activities using **Supabase** as the backend.


## 🚀 Features
- 🔐 **User Authentication**: Secure login system via Supabase authentication.
- 📝 **Event Registration**: Users can register for events, and their details are stored in the database.
- 🎟️ **QR Code Generation**: Each registered user receives a unique QR code.
- 📊 **User Dashboard**: Displays event registration details and QR pass.
- 🛠️ **Staff Dashboard**: Allows authorized staff to scan QR codes and access participant details.


## 🛠️ Tech Stack
- 🖥️ **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons
- 🗄️ **Backend**: Supabase (PostgreSQL, Authentication, API)


## 📁 Project Structure
```
/ ── app/
   ├── (auth-pages)          # Authentication-related pages
   ├── actions.ts            # Server actions
   ├── auth                   # Authentication components
   ├── dashboard              # Dashboard components and pages
   ├── favicon.ico            # Favicon for the application
   ├── fonts                  # Custom fonts
   ├── form                   # Form components and pages
   ├── globals.css            # Global CSS styles
   ├── home                   # Home page components
   ├── layout.tsx             # Main layout component
   ├── opengraph-image.png    # Open Graph image for social sharing
   ├── page.tsx               # Main page component
   ├── protected              # Protected routes/components
   ├── schemas                # Database schemas or validation schemas
   └── staff                  # Staff-related components and pages

/ ── components/

/ ── hooks/                   # Custom React hooks

/ ── lib/
   └── utils.ts               # Utility functions

/ ── middleware.ts            # Middleware configuration

/ ── next-env.d.ts           # TypeScript environment definitions

/ ── next.config.js           # Next.js configuration file

/ ── node_modules/           # Project dependencies

/ ── package-lock.json        # Lock file for npm dependencies

/ ── package.json             # Project metadata and dependencies

/ ── postcss.config.js        # PostCSS configuration

/ ── public/
   ├── image                  # Public images directory
   └── json                   # Public JSON files directory

/ ── tailwind.config.ts       # Tailwind CSS configuration

/ ── tsconfig.json            # TypeScript configuration

└── utils/
    ├── baseMapping.ts        # Base mapping utilities
    ├── cn.ts                 # Utility functions for class names
    └── utils.ts              # General utility functions

```


## ⚙️ Setup Instructions
### 📌 Prerequisites
- 📦 Node.js & npm
- 🏗️ Supabase project with authentication and database tables set up


### 📥 Installation
1. 📂 Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. 📦 Install dependencies:
   ```sh
   npm install
   ```
3. ⚙️ Configure environment variables:
   Create a `.env.local` file and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```
4. ▶️ Run the development server:
   ```sh
   npm run dev
   ```

## 🎯 Usage
- 📝 **User Registration**: Users can sign up and register for an event.
- 📷 **QR Code Scan**: Staff members can scan a participant's QR code for validation.
- 🔑 **Role-based Access**: Staff members have access to different features than participants.


## 👥 Contributors
- **Natthawat Primsirikunawut** ([GitHub](https://github.com/N0TAW00D))


## 📜 License
This project is licensed under the MIT License.
