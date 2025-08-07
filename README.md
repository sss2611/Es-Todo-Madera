Es-Todo-Madera-Bot/
├── server.js                      # Inicia Express, conecta MongoDB, monta rutas
├── .env                           # Variables de entorno (MongoDB, Facebook URL, etc.)
├── package.json                   # Dependencias y scripts
├── README.md                      # Documentación técnica del proyecto
│
├── backend/
│   ├── controllers/
│   │   └── scrapingController.js  # Lógica del endpoint /scraping
│   │
│   ├── jobs/
│   │   └── scrapingJobs.js        # Cron jobs para scraping automático
│   │
│   ├── routes/
│   │   └── scraping.js            # Define rutas /scraping, /logs, etc.
│   │
│   ├── utils/
│   │   ├── guardarPosts.js        # Guarda en MongoDB y JSON local, evita duplicados
│   │   └── parseador.js           # Extrae campos clave del texto (precio, título, etc.)
│   │
│   ├── database/
│   │   ├── connect.js             # Conexión a MongoDB Atlas
│   │   └── Posts.js               # Acceso directo a la colección de productos
│   │
│   └── models/
│       ├── Producto.js            # Esquema de producto scrapeado
│       └── Interaccion.js         # Esquema para registrar respuestas, clics, pagos, etc.
│
├── scraper/
│   ├── scrapeFacebook.js          # Puppeteer: scroll, extracción de posts
│   └── saveContent.js             # Ejecuta scraping + parseo + guardado (manual o por cron)
│
├── logs/
│   ├── scraping-YYYY-MM-DD.json   # Posts guardados exitosamente
│   └── errores-YYYY-MM-DD.json    # Posts que fallaron al parsear
│
└── docs/
    ├── arquitectura.md            # Diagrama y flujo de datos
    ├── api-rest.md                # Documentación de endpoints
    └── panel-visual.md            # Especificaciones del dashboard (si lo agregás)
