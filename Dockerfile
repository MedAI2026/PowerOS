FROM python:3.12-slim

WORKDIR /app

COPY app ./app

ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["python", "-m", "app.server"]
