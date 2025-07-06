
# 🧪 FakeStore Gateway (Node.js)

This is a lightweight **Node.js gateway app** that authenticates users and proxies requests to the [FakeStore API](https://fakestoreapi.com/). It's designed for testing, learning, and performance engineering interview scenarios.

---

### ✅ Interview Prerequisites

Make sure the following tools and setup are available before starting the interview tasks:

#### Local Environment

* [Node.js](https://nodejs.org/) v20+
* [npm](https://www.npmjs.com/) (comes with Node)
* [Docker](https://www.docker.com/) installed and running
* A REST client such as:
  * [curl](https://curl.se/)
  * [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/)
* Git installed and configured
* A modern code editor (e.g., [VS Code](https://code.visualstudio.com/))

#### Performance Testing Tools

You may use **any** performance testing tool of your choice below:

* [k6](https://k6.io/)
* [Gatling](https://gatling.io/)
* [Locust](https://locust.io/)
* [JMeter](https://jmeter.apache.org/)

#### Access

* Internet connection (required to access upstream FakeStore API)
* GitHub account

#### Recommended Skills

* Familiarity with Node.js, Express, and RESTful APIs
* Basic Docker usage (build images, run containers, map ports)
* Understanding of performance testing concepts: throughput, latency, error rate, concurrency
* CI/CD familiarity, e.g., GitHub Actions (helpful, but not mandatory)
* Basic understanding of **mocking concepts** (e.g., intercepting upstream dependencies for isolated testing)

---

### 🧪 Interview To-Do List  
<details><summary>
1. Read `README.md` and ask questions
</summary>

## 🚀 Project Info

## 🔐 Authentication

Before using the protected endpoints, authenticate to get a JWT token:

### Request

```http
POST /auth
Content-Type: application/json

{
  "username": "test",
  "password": "test"
}
```

### Response

```json
{
  "message": "Authenticated successfully",
  "token": "fake-jwt-token-..."
}
```

Use this token as:

```
Authorization: Bearer <token>
```

for all protected requests.

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run only unit tests

```bash
npm run test:unit
```

### Run only acceptance tests

```bash
npm run test:acceptance
```

---

## 📂 Project Structure

```
.
├── controllers/            # Business logic
├── middleware/             # Auth middleware
├── routes/                 # Express routes
├── swagger.yaml            # OpenAPI spec
├── tests/                  # Unit + Acceptance tests
├── index.js                # App entry point
└── swagger.js              # Swagger setup
```

---

## 💡 Notes

* Product `POST` is mocked — FakeStore API doesn’t persist created products.
* Only IDs 1–20 exist on `GET /products/:id`.

---

</details>

<details><summary>
2. Checkout code to your own branch. Run the app locally
</summary>

### Clone the repository

```bash
git clone https://gitlab.com/sl-group4/fakestore-gateway-node.git
cd fakestore-gateway-node
```

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm start
```

The server runs by default at:

```
http://localhost:3000
```

---

## 📘 API Docs (Swagger)

Visit:

```
http://localhost:3000/api-docs
```

Use the **Authorize** button to enter your Bearer token.

</details>   

<details><summary>
3. Cover with performance tests
</summary>

#### Performance Test Spec Summary

* **Setup:** On test start, simulate 20 virtual users.  
* **Authentication:** Each user performs `/auth` to get a JWT token.  
* **Traffic:** Users send requests to endpoints.  
* **Duration:** Ramp up users evenly over 10 seconds, then sustain load for 1 minute.  
* **Assertions:**  
  * Monitor 95th percentile response time per endpoint.  
  * Ensure error rate ≤ 0.01%.  
  * Validate correct responses (status codes and schemas).  

---

#### Test Parameters

| Parameter           | Value                     |
|---------------------|---------------------------|
| Concurrent users    | 20                        |
| Ramp-up duration    | 10 seconds                |
| Test duration       | 1 minute                  |
| Error rate threshold| ≤ 0.01%                   |

#### Response Time Targets

| Endpoint            | 95th Percentile Response Time |
|---------------------|-------------------------------|
| `GET /products`     | ≤ 500 ms                      |
| `GET /products/{id}`| ≤ 500 ms                      |
| `POST /products`    | ≤ 600 ms                      |

#### Authentication

* Each virtual user should **authenticate once** (POST `/auth`) before sending requests.  
* Use the retrieved JWT token in the `Authorization: Bearer <token>` header for all subsequent requests.
</details>

<details><summary>
4. Run the app in Docker 
</summary>

## Build Docker image

```bash
docker build -t fakestore-gateway .
```

## Run the container

```bash
docker run fakestore-gateway
```

The app will be accessible at `http://localhost:3000`.

</details>

<details><summary>
5. Run performance tests against the Docker container 
</summary>

Ensure tests target the app running inside Docker and analyze behavior under load.

</details> 

<details><summary>
6. Analyze test results 
</summary>

Review metrics, bottlenecks, response times, throughput, and failure points.

</details>

<details><summary>
7. Integrate performance tests into the CI/CD pipeline 
</summary>

Add performance testing into GitHub Actions or another pipeline tool.

</details>

<details><summary>
8. Introduce observability
</summary>

### 1. Start the Stack

Build and run all services (Node.js app, Prometheus, Grafana):

```bash
docker-compose up --build
```

This will:

* Start the **Node.js** application
* Launch **Prometheus** for metrics scraping
* Spin up **Grafana** for visual dashboards

---

### 2. Access the Services

Once running, visit the following URLs:

* 🌐 **Node.js App**: [http://localhost:3000](http://localhost:3000)
* 📈 **Prometheus** (metrics): [http://localhost:9090](http://localhost:9090)
* 📊 **Grafana** (dashboards): [http://localhost:3001](http://localhost:3001)

---

### 3. Configure Grafana

1. Go to **Grafana**: [http://localhost:3001](http://localhost:3001)

2. Log in using default credentials:

   ```
   Username: admin
   Password: admin
   ```

3. Add a **Prometheus** data source:

   * Navigate to **Configuration → Data Sources → Add data source**
   * Select **Prometheus**
   * Set URL to:

     ```
     http://prometheus:9090
     ```
   * Click **Save & Test**

4. Import a Dashboard:

   * Go to **Dashboards → Import**
   * Upload or paste a dashboard JSON (e.g., Node.js Golden Signals)
   * Select your Prometheus data source
   * Click **Import** and import dashboard

---

### ✅ Dashboard Ready

You should now see live Node.js metrics visualized in Grafana, including:

* 🔁 **Request Rate**
* ⏱ **Latency (P95)**
* ❌ **Error Rates (5xx)**
* 🧠 **CPU and Memory Usage**

</details>

<details><summary>
9. Replace upstream service with mocks
</summary>

Use mocking to isolate upstream dependencies for deterministic tests.

</details>

## 📜 License

MIT — feel free to fork or use for interview testing.
