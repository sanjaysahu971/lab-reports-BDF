# SeedShare Garden — Group Assignment (BDF)

## Student & Course Details

| Field | Details |
|---|---|
| **Student Name** | Sanjay Thota |
| **Registration Number** | 252U1R9162 |
| **Section** | CSE(GEN-AI) 2C |
| **Group ID** | JP-GAI2C-G02 |
| **Subject** | Backend Development Fundamentals (BDF) |
| **Academic Year & Term** | Year II – Term II |
| **Faculty** | Joel Prashanth D |
| **Project Title** | SeedShare Garden Community Management API |

---

## 1. Project Overview

**SeedShare Garden** is a backend RESTful API built with **Node.js**, **Express.js**, and **SQLite**. It manages community garden plots, registered gardeners, and plot leasing records with strict schema constraints, case-insensitive uniqueness validation, and relational queries.

### Key Capabilities
- **Relational Data Modeling**: Three related SQLite tables (`gardeners`, `plots`, `leases`) with foreign key constraints.
- **Case-Insensitive Uniqueness**: Plots table enforces unique names using `COLLATE NOCASE` preventing duplicates like `"Plot 9"` and `"plot 9"`.
- **Input Validation**: Rejects empty names, invalid soil types, non-numeric or negative sizes with `400 Bad Request`.
- **Relational Joins**: `GET /leases/` performs an `INNER JOIN` across `leases`, `gardeners`, and `plots`.
- **Parameterized Queries**: Protects against SQL injection using prepared statements and `?` placeholders.

---

## 2. Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js (`express` v4.19.2)
- **Database**: SQLite3 (`sqlite` v5.1.1, `sqlite3` v5.1.7)
- **Testing**: REST Client (`app.http`) & Postman

---

## 3. Database Schema

### `gardeners` Table
| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `name` | `TEXT` | `NOT NULL` |
| `email` | `TEXT` | `NOT NULL UNIQUE` |

### `plots` Table
| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `name` | `TEXT` | `NOT NULL COLLATE NOCASE UNIQUE` |
| `soil_type` | `TEXT` | `NOT NULL` |
| `size_sq_m` | `REAL` | `NOT NULL` |

### `leases` Table
| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `gardener_id` | `INTEGER` | `FOREIGN KEY (gardener_id) REFERENCES gardeners(id)` |
| `plot_id` | `INTEGER` | `FOREIGN KEY (plot_id) REFERENCES plots(id)` |
| `start_date` | `TEXT` | |
| `end_date` | `TEXT` | |

---

## 4. API Endpoints

| Method | Endpoint | Description | Expected Status |
|:---:|:---|:---|:---:|
| `GET` | `/gardeners/` | Retrieve all registered gardeners | `200 OK` |
| `GET` | `/gardeners/:gardenerId/` | Retrieve a specific gardener by ID | `200 OK` / `404 Not Found` |
| `GET` | `/plots/` | Retrieve all plots (supports `?soil_type=` search) | `200 OK` |
| `GET` | `/plots/:plotId/` | Retrieve a specific plot by ID | `200 OK` / `404 Not Found` |
| `POST` | `/plots/` | Add a new plot (validates name uniqueness & positive size) | `201 Created` / `400` / `409 Conflict` |
| `PUT` | `/plots/:plotId/` | Update an existing plot | `200 OK` / `400` / `404` / `409` |
| `DELETE` | `/plots/:plotId/` | Delete a plot by ID | `200 OK` / `404 Not Found` |
| `GET` | `/leases/` | Retrieve active leases joined with gardener & plot names | `200 OK` |

---

## 5. How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanjaysahu971/lab-reports-BDF.git
   cd "lab-reports-BDF/group assignment"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```
   *The server runs at `http://localhost:3000/` and automatically initializes the database `seedShareGarden.db` with sample data.*

4. **Run API Tests**:
   Open `app.http` in VS Code with the REST Client extension and click **Send Request** on each route.
