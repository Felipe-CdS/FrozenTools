module.exports = {
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    "entities": [process.env.SRC_FOLDER + "/Entities/*.ts"],
    "migrations": [process.env.SRC_FOLDER + "/database/migrations/*.ts"],    
    "cli": {
        "migrationsDir": "src/database/migrations",
        "entitiesDir": "src/Entities"
    }
}