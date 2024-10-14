const bcrypt = require('bcrypt');
const db = require('../db/index.js'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
// Function to register a user
exports.registerUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        
        if (!email || !username || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required details' });
        }

        const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
        const existingUser = await queryAsync(userCheckQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        // Insert new user
        const insertUserQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        await queryAsync(insertUserQuery, [username, email, hashedPassword, role]);

        // Return success response
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Convert db.query to return a promise
const queryAsync = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password,role } = req.body;
        // console.log('Email received for login:', email);
        // console.log('Password received for login:', password);

        const userCheckQuery = 'SELECT password,role FROM users WHERE email = ?';
        const result = await queryAsync(userCheckQuery, [email]);
        console.log(result);
        console.log("Entered password",password);
        const hashedPassword = await bcrypt.hash(password, 10); 
        console.log(hashedPassword);
        
        if (result && result.length > 0) {
            const existingUser = result[0];
            console.log(existingUser.role);
            console.log("actual password : ",existingUser.password);
            console.log(bcrypt.compare(password, existingUser.password));
            
            if (await bcrypt.compare(password, existingUser.password) && role == existingUser.role) {
                return res.status(201).json({ message: 'Login successful'});
            } else if(role != existingUser.role){
                return res.status(403).json({ message: 'Unauthorized login!' });
            }else{
                return res.status(409).json({ message: 'Invalid Password!' });
            }
        } else {
            return res.status(400).json({ message: 'User login failed! User not found.' });
        }
    } catch (err) {
        console.error('Error while logging in!', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
