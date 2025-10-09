# Autochek Backend API

A comprehensive, production-ready backend API for vehicle valuation and financing services, built with NestJS, TypeORM, SQLite, and secured with API key authentication and rate limiting.

## 🚀 Features

- **Vehicle Data Ingestion**: RESTful API for vehicle management with VIN validation
- **Vehicle Valuation**: Integration with RapidAPI VIN lookup and internal valuation models
- **Loan Application Processing**: Automated eligibility checks with intelligent scoring
- **Offers Management**: Create and manage promotional campaigns
- **API Authentication**: Simple API key-based security
- **Rate Limiting**: Endpoint-specific rate limits to prevent abuse
- **Interactive Documentation**: Swagger/OpenAPI UI for easy testing
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: Input validation using class-validator

## 📋 System Requirements

- Node.js v18 or higher
- npm or yarn

## 🛠️ Installation

### 1. Clone or Extract Project

```bash
git clone <repository-url>
cd autochek-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env

PORT=3000
RAPIDAPI_KEY=
JWT_SECRET= 
# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=:memory:


```env
PORT                      # Server port (default: 3000)
NODE_ENV                  # Environment (development/production)
API_KEY                   # Required for all API requests
RAPIDAPI_KEY              # Optional, for VIN lookup
DB_TYPE                   # Database type (sqlite)
DB_DATABASE               # Database location

```
run npm run start:dev
## 🧪 Testing

### Manual Testing
access endpoints on `http://localhost:3000`

Use Swagger UI: `http://localhost:3000/api-docs`



Use Swagger UI to access full documentation: `http://localhost:3000/api-docs`