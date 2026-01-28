#!/bin/bash

# Northwind Orders API Startup Script
echo "Starting Northwind Orders API..."

# Set database URL for SQLx (if needed for future migrations)
export DATABASE_URL="mysql://root:@localhost:3306/northwind"

# Check if database is accessible
echo "Checking database connection..."
mysql -h localhost -u root -e "USE northwind; SHOW TABLES;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Error: Cannot connect to MariaDB/MySQL database 'northwind'"
    echo "Please ensure:"
    echo "1. MariaDB/MySQL is running on localhost:3306"
    echo "2. Database 'northwind' exists"
    echo "3. User 'root' has access (or update Rocket.toml with correct credentials)"
    exit 1
fi

echo "✅ Database connection successful!"

# Build the project if needed
if [ ! -f "target/debug/api" ] || [ "src/main.rs" -nt "target/debug/api" ]; then
    echo "Building project..."
    cargo build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo "🚀 Starting Rocket server..."
echo "API will be available at: http://localhost:8000"
echo "Health check: http://localhost:8000/api/health"
echo "Orders API: http://localhost:8000/api/orders/"
echo ""
echo "Press Ctrl+C to stop the server"

# Run the application
cargo run
