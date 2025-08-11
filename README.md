# ColectivAR

## 📌 Purpose
This repository contains a web application that allows you to track in real time the location of any bus in Buenos Aires, Argentina.

---

## ⚙️ Configuration and Usage

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Durphan/ColectivAR
    cd ColectivAR
    ```

2. **Create an account** on [API Transporte Buenos Aires](https://api-transporte.buenosaires.gob.ar/).

3. **Create a `.env` file** in the `server` directory and add your client ID and secret token:
    ```plaintext
    CLIENT_ID="Your client id token"
    CLIENT_SECRET="Your client secret token"
    ```

4. **Build the Docker image:**
    ```bash
    docker compose build
    ```

5. **Run the Docker container:**
    ```bash
    docker compose up
    ```

6. **Access the application** in your browser:  
   [http://localhost:4321/](http://localhost:4321/)

---

## 📦 Dependencies and Development Setup

**Dependencies:**
- `astro` ^5.4.0  
- `axios` ^1.7.9  
- `compression` ^1.8.0  
- `cors` ^2.8.5  
- `dotenv` ^16.4.7  
- `express` ^4.21.2  
- `leaflet` ^1.9.4  
- `ws` ^8.18.1  

**DevDependencies:**
- `@types/bun` latest  
- `@types/leaflet` ^1.9.16  

**PeerDependencies:**
- `typescript` ^5.0.0  

---

### 🛠 Development Environment Setup

1. Install **Node.js** and **npm** from the [official website](https://nodejs.org/).
2. Install **Bun** from the [official site](https://bun.com/).
3. Clone the repository and navigate to the project directory:
    ```bash
    git clone https://github.com/Durphan/ColectivAR
    cd ColectivAR
    ```
4. Navigate to the **front-end** folder and install dependencies:
    ```bash
    cd cyan-cycle
    npm install
    ```
5. Run the **front-end**:
    ```bash
    npm run dev
    ```
6. Navigate to the **back-end** folder and install dependencies:
    ```bash
    cd ../server
    bun install
    ```
7. Run the **server**:
    ```bash
    bun start
    ```

---

## 🤝 Contribution Guidelines

We welcome contributions to this project!  

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
    ```bash
    git checkout -b my-feature-branch
    ```
3. Make your changes and commit them with a descriptive commit message:
    ```bash
    git commit -m "Add new feature"
    ```
4. Push your changes to your forked repository:
    ```bash
    git push origin my-feature-branch
    ```
5. Create a pull request to the main repository.

---

## 📜 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for more information.
