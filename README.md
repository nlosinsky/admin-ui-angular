# Admin UI Angular

A **personal project** - A modern Angular-based administrative user interface for managing companies, users, transactions, and business operations.

## 🚀 Features

- **Company Management** - Complete CRUD operations for company data
- **User Management** - Handle user accounts and profiles
- **Transaction Processing** - Manage financial transactions
- **Member Management** - Handle member registrations and approvals
- **Account Management** - Financial account operations
- **Document Management** - File and document handling
- **Modern UI** - Built with Angular and DevExtreme components

## 📁 Project Structure

This repository contains the **frontend** application. The backend API is located in a separate repository:

### Backend Repository
- **Repository**: [admin-ui-backend](https://github.com/nlosinsky/admin-ui-backend)
- **Description**: Node.js/Express.js REST API backend service
- **Features**: Authentication, user management, business logic, and data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see [admin-ui-backend](https://github.com/nlosinsky/admin-ui-backend))

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/admin-ui-angular.git
   cd admin-ui-angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the backend URL in `src/environments/environment.ts`

4. Start the development server:
   ```bash
   npm start
   ```

5. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.

## 🔧 Development

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: This frontend application requires the backend service to be running. Make sure to set up and configure the [admin-ui-backend](https://github.com/nlosinsky/admin-ui-backend) repository before running this application.
