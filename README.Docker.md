# LEAK Tracker

## Build the image

### Cloning the repository

```bash
git clone https://github.com/PhoenixR49/leak-tracker
```

### Build

Go to the LEAK Tracker folder (`cd leak-tracker`).

And run

```bash
docker build -t leak-tracker .
```

## Configuration

> See the [application environment variables](/README.md#configuration)

## Run the app

```bash
docker run --env=APP_NAME=LEAK Tracker -p 8080:8080 -d leak-tracker:latest
```

> You can now [open LEAK Tracker in your browser](http://localhost:8080)

### Current registries

- Docker Hub: [`leak-tracker`](https://hub.docker.com/r/phoenixr49/leak-tracker)
- GHCR: [`ghcr.io/PhoenixR49/leak-tracker`](https://github.com/PhoenixR49/leak-tracker/pkgs/container/leak-tracker)
