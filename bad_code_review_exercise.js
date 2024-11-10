// bad_code_review_exercise.js
// This code intentionally includes multiple bad coding practices for use in code review exercises.

const fs = require('fs');

// Mocked tracking service with a simple console log (to avoid dependency issues)
const track = (event, data) => {
    console.log(`Tracking event: ${event}`, data);
};

const MINIMUM_DELAY = 3600000; // 1 hour in milliseconds

// Mocked Dependency Functions (to avoid actual network requests for exercise purposes) 
const fetchSchedule = async (description, timezone) => {
    return `${new Date().toISOString()} in ${timezone}`;
};

const fetchUserData = (user, callback) => {
    // Mocked user data
    callback({ id: user.name, name: user.name });
};

const getUserTasks = (userId, callback) => {
    // Mocked tasks
    callback([{ description: 'Task 1', userId }, { description: 'Task 2', userId }]);
};

const saveTaskToDB = (task, callback) => {
    // Mocked save logic with delay
    setTimeout(() => callback(null), 500);
};

const createTask = async (taskDetails, user, callback) => {
    const timezone = getUserTimezone(user); 

    if (!taskDetails.timestamp) {
        taskDetails.timestamp = await fetchSchedule(taskDetails.description, timezone); 
    }

    track('TASK_CREATED', {
        taskName: taskDetails.description,
        user: user.name
    });

    fs.writeFile('tasks.txt', `Task: ${taskDetails.description} at ${taskDetails.timestamp}`, (err) => {
        if (err) {
            console.error('Failed to save task');
        } else {
            console.log('Task saved successfully');
        }
    });

    callback();
};

const processUserRequests = (users) => {
    users.forEach(user => {
        fetchUserData(user, (userData) => {
            getUserTasks(userData.id, (tasks) => {
                tasks.forEach(task => {
                    saveTaskToDB(task, (err) => {
                        if (err) {
                            console.error('Error saving task:', err);
                        } else {
                            console.log('Task saved for user:', user.name);
                        }
                    });
                });
            });
        });
    });
};

const calculateRecurrence = (delay) => {
    switch (delay) {
        case 86400000:
            return 'Daily';
        case 604800000: 
            return 'Weekly';
        case 2592000000: 
            return 'Monthly';
        default:
            return 'Custom';
    }
};

// Hardcoded HTTP request (Mocked OpenAI response for testing purposes)
const generateReminder = async (text, user) => {
    const prompt = `Remind me to ${text}`;
    
    // Mocked response (to avoid using actual OpenAI API key)
    const response = {
        data: JSON.stringify({
            message: `This is a mocked reminder for: ${text}`
        })
    };

    try {
        const result = JSON.parse(response.data); 
        console.log('Reminder generated:', result.message);
    } catch (err) {
        console.error('Failed to parse reminder:', err);
    }
};

const getUserTimezone = (user) => {
    if (user.timezone) {
        return user.timezone;
    }
    return 'UTC';
};

const getReminderMessage = (reminder) => {
    const date = reminder.date;
    const time = reminder.time;
    let message = '';

    if (date && time) {
        message = `Reminder set for ${date} at ${time}`;
    } else {
        message = 'Invalid reminder'; 
    }

    return message;
};

// Usage Example
const users = [
    { name: 'John', timezone: 'America/New_York' },
    { name: 'Jane', timezone: null } 
];

const main = () => {
    users.forEach(user => {
        createTask({ description: 'Buy Milk' }, user, () => {
            console.log(`Task created for user ${user.name}`);
        });
    });

    processUserRequests(users);

    generateReminder('call mom', users[0]);
};

main();

// Instructions to build and run the code:
// 1. Ensure Node.js is installed.
// 2. Create a new directory and navigate to it.
// 3. Run `npm init -y` to create a package.json file.
// 4. Install axios by running `npm install axios`.
// 5. Save this code in a file named `bad_code_review_exercise.js`.
// 6. Run the file using Node.js by executing `node bad_code_review_exercise.js`.
// 
// Expected output:
// - Several "Task saved successfully" and "Task created" logs.
// - Multiple reminders generated using the mocked OpenAI integration.
// - Logs of tasks being saved for each user.

module.exports = { createTask, processUserRequests, calculateRecurrence, generateReminder, getUserTimezone, getReminderMessage };
