import User from "../models/User.js";
import bcrypt from 'bcrypt';

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }

};

{/* export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, occupation, location, currentPassword, newPassword, confirmNewPassword } = req.body;

    console.log('updateUser request', { id, firstName, lastName, occupation, location, currentPassword, newPassword, confirmNewPassword }); // log the request data

    try {
        const user = await User.findById(id);

        // Check if the new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New passwords do not match.' });
        }

        // Check if the current password is correct
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // Hash the new password and update the user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, occupation, location, password: hashedPassword }, { new: true });

        res.json(updatedUser);
        console.log('updatedUser', updatedUser); // log the updated user data

    } catch (error) {
        console.error('updateUser error', error); // log any errors
        res.status(500).json({ message: error.message });
    }
};

*/}


export const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.status(200).json({ count: userCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, occupation, location } = req.body;

    console.log('updateUser request', { id, firstName, lastName, occupation, location }); // log the request data

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, occupation, location }, { new: true });
        res.json(updatedUser);
        console.log('updatedUser', updatedUser); // log the updated user data

    } catch (error) {
        console.error('updateUser error', error); // log any errors
        res.status(500).json({ message: error.message });
    }

};