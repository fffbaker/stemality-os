# STEMALITY OS — Enterprise Enrichment Program Operating System

> **Proprietary Studio & Academy Management Platform for STEM Education**  
> *Curricula Focus: Coding, Robotics, Artificial Intelligence, and Game Development.*

[![Built with React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://react.dev/)
[![Bundler](https://img.shields.io/badge/Bundler-Vite%208-emerald)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styles-Tailwind%20CSS%20%2B%20Lucide-indigo)](https://tailwindcss.com/)
[![Themes](https://img.shields.io/badge/Themes-10%20Aesthetic%20Palettes-purple)](src/data/themes.ts)

---

## Overview

**STEMALITY OS** is a full-featured, state-of-the-art operating system designed for modern enrichment academies, innovation hubs, and STEM learning centers. It automates recurrent billing, streamlines lead acquisition, manages multi-week cohorts, handles retail merchandise POS, and empowers administrators with comprehensive audit reports and customizable aesthetic themes.

---

## Key Feature Modules

### 1. 🛡️ Multi-Admin Governance & Authentication
- **Secure Sign-In Gateway**: Custom glassmorphic authentication portal with PIN/password protection and error shaking feedback.
- **1-Click Quick Access**: Pre-configured admin shortcuts for leadership staff.
- **User Management Console**: Full CRUD for administrators, role assignment (`Super Admin`, `Director`, `Instructor`, `Staff`), password reset modals, and account suspension safeguards.
- **Pre-Configured Default Admins (PIN: `5270`)**:
  - `Rick` (Super Admin / Chief STEM Director)
  - `Franklene` (Director / Operations Lead)
  - `Fariah` (Director / Head of AI & Game Dev)
  - `Frederick` (Super Admin / Lead Robotics Architect)

### 2. 🎨 10 Personalized Aesthetic Themes
Dynamic CSS variable theming with live switching and persistent user preferences:
- 🟩 **Emerald Cyberpunk** (Neon emerald & obsidian slate)
- 🟪 **Midnight Indigo & Violet** (Deep navy & luminous indigo)
- 🟦 **Quantum Cyan** (Futuristic electric cyan & sapphire)
- 🟧 **Solar Flare & Amber** (Radiant warm gold & volcanic dark)
- 🟪 **Synthwave Sunset** (Neon magenta, violet, and retro cyan)
- 🟥 **Crimson Protocol** (Tactical dark carbon & vivid scarlet)
- ⬛ **Deep Space Obsidian** (Ultra-minimalist matte black & titanium)
- 🌌 **Aurora Borealis** (Northern lights cosmic teal, blue, & violet)
- 🟫 **Rose Gold Luxe** (Dark burgundy & champagne rose gold)
- ⬜ **Clean Tech Titanium** (Daylight studio slate with high contrast navy)

### 3. 💳 Automated Recurring Billing Engine
- Member status tracking: **Active**, **On-Hold (1 - 6 Months)**, and **InActive**.
- Dynamic billing pause engine with resume dates and pause reasoning.
- Failed payment recovery simulation and scheduled cycle execution.

### 4. 🚀 Managed Offerings Hub & Dedicated Registration
- Full catalog covering:
  - **Membership Subscriptions** (Monthly recurring)
  - **Summer Camps & Half-Day Camps**
  - **Cohort Workshops** (Configurable days/week and total weeks)
  - **Holiday & Offsite Workshops**
  - **BattleBot LAN Birthday Parties**
  - **Third-Party Partnerships** (Girl Scouts STEM clinics)
  - **Free Trial Assessments** (Lead capture)
- **Admin Control Toolbar**: Admins can **Edit**, **Copy (Duplicate)**, and **Delete** any offering in 1 click.
- Automatic discounts: 15% Sibling Discount, Early-Bird countdown discounts.
- Digital liability release & safety waivers.
- Shareable registration links and simulated QR codes.

### 5. 👥 Student Member Management (CRUD & Attendance)
- Complete student record creation, editing, and deletion.
- STEM achievement tracking: Junior Coder, Python Developer, Robotics Level 3, AI Engineer badges.
- Attendance history with check-in timestamps.
- **Export to CSV** functionality (`stemality-members-[date].csv`).

### 6. 🎯 Lead Capture Pipeline & 14-Day Automated Nurture
- Multi-stage kanban: *New Trial Lead*, *Trial Scheduled*, *Trial Completed*, *Nurture Sequence*, *Enrolled*, *Lost*.
- 14-day automated drip trigger simulation (SMS, Email, Advisor Outreach).
- Quick Trial Lead modal launcher from the global header.

### 7. 📅 Class Calendar & Cohort Generator
- Interactive weekly schedule view with time-slot filters and student rosters.
- One-click student attendance check-in counter.
- Automatic cohort schedule generator creating multi-week recurring sessions.

### 8. 🛍️ Retail Online Shop & Point of Sale (POS)
- Product categories: Robotics Kits, AI Boards, Keyboards, Hoodies, and Brain Fuel.
- **Admin Product Controls**: Admins can **Add**, **Edit**, **Copy**, and **Delete** store items.
- Multi-item register cart with real-time tax calculation, promo codes (`STUDIO10`, `VIP20`), and tender selection (Card, ACH, Apple Pay).

### 9. 🧾 Transaction Ledger & JSON Data Portability
- Real-time transaction ledger with receipt modals and refund processing.
- One-click **JSON Export** (`stemality-transactions-[date].json`).
- Resilient **JSON Import** engine with syntax validation and ledger reconstruction.

### 10. 📊 Executive Analytics & Audit Reports
- High-level KPIs: Active MRR, student retention rates, capacity utilization, and lead conversion rates.
- Revenue breakdown by STEM discipline.
- **Audit CSV Export** (`stemality-analytics-report-[date].csv`).

---

## Getting Started

### Prerequisites
- Node.js 18+ or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/stemality-os.git

# Navigate into the project folder
cd stemality-os

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The app will start at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```

---

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Icons**: Lucide React
- **3D Graphics**: Three.js

---

## License
Proprietary — Developed for STEMALITY. All rights reserved.
