import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { useMood } from '../Context/MoodContext'; // Ensure the path is correct.
import PropTypes from 'prop-types';
const InferMoodComponent = () => {
    const { setMood } = useMood(); // If you only need to set mood, destructuring mood is unnecessary.

    useEffect(() => {
        const fetchMood = async () => {
            try {
                // Fetch the file first then create a FormData with it.
                const response = await fetch('./OpenBCI_GUI-v5-meditation.csv');
                const blob = await response.blob();
                const formData = new FormData();
                formData.append('eeg', new File([blob], 'OpenBCI_GUI-v5-meditation.csv', { type: 'text/csv' }));

                // Making the post request to the server with the file.
                const moodResponse = await axios.post('http://localhost:5001/infer-mood-brainwave', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Let Axios set it; you don't need to set this undefined.
                    },
                });

                // Check for mood result in the response.
                if (moodResponse.data && moodResponse.data.result) {
                    setMood(moodResponse.data.result);
                }
            } catch (error) {
                console.error('Error fetching mood:', error);
            }
        };

        fetchMood();
    }, []); // Dependency array is empty, meaning this effect runs once on component mount.

    return null; // Component does not render anything itself.
};

export default InferMoodComponent;
