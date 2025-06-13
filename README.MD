# 🛒 Ecommerce Microservices System

A scalable ecommerce platform built using a **Node.js microservices architecture** with **Kafka**, **MongoDB**, **PostgreSQL**, and **Docker Compose**. This system supports core ecommerce workflows such as product management, inventory tracking, discount application, cart handling, and order processing using the **Saga pattern** for distributed transactions.


### Clone the repository

```bash
git clone https://github.com/harrynguyen0710/ecommerce.git
cd ecommerce-microservices

---

## 🧱 Architecture Overview

---

## ⚙️ Tech Stack

- **Node.js**, **Express.js** – RESTful APIs for all services
- **KafkaJS** – Event streaming and communication
- **MongoDB** – Used by Product and Cart services
- **PostgreSQL** – Used by Inventory, Discount, and Order services
- **Docker Compose** – Multi-service orchestration
- **Redis** – For concurrency locks and caching
- **Joi** – Input validation
- **Prisma / Mongoose** – ORM/ODM for data models

---

## 🧩 Services

### 1. **Product Service**
- CRUD for products (MongoDB)
- Emits Kafka events: `product.created`, `product.updated`, `product.deleted`
- Used by Inventory to sync product info

### 2. **Inventory Service**
- Manages stock levels (PostgreSQL)
- Listens to `product.*`, `order.created`, `order.cancelled`
- Kafka events: `inventory.reserved`, `inventory.released`

### 3. **Cart Service**
- User cart management (MongoDB)
- Supports item-level updates, optimistic locking
- Handles cart locking/unlocking during checkout

### 4. **Discount Service**
- Voucher management (PostgreSQL)
- Validates discount usage, scope, limits
- Supports multiple vouchers per cart
- Events: `discount.created`, `discount.applied`, `order.cancelled`

### 5. **Order Service**
- Orchestrates checkout using **Saga pattern**
- Steps:
  1. Validate cart
  2. Validate discounts
  3. Reserve inventory
  4. Create order
  5. Finalize
- Handles rollback on failure
- Stores orders in PostgreSQL

---

## 🔁 Saga Pattern – Order Checkout

1. Lock cart
2. Validate & apply vouchers
3. Reserve inventory
4. Create order
5. Mark cart complete
6. On failure at any step: trigger rollback via Kafka

---

## 🐳 Local Development (Docker Compose)

```bash
# Start all services + Kafka + DBs
docker-compose up --build
