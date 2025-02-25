# cliMate
Our web application aims to promote sustainability through performing tasks around campus.

# Prerequisites
This section includes the software you will need to run our application. 

## Starting Django Server

This section guides you through setting up and running the Django backend server.

1. Open a terminal on your system.
2. Navigate to the project directory:
   ```
   cd /path/to/project/SoftwareEng888
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Navigate to the backend directory:
   ```
   cd backend
   ```
5. Apply database migrations:
   ```
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```
6. Start the backend server:
   ```
   python3 manage.py runserver
   ```
   **Note:** Do not navigate to `http://127.0.0.0:8000/`.

## Starting React Server

This section guides you through setting up and running the React frontend server.

1. Open a new terminal window without closing the existing one.
2. Navigate back to the project directory:
   ```sh
   cd /path/to/project/SoftwareEng888
   ```
3. Navigate to the application directory:
   ```sh
   cd application
   ```
4. Install the required frontend dependencies:
   ```sh
   npm install
   ```
5. Start the frontend development server:
   ```sh
   npm run dev
   ```
6. Open a browser and go to:
   ```
   http://localhost:5173
   ```
   **Note:** Do not navigate to `http://127.0.0.0:8000/`.

## How to play 
Users can register to the game using their email address and creating a username and password. After this they will then navigate to their dashboard.
1. Spin wheel
2. Complete task at specified location
3. Scan QR code to verify completion
4. Collect points
5. See your progress on the leaderboard

## Structure
The project is structured as follows:

Frontend: Built using Vite and React, responsible for the user interface and interactions.

Backend: Developed with Python (Django) to handle authentication, task verification, and leaderboard updates.

Database: Stores user data, completed tasks, and leaderboard rankings.

QR Code System: Used to verify task completion by scanning codes at designated locations.

This modular approach ensures scalability and ease of maintenance.

## Testing
To run the tests, this project has implemented the use of GitHub actions to automate the tests.

The section below guides you through the manual testing for Django functionalities via Python:
1. If you currently are at the root directory (SoftwareEng888), use the following command to navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install the required dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Apply database migrations:
   ```sh
   python3 manage.py migrate
   ```
4. Run the tests:
   ```sh
   python3 manage.py test accounts
   ```

The `tests.py` file under `backend/accounts` tests the following:
1. Login functionality: correct login template, login success, login failure
2. Password reset functionality: correct password reset template, password reset success, password reset failure
3. Signup functionality: correct signup template, signup success, signup failure