# sky-cli
Sky CLI is a powerful and versatile command-line interface designed for developers who need to streamline their workflow. It provides a comprehensive suite of tools for managing APIs, handling file operations, manipulating data, and using templates to simplify repetitive tasks. Whether you’re automating file operations, making API requests, or processing data, sky-cli has you covered!

## Table of Contents
1. [Features](#-features)
    - [File Management](#file-management)
    - [API Interaction](#api-interaction)
    - [Data Manipulation](#data-manipulation)
    - [Template Creation](#template-creation)
2. [How to Install the CLI](#how-to-install-the-cli)
3. [How to Use the CLI](#how-to-use-the-cli)
4. [How to Use the convert-format Command](#how-to-use-the-convert-format-command)
5. [How to Use the search Command](#how-to-use-the-search-command)


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

## How to install the CLI
**Step 1:** Clone this repository
```
git clone https://github.com/LeonardoEnnes/sky-cli.git
```

**Step 2:** Install the dependencies
```
npm install
```
## How to use the CLI

**Step 1:** Go to the repository folder, open the terminal, and navigate to the src folder.
```
cd src
```

**Step 2:** Write this command to start the CLI:
```
node index.js
```

**Step 2:** Select a command from the list. You will be prompted with an autocomplete list of commands. Start typing the command you want to execute and select it from the list. The available commands are:
- request
- monitor
- logs
- read-file
- write-file
- delete-file
- list-files
- compare-files
- search
- convert-format

**Step 3:** After selecting a command, you will be prompted to enter the required parameters for that command. For example:
- For read-file, you will need to provide the path to the --file.

## How to use the convert-format command
The convert-format command is used to convert the format of a file. You can convert the format of a file from json to xml, csv, or vice versa. You can also filter and transform the data.

- Select the convert-format command from the autocomplete list.
```
   ? What do you want to do? convert-format
``` 

- Provide Parameters:
```
? Enter the input file path: ./input.json
? Enter the output file path: ./output.xml
? Enter the input format: json
? Enter the output format: xml
? Enter the filter: "key=value"
? Enter the transform: "key=toUpperCase"
```

 ## How to use the search command
 The search command is used to search for words in files in a directory that match a specific regex pattern. You can also filter the search by creation and modification date.

- Select the search command from the autocomplete list.
```
   ? What do you want to do? search
``` 

- Provide Parameters:
```
? Enter the directory path: ./
? Enter the regex pattern: "example"
? Enter the creation date before: 2024-01-01
? Enter the creation date after: 2024-01-31
? Enter the modification date before: 2024-01-01
? Enter the modification date after: 2024-01-31
```

- View the results:
```
   Results:
   - ./file1.txt
   - ./file2.txt
   - ./file3.txt
``` 

----