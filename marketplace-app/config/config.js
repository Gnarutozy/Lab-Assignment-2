const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 7777,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/marketplace"
}

module.exports = config