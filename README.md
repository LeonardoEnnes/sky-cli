# sky-cli
Sky CLI is a powerful and versatile command-line interface designed for developers who need to streamline their workflow. It provides a comprehensive suite of tools for managing APIs, handling file operations, manipulating data, and using templates to simplify repetitive tasks. Whether you’re automating file operations, making API requests, or processing data, sky-cli has you covered!

### 🚀 Features
1. #### File Management
    - **File and Folder Listing:** Interactively list files and directories with filters for file type, size, or creation date.

    - **File Operations:** Move, copy, rename, and delete files or directories. An interactive mode confirms potentially destructive actions (like deletions).

    - **Advanced Search:** Search inside files using regular expressions or by metadata such as creation or modification date.
    
    - **File Comparison:** Compare the contents of two files, useful for developers needing to track changes between file versions.

2. #### API Interaction
    - **HTTP Requests:** Perform HTTP requests (GET, POST, PUT, DELETE) with support for custom headers, authentication, and JSON payloads.

    - **API Monitoring:** Periodically ping API endpoints to track status, response times, and potential errors.

    - **API Logs:** Store and view logs of previous API requests for debugging and analysis.
3. #### Data Manipulation
    - **Format Conversion:** Convert between data formats like JSON, XML, and CSV with options for filtering and transforming data.
    - **Filtering and Sorting:** Filter and sort JSON or CSV data directly from the CLI.
    - **Local Data Search:** Perform advanced searches within large data files (JSON, CSV) using keys, values, or regular expressions.
4. #### Template Creation
    - **Project Structure Generation:** Quickly generate project structures for popular frameworks or libraries with initial files (e.g., index.js, package.json).
    - **Custom Templates:** Create and store personalized templates to speed up project generation.
    - **Configurable Templates:** Customize templates during creation, such as including/excluding dependencies or configuring linters and test environments.

## How to use the API Interaction

- Requests: 
    ```
    node index.js request --url=YOUR-API --method=GET
    ```

- Monitoring
    ```
    node index.js monitor --url=YOUR-API --interval=10000
    ```

- Logs
    ```
    node index.js logs
    ```

## How to use the File Management

- Read Files in any directory: 

    ```
    node index.js read-file --file=logs/file.extension
    ```

- Write files in any directory:

    ```
    node index.js write-file --file=logs/file.txt --content="hello world"
    ```

- Delete files in any directory:

    ```
    node index.js delete-file --file=logs/file.txt
    ```