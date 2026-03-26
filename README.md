# 🚀 Dealer CRM

## 📌 Overview
This project is a **production-ready CRM system** designed for managing dealers, leads, orders, payments, and sales operations efficiently.

Built for **Techfanatics Equipment Limited**, the system ensures scalability, clean architecture, and real-world business logic implementation.

---

## 🎯 Objective
To build a **robust and scalable CRM platform** that enables:
- Efficient lead tracking & assignment
- Dealer performance management
- Order & payment tracking
- Sales analytics & reporting

---

## 🧩 Core Modules

### 1. 🔐 Authentication & Role Management
- Secure login/logout
- Role-based access (Admin, Dealer, Sales)
- JWT authentication

---

### 2. 🏪 Dealer Management
- Add / Edit / Delete dealers
- Area-wise dealer mapping
- Dealer-specific data visibility

---

### 3. 📊 Lead Management & Assignment
- Capture leads:
  - Name
  - Phone
  - Area
  - Requirement
- Assign leads to dealers (area-based)
- Lead status tracking:
  - New
  - Contacted
  - Converted
  - Lost
- Admin controls:
  - Edit / Delete / Reassign leads

---

### 4. 📦 Order Management
- Create and manage orders
- Link orders with leads/dealers
- Track order status

---

### 5. 💰 Ledger & Payment System
- Track payments per dealer
- Maintain ledger entries
- Auto-update outstanding balance

---

### 6. 🎁 Scheme & Incentive System
- Define incentive schemes
- Apply schemes based on sales
- Track dealer rewards

---

### 7. 🛠 Complaint / Support System
- Raise support tickets
- Track issue status
- Admin resolution system

---

### 8. 👨‍💼 Sales Team Module
- Manage sales executives
- Assign leads
- Track performance

---

### 9. 📈 Dashboard & Analytics
- Sales overview
- Lead conversion rate
- Dealer performance insights
- Revenue analytics

---

## 🧠 Business Logic

- Dealer can only access **assigned data**
- One lead → assigned to **only one dealer**
- Admin has **full control**
- Payment updates **outstanding automatically**

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Architecture
- REST API
- MVC Pattern

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```
git clone https://github.com/OxInd3x/dealer-crm.git
cd dealer-crm
## ⚙️ Installation & Setup
```

### 2. Backend Setup
```
cd server
npm install
```

### Create a .env file
```
PORT=XXXX
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Server
```
npm run dev
```

### 3. Frontend Setup
```
cd frontend
npm install
npm start
```
