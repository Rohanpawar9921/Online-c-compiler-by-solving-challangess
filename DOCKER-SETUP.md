# Docker Configuration for Coding Challenge Platform

This document explains how to run the Coding Challenge Platform using Docker, which can be useful for local development and alternative deployment options.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Container Structure

The application consists of several Docker containers:

1. **Backend Container**: Node.js server running the API
2. **Code Compiler Container**: Specialized container for executing code securely
3. **Frontend Container**: Nginx serving the React application (optional for local development)

## Running with Docker Compose

To start all containers:

```bash
docker-compose up
```

To rebuild containers after making changes:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d
```

To stop all containers:

```bash
docker-compose down
```

## Container Details

### Backend Container

- Built from `./backend/Dockerfile`
- Exposes port 5000
- Environment variables configured in `docker-compose.yml`
- Mounts Docker socket for code execution

### Code Compiler Container

- Built from `./docker/Dockerfile`
- Secure container for executing user code
- Limited resources and permissions for security
- No exposed ports (backend communicates with it directly)

### Frontend Container (Optional)

- Built from `./frontend/Dockerfile`
- Nginx server for serving the React application
- Exposes port 3000

## Environment Variables

You can configure the following environment variables in `docker-compose.yml`:

- `NODE_ENV`: Application environment (development/production)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Backend server port
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Using Docker for Production

While the primary deployment method uses Render.com and Netlify, you can also deploy using Docker:

1. Make sure your MongoDB connection string is set correctly
2. Update CORS settings to allow your domain
3. Deploy using Docker Compose or Kubernetes

## Security Considerations

- The code compiler container runs with restricted privileges
- Resource limits prevent excessive resource usage
- The compiler container is read-only with temporary filesystem for executions
- No network access from the compiler container

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify environment variables
3. Ensure Docker socket is accessible
4. Check network connectivity between containers
