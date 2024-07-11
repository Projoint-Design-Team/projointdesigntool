# ProJoint Project

Welcome to the ProJoint project repository. This project is designed to provide a web-based interface to build Qualtrics surveys for conjoint experiments, designed for compatibility with the projoint library, accessible at [ProJoint](https://projoint.abudhabi.nyu.edu/).

## Installation
Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Projoint-Design-Team/projointdesigntool.git
   ```

## Repository Structure

This repository is organized into several key directories:

- `backend/`: Contains all backend Django application code.
- `frontend/`: Frontend application code (details to be added).
- `docs/`: Documentation for the project.
- `nginx/`: Nginx server configuration (details to be added).
- `.github/workflows/`: CI/CD workflows using GitHub Actions.

## Backend

The backend directory contains the Django project code. It is responsible for handling all server-side logic, database interactions, and API services.

For more details, refer to the backend [README.md](backend/README.md).

## Documentation

Documentation related to the project is located in the `docs/` directory. This includes:

- `00_tutorial.md`: A tutorial to help new users get started.
- `01_settings.md`: Configuration settings and their explanations.
- `zz_citation.md`: Citation information.
- `index.md`: Overview of the documentation.

These documents are displayed on the website under Tutorials tab.

## GitHub Workflows

CI/CD pipelines are defined under `.github/workflows/`. The `docker-deploy.yml` file contains the workflow to build and deploy the application using Docker.

### Key Features:

- **Automatic Deployment**: Automatically deploys the latest version of the code to the production server upon commits to the main branch.
- **Github Secrets**: Pulls information from Github Action Secrets to secure the confidential information

## Frontend

Details about the frontend setup and technologies used will be added here.

## Nginx

The Nginx directory contains the configuration for the Nginx server, which acts as a reverse proxy for the ProJoint project. Nginx is configured to direct web traffic between the frontend and backend services efficiently.

### Configuration Overview:

- **SSL Configuration**: The server listens on port 443 for secure HTTPS traffic.
- **Proxy Settings**: Nginx routes requests to the appropriate upstream server based on the request path:
  - All requests to `/api` are proxied to the backend server.
  - All other requests are handled by the frontend server.

## Getting Started

To get started with this project, please follow the setup instructions in **Backend** and **Frontend** directory. Each section contains detailed instructions on how to set up and run the respective parts of the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
