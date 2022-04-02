module.exports = {
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    // "ssl": process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    "ssl": { rejectUnauthorized: false },
    "entities": [process.env.SRC_FOLDER + "/Entities/*.ts"],
    "migrations": [process.env.SRC_FOLDER + "/database/migrations/*.ts"],    
    "cli": {
        "migrationsDir": "src/database/migrations",
        "entitiesDir": "src/Entities"
    }
}