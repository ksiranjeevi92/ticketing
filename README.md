kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sign

In the upcoming lecture, we will be adding the --only=prod flag to the npm install instruction of our Dockerfile. This flag no longer exists, and we need to use the --omit=dev flag instead.
