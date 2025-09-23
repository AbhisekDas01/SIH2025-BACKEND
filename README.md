# API Endpoints Documentation

This document provides comprehensive usage information for all API endpoints in the SIH2025-BACKEND system.

## Base URL
```
https://sih-2025-backend-sandy.vercel.app
```

## Authentication
Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## User Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user in the system.

**Authentication:** Not required

**Request Body:**
```json
{
  "FirstName": "John",
  "middleName": "Kumar",
  "lastName": "Doe",
  "AadhaarNumber": "123456789012",
  "EmailId": "john.doe@example.com",
  "PhoneNumber": 9876543210,
  "DateOfBirth": "1990-01-15",
  "Gender": "Male",
  "Address": {
    "Village": "Sample Village",
    "District": "Sample District",
    "State": "Sample State",
    "PinCode": "123456",
    "Country": "India"
  },
  "password": "securePassword123",
  "Role": "COMMUNITY_USER"
}
```

**Required Fields:**
- `FirstName` (string, min 2 characters)
- `AadhaarNumber` (string, exactly 12 digits)
- `EmailId` (string, valid email format)
- `PhoneNumber` (number)
- `password` (string)

**Optional Fields:**
- `middleName` (string)
- `lastName` (string)
- `DateOfBirth` (date, must be in the past)
- `Gender` (enum: "Male", "Female", "Other", "Prefer not to say")
- `Address` (object with Village, District, State, PinCode, Country)
- `Role` (enum: "ASHA_WORKER", "COMMUNITY_VOLUNTEER", "COMMUNITY_USER", "WATER_QUALITY_TESTER", "PHC_STAFF")

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "AadhaarNumber": "123456789012",
  "password": "securePassword123"
}
```

**Required Fields:**
- `AadhaarNumber` (string, exactly 12 digits)
- `password` (string)

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpiry": "24h"
  }
}
```

---

### 3. Get User Data
**Endpoint:** `GET /api/auth/get-user`

**Description:** Retrieve authenticated user's profile information.

**Authentication:** Required (Bearer token)

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "FirstName": "John",
    "middleName": "Kumar",
    "lastName": "Doe",
    "AadhaarNumber": "123456789012",
    "EmailId": "john.doe@example.com",
    "PhoneNumber": 9876543210,
    "DateOfBirth": "1990-01-15T00:00:00.000Z",
    "Gender": "Male",
    "Address": {
      "Village": "Sample Village",
      "District": "Sample District",
      "State": "Sample State",
      "PinCode": "123456",
      "Country": "India"
    },
    "Role": "COMMUNITY_USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Health Report Endpoints

### 4. Create Health Report
**Endpoint:** `POST /api/health/create-report`

**Description:** Submit or update daily health report data for a village.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "village_id": "VILLAGE_001",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "rainfall_mm": 15.5,
  "reported_cases": 5,
  "symptom_diarrhea_cases": 2,
  "symptom_vomiting_cases": 1,
  "symptom_fever_cases": 3
}
```

**Required Fields:**
- `village_id` (string)
- `location` (object)
  - `latitude` (number, -90 to 90)
  - `longitude` (number, -180 to 180)

**Optional Fields:**
- `rainfall_mm` (number, ≥ 0, default: 0)
- `reported_cases` (number, ≥ 0, default: 0)
- `symptom_diarrhea_cases` (number, ≥ 0, default: 0)
- `symptom_vomiting_cases` (number, ≥ 0, default: 0)
- `symptom_fever_cases` (number, ≥ 0, default: 0)

**Response (New Report):**
```json
{
  "success": true,
  "message": "New report created successfully!",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "reporters": ["64a1b2c3d4e5f6789012345"],
    "village_id": "VILLAGE_001",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "rainfall_mm": 15.5,
    "reported_cases": 5,
    "symptom_diarrhea_cases": 2,
    "symptom_vomiting_cases": 1,
    "symptom_fever_cases": 3,
    "is_outbreak": 0,
    "verified_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Updated Report):**
```json
{
  "success": true,
  "message": "Report updated successfully!",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "reporters": ["64a1b2c3d4e5f6789012345", "64a1b2c3d4e5f6789012346"],
    "village_id": "VILLAGE_001",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "rainfall_mm": 12.75,
    "reported_cases": 8,
    "symptom_diarrhea_cases": 4,
    "symptom_vomiting_cases": 2,
    "symptom_fever_cases": 5,
    "is_outbreak": 0,
    "verified_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** If a user tries to submit data for the same day twice, they will receive a 409 error with message "You have already submitted today's data!"

---

### 5. Get Village Health Data (Last 7 Days)
**Endpoint:** `GET /api/health/get-data`

**Description:** Retrieve health report data for all villages from the last 7 days.

**Authentication:** Not required

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Successfully retrieved last 7 days of data for each village.",
  "data": [
    {
      "village_id": "VILLAGE_001",
      "daily_reports": [
        {
          "date": "2024-01-01T00:00:00.000Z",
          "reported_cases": 5,
          "symptom_diarrhea_cases": 2,
          "symptom_vomiting_cases": 1,
          "symptom_fever_cases": 3,
          "rainfall_mm": 15.5,
          "location": {
            "latitude": 28.6139,
            "longitude": 77.2090
          }
        },
        {
          "date": "2024-01-02T00:00:00.000Z",
          "reported_cases": 3,
          "symptom_diarrhea_cases": 1,
          "symptom_vomiting_cases": 0,
          "symptom_fever_cases": 2,
          "rainfall_mm": 10.2,
          "location": {
            "latitude": 28.6139,
            "longitude": 77.2090
          }
        }
      ]
    }
  ]
}
```

---

## Water Report Endpoints

### 6. Create/Update Water Report
**Endpoint:** `POST /api/water/create-water-report`

**Description:** Create or update daily water quality report for a village.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "village_id": "VILLAGE_001",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "water_turbidity_ntu": 2.5,
  "water_ph": 7.2,
  "rainfall_mm": 15.5
}
```

**Required Fields:**
- `village_id` (string)
- `location` (object)
  - `latitude` (number, -90 to 90)
  - `longitude` (number, -180 to 180)
- `water_turbidity_ntu` (number, ≥ 0)
- `water_ph` (number, 0-14)

**Optional Fields:**
- `rainfall_mm` (number, ≥ 0, default: 0)

**Response (Created):**
```json
{
  "success": true,
  "message": "Water report created successfully.",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "date": "2024-01-01T00:00:00.000Z",
    "village_id": "VILLAGE_001",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "rainfall_mm": 15.5,
    "water_turbidity_ntu": 2.5,
    "water_ph": 7.2,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response (Updated):**
```json
{
  "success": true,
  "message": "Water report updated successfully for today.",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "date": "2024-01-01T00:00:00.000Z",
    "village_id": "VILLAGE_001",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "rainfall_mm": 20.0,
    "water_turbidity_ntu": 3.0,
    "water_ph": 7.5,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T15:00:00.000Z"
  }
}
```

---

### 7. Get Village Water Report
**Endpoint:** `GET /api/water/get-water-report/:village_id`

**Description:** Retrieve all water quality reports for a specific village.

**Authentication:** Not required

**Path Parameters:**
- `village_id` (string) - The ID of the village

**Request Body:** None

**Example Request:**
```
GET /api/water/get-water-report/VILLAGE_001
```

**Response:**
```json
{
  "success": true,
  "message": "Village water report found",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "date": "2024-01-01T00:00:00.000Z",
      "village_id": "VILLAGE_001",
      "location": {
        "latitude": 28.6139,
        "longitude": 77.2090
      },
      "rainfall_mm": 15.5,
      "water_turbidity_ntu": 2.5,
      "water_ph": 7.2,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "date": "2024-01-02T00:00:00.000Z",
      "village_id": "VILLAGE_001",
      "location": {
        "latitude": 28.6139,
        "longitude": 77.2090
      },
      "rainfall_mm": 10.2,
      "water_turbidity_ntu": 1.8,
      "water_ph": 7.0,
      "createdAt": "2024-01-02T12:00:00.000Z",
      "updatedAt": "2024-01-02T12:00:00.000Z"
    }
  ]
}
```

---
