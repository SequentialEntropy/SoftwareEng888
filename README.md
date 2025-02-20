# cliMate
Our web application aims to promote sustainability through performing tasks around campus.

## Prerequisites
This section includes the software you will need to run our application. 

1. Open a terminal on your system.
2. Navigate to the root directory of the project: 
`cd /path/to/project`
3. Install the required dependencies:
`pip install -r requirements.txt`
4. Ensure Vite is installed locally:
`npm install vite --save-dev`

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
