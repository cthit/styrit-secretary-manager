# Frontend
docker build --tag styrit-secretary-manager-frontend:latest -f ./frontend/prod.Dockerfile ./frontend
docker tag styrit-secretary-manager-frontend:latest viddem/styrit-secretary-manager-frontend:latest
docker push viddem/styrit-secretary-manager-frontend:latest

# Backend
docker build --tag styrit-secretary-manager-backend:latest -f ./backend/prod.Dockerfile ./backend
docker tag styrit-secretary-manager-backend:latest viddem/styrit-secretary-manager-backend:latest
docker push viddem/styrit-secretary-manager-backend:latest