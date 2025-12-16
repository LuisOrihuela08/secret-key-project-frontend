<h1 align="center"> 🔐 Secret Key Project - Credential Manager </h1>
<div align="center">
  <img width="633" height="633" alt="Image" src="https://github.com/user-attachments/assets/9288d393-fc92-421d-a9ec-1e159a1433ce" />
</div>


This project allows you to manage your credentials securely.

## ✨ Features
- Custom credential management
- Multiple users
- Filter platforms by name
- PDF and Excel reports
- Easy to install

## 🛠️ Technologies

- React
- Tailwind

## 🚀 Installation
Clone the project repository
```bash
   https://github.com/LuisOrihuela08/secret-key-project-frontend.git
   cd secret-key-project
   ```
- Backend: If you wish more details and customize something.
```bash
   git clone https://github.com/LuisOrihuela08/secret-key-project.git
   cd secret-key-project
   ```
To get the web application up and running quickly, it is best to run the following docker-compose: 
```bash
services:
  mongodb:
    image: mongo:7.0
    container_name: secretkey-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo
      MONGO_INITDB_DATABASE: secretkey
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - secretkey-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/secretkey --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  secret-key-backend:
    image: luisorihuela92/secret-key-backend:latest
    container_name: secretkey-app-backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATA_MONGODB_URI: mongodb://mongo:mongo@mongodb:27017/secretkey?authSource=admin
      JWT_SECRET: DHoEyF2VTNrYGafkeIP9LipcGfVkOt8SeBC9SjViYR8=
      JWT_EXPIRATION: 86400000
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - secretkey-network

volumes:
  mongodb_data:
    name: secretkey-mongodb-data
  mongodb_config:
    name: secretkey-mongodb-config

networks:
  secretkey-network:
   ```

And access the link
```bash
   http://localhost:3000
   ```

## 📸 Screenshots
1️⃣ Register
![Image](https://github.com/user-attachments/assets/477f22fc-6ece-405a-a5f4-363cfcba3ad7)

2️⃣ Login
![Image](https://github.com/user-attachments/assets/fc351534-fab3-4d24-ab23-a44d3fa9d4c6)

3️⃣ Home page
<img width="1273" height="1268" alt="Image" src="https://github.com/user-attachments/assets/a673161e-6a22-4f7b-8bf9-690f4adcca44" />
![Image](https://github.com/user-attachments/assets/2c7fdb11-e515-4cc5-b479-e234a0cd4b89)
<img width="1272" height="1268" alt="Image" src="https://github.com/user-attachments/assets/59290793-71c7-44c5-b586-2d347a8671ba" />
<img width="1274" height="1271" alt="Image" src="https://github.com/user-attachments/assets/369c38ee-dffc-4abb-978e-ce06410768fa" />
<img width="1273" height="1260" alt="Image" src="https://github.com/user-attachments/assets/64b2c08b-a8ba-413c-b1bc-af80f980a5eb" />


## 📸 Reports
1️⃣ PDF
![Image](https://github.com/user-attachments/assets/cfd50acf-0590-490c-ada9-a8b059f90b1e)

2️⃣ Excel
![Image](https://github.com/user-attachments/assets/a297050d-80b4-4c26-a828-fd520889ca83)

## 👨‍💻 Author

<div align="center">

**Luis Orihuela** - *FullStack Developer*



🌐 **Portfolio:** [luisorihuela.me](https://luisorihuela.me)  
💼 **GitHub:** [@LuisOrihuela08](https://github.com/LuisOrihuela08)  

---

<sub>Made with ❤️ in Peru 🇵🇪 | © 2025</sub>

</div>
