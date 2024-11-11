// bad_code_review_exercise.js
// This code intentionally includes multiple bad coding practices for use in code review exercises.

/**
 * Yoni: Code Review - 
 * in General - i run this code and see some major async issues, not handeling errors, not using tools for save approching sources(try - catch).
 * 1. call for async func without await 
 * 2. try to approach source without a synch handelling and without error handeling
 * 3. there is no logs so we not will be able to trCK errors
 * 4. convantion - const are not in right place in the top of the page and the 
 * 5. handeling iterators over the users - there is better solution with working with lodash for objects and arrays.
 * 6. handelling const like dates / time or even users utils can be seperate for utils files
 * 7. tasks services can be handled in one place
 * 8. some varibles can be used as const exp ONE_DAY_MS = 86400000

 * 9. there is another "small" things like generic handeling the sources 
 *  
 */
const fs = require('fs');

// Mocked tracking service with a simple console log (to avoid dependency issues)
// Track services can be export from track service file
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
    // logging - 'Starting to create task'
    const timezone = getUserTimezone(user); 

    /**
     * // Error handeling with try {
     *... all functionality of feching
     and trying to update resuorces
    }
     catch(err) { logging (err)}
     */
    if (!taskDetails.timestamp) {
        taskDetails.timestamp = await fetchSchedule(taskDetails.description, timezone); 
    }

    //Track service
    track('TASK_CREATED', {
        taskName: taskDetails.description,
        user: user.name
    });

    // async await handeling by seprate this functionality to async bundle that hendeling db functionality
    fs.writeFile('tasks.txt', `Task: ${taskDetails.description} at ${taskDetails.timestamp}`, (err) => {
        if (err) {
            console.error('Failed to save task');
        } else {
            console.log('Task saved successfully');
        }
    });

    // logging - End creating task now call for callback
    callback();
};
// Yoni  - 1. bad async  handle, loop inside a loop when we are working here with dictinary - i would ttry to think of a better Data Structure handeling
const processUserRequests = (users) => {
    /** 
     * 1. i would be seperating this calls for steps
     * 2. first seperte main functionality to seperate async function that taking  user feching async his data and update async the DB
     * 3. all of this will be followed by looging steps - staring / end updating user tasks 
     * 4. using try and catch for handeling errors in every async call 
     * 5. every async call should be called with await key word
     */
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

// can be in util file
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
// same here using try catch and async functionality with the reponse including in 
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

// util file
const getUserTimezone = (user) => {
    if (user.timezone) {
        return user.timezone;
    }
    return 'UTC';
};

// util file
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


// Yoni : this code call for create task which is async funct need to use await call
const main = () => {
    // call for await createTask
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
