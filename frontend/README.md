# Frontend Documentation for ProJoint Project

Welcome to the frontend documentation of the ProJoint project. This guide provides an overview of the frontend architecture, setup instructions, and conventions used within the project to ensure maintainability and scalability.

## Table of Contents

- [Frontend Documentation for ProJoint Project](#frontend-documentation-for-projoint-project)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Directory Structure](#directory-structure)
  - [Managing Text Elements](#managing-text-elements)
    - [Example JSON Structure](#example-json-structure)
    - [Modifications](#modifications)
  - [State Management Transition](#state-management-transition)
  - [Running the Development Server](#running-the-development-server)
  - [Further Reading](#further-reading)

## Getting Started

To set up the frontend on your local machine:

1. **Clone the repository** and navigate to the frontend directory:

   ```bash
   git clone https://github.com/Projoint-Design-Team/projointdesigntool.git
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   Access the application at `http://localhost:3000`.

## Directory Structure

- **`components/`**: Reusable UI components organized using the BEMG (Block, Element, Modifier, Group) methodology. This approach ensures a modular and scalable CSS architecture.
  - **Block**: Represents a standalone component that makes sense on its own.
  - **Element**: A part of a block that has no standalone meaning and is semantically tied to its block. `__` is used to separate the block and element.
  - **Modifier**: Defines the appearance, state, or behavior of a block or element. `--` is used to separate the block and modifier.
  - **Group**: An additional layer used to group together elements or blocks for complex constructions. `__` is used to separate the block and group.
- **`pages/`**: React components that correspond to a webpage.
- **`styles/`**: CSS and Emotion styles for styling components.
- **`services/`**: Services and utilities, including API interaction logic.
- **`context/`**: React contexts for global state management.
- **`naming/`**: Contains `english.json` for managing static text elements across the application.

## Managing Text Elements

Text elements across the frontend are managed through a structured JSON file to facilitate easy localization and customization:

- **File Location**: `naming/english.json`
- **Purpose**: Allows for the centralized management of all user-facing text, enabling quick updates and localization.
- **Usage**: Text values are fetched dynamically from this JSON, keyed by their identifiers.

### Example JSON Structure

```json
"surveyPage": {
    "description": {
      "value": "Enter your description here! Example: 'Here are two profiles A and B.'"
    },
    ...
}
```

### Modifications

To update text content, modify the `value` fields in the `english.json` file. Avoid altering the key structure to prevent potential issues with text retrieval in the application.

## State Management Transition

The project initially utilized React's useContext for state management but has been transitioning to Zustand for its simplicity and efficiency, particularly for local state and storage management. This transition aims to enhance the application's performance and maintainability but is not yet complete. Future developments will complete this migration and refine the state management strategy to leverage Zustand's full capabilities.

## Running the Development Server

To start the development environment and test changes locally:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application in action.
You will also need to start the backend server to be able to use the application. Create a `.env.local` file in the root directory and add the following:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Further Reading

For more detailed information on specific components or services, please refer to the inline documentation and comments within each file. Developers are encouraged to familiarize themselves with the project structure and contribute to the documentation as the project evolves.
