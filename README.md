# Frontend
## Development Server
From the /frontend/ directory:

```docker-compose up```

Visit: http://localhost:5173


## Build for Production
From the /frontend/waggo/ directory:

```docker run --rm -it -v ${PWD}:/app -w /app node:20-alpine sh -c "npm run build"```

This creates the output in `/frontend/waggo/dist/`. Upload the contents of the dist/ directory to the /waggo directory on web server.
