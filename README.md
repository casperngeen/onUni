This project was created during my internship in OnSchool Edtech Group (in Hanoi). It is an education platform with features for test taking, and viewing attempt history.

To run the project:
1. Clone the project
2. Install docker (if you haven't)
3. Run:
- docker compose build
- docker compose up -d
- docker compose down (to shut down the virtual containers)

Remember to add a .env file in the root directory and below are the variables you should include for this project:
```
REDIS_PORT=xxxx
DB_PORT=xxxx
SERVER_PORT=xxxx
FRONTEND_PORT=xxxx
NGINX_PORT=xxxx
RABBIT_MQ_PORT = xxxx
RABBIT_MQ_UI_PORT=xxxx

REDIS_HOST=xxxx
DB_HOST=xxxx
SERVER_HOST=xxxx
FRONTEND_HOST=xxxx
NGINX_HOST=xxxx
RABBIT_MQ_HOST=xxxx

DB_USER=xxxx
DB_PASSWORD=xxxx
JWT_SECRET=xxxx
REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT}
NGINX_SERVER=http://${NGINX_HOST}:${NGINX_PORT}

FRONTEND_PORTAL=http://localhost:${FRONTEND_PORT}
NEXT_PUBLIC_API_ROUTE=http://localhost:${NGINX_PORT}

POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=xxxx

RABBITMQ_DEFAULT_USER=xxxx
RABBITMQ_DEFAULT_PASS=xxxx
RABBIT_MQ_URL=amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}

TZ="Asia/Bangkok"
```
