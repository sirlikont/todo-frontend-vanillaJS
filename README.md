# 🧩 Hajusrakendused — ToDo klientrakendus

See projekt on loodud **Tallinna Polütehnikumi hajusrakenduste kursuse** raames.  
Ülesande eesmärk on luua **vanilla JavaScriptis** lihtne ToDo rakendus,  
mis suhtleb olemasoleva **RESTful API-ga** kasutades autentimist ja andmete sünkroniseerimist serveriga.

Ülesande kirjeldus:  
👉 [https://github.com/timotr/harjutused/blob/main/hajusrakendused/yl-nimekiri-klient.md](https://github.com/timotr/harjutused/blob/main/hajusrakendused/yl-nimekiri-klient.md)

---

## 🎯 Eesmärk

Rakendus võimaldab:
- laadida serverist olemasolevad ülesanded (GET `/tasks`)
- lisada uusi ülesandeid (POST `/tasks`)
- kustutada ülesandeid (DELETE `/tasks/{id}`)
- märkida ülesanne tehtuks või muutmata kujul kuvada selle staatust

Kõik toimingud toimuvad kasutaja **autentimisel Bearer tokeniga**.  
Andmeid sünkroniseeritakse serveriga aadressil `http://demo2.z-bit.ee/`.

---

## 🧱 Kasutatud tehnoloogiad

- **HTML5** – struktuur
- **CSS (Ant Design + kohandused)** – kujundus
- **Vanilla JavaScript (ES6)** – loogika ja API suhtlus
- **Vite** – arenduskeskkond ja CORS-proxy

---

## ⚙️ Arenduskeskkonna seadistamine

1. Klooni projekt:
```bash
   git clone https://github.com/sirlikont/todo-frontend-vanillaJS.git
 ```
2. Liigu projekti kausta ja paigalda Vite:
```bash
   npm install
 ```
3. Käivita arendusserver:
 ```bash
   npm run dev
 ```
4. Ava brauseris

## 🧩 Failistruktuur:

```
📦 projekt
├── index.html        # Põhivaade (juurkaustas)
├── vite.config.js    # Vite seadistus (proxy CORS-i jaoks)
└── src/
    ├── main.js       # Rakenduse loogika ja API päringud
    └── style.css     # Kujundus
```

## 🚀 Proxy seadistus (CORS vältimiseks)

vite.config.js failis on seadistus:

import { defineConfig } from 'vite'
```
export default defineConfig({
  server: {
    proxy: {
      '/tasks': 'http://demo2.z-bit.ee'
    }
  }
})
```

See võimaldab teha API-päringuid ilma CORS-vigadeta,
kasutades lihtsalt teed /tasks otse JavaScriptis.

## 👩‍💻 Autor

Sirli Kont
Tallinna Polütehnikum
Kursus: Hajusrakendused (2025)
Õppejõud: Timo Triisa

## 🧠 Märkused

Rakendus on kirjutatud täiesti ilma raamistiketa (React, Vue, jms) — ainult puhas JS.

CORS on lahendatud Vite proxy abil.

Kood järgib REST API põhimõtteid ja toetab CRUD operatsioone.