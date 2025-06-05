# 🐞 Bug Report Tool – Spring Boot + MySQL + Docker

A simple bug tracking API built with **Spring Boot**, **MySQL**, and **Docker**.

---

## 📦 Features

- REST API to report and view bugs
- MySQL database integration
- Dockerized setup for easy deployment
- DevTools-enabled for fast development

---

## 🛠 Requirements

- Java 17+
- Maven
- Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bug-report-tool.git
cd bug-report-tool
```
### 2. Build the Spring Boot JAR

```bash
./mvnw clean package -DskipTests

If you are on Windows, use mvnw.cmd instead of ./mvnw.
```
### 3. Start the Application with Docker

```bash
docker-compose up --build
```

## ⚙️ Configuration

The application is preconfigured for Docker-based MySQL:

```properties
spring.datasource.url=jdbc:mysql://mysql-db:3306/bugdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```




