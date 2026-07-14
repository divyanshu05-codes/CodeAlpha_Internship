require("dotenv").config();

const app = require("./src/app");
const connectToDatabase = require("./src/config/database");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);

        process.exit(1);
    }
};

startServer();