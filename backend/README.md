# Projoint Django Project

Projoint is a Django-based project that provides a robust platform for managing projects and collaborations, with a focus on surveys and document management.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Directory Structure](#directory-structure)
- [Update Requirements](#update-requirements)
- [Running the Development Server](#running-the-development-server)
- [API Documentation](#api-documentation)
- [Testing APIs](#testing-apis)
- [Qualtrics Clean Up](#qualtrics-clean-up)
- [Environment Setup](#environment-setup)

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- Python (>=3.6)
- Pip (package installer for Python)

## Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment (for Linux/macOS):
   ```bash
   source venv/bin/activate
   ```

4. Install project dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Apply database migrations:
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

## Directory Structure
- **`documents/`** - Contains models, views, serializers for managing document-related operations.
- **`projoint/`** - Core Django project folder including settings, urls, and WSGI/ASGI modules.
- **`surveys/`** - Handles survey-related models, views, serializers, and URL configurations.
- **`Dockerfile`** - Docker configuration for setting up the Django application.
- **`entrypoint.sh`** - Script to initialize the Docker container.
- **`manage.py`** - A command-line utility that lets you interact with this Django project.
- **`requirements.txt`** - List of modules needed for the project to run.

## Update Requirements
Update the `requirements.txt` file if you've added new dependencies:
```bash
pip freeze > requirements.txt
```

## Running the Development Server
To start the server:
```bash
python3 manage.py runserver
```

## API Documentation
Access Swagger UI documentation at:
```
http://127.0.0.1:8000/api/swagger-ui/
```

## Testing APIs
Run tests for specific modules like this:
```bash
python3 manage.py test surveys
```

## Qualtrics Clean Up
Clean up the surveys from the Qualtrics account by running
```bash
python3 delete_surveys_from_qualtrics.py
```

## Environment Setup
Set up necessary environment variables in your `.env` file:
- `QUALTRICS_API_KEY`: Key for accessing Qualtrics services.
