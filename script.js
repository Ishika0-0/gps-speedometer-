// Initialize variables
let startTime, previousPosition, totalDistance = 0;

// Check if the browser supports Geolocation API
if (navigator.geolocation) {
    // Watch the position and call successCallback on updates
    navigator.geolocation.watchPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,  // Use high accuracy for better precision
        timeout: 5000,             // Wait for up to 5 seconds to get the position
        maximumAge: 0              // Do not use cached positions
    });
} else {
    alert("Geolocation is not supported by this browser.");
}

// Function to handle successful location updates
function successCallback(position) {
    const currentTime = new Date();  // Current timestamp

    // Set the start time when the first position is retrieved
    if (!startTime) {
        startTime = currentTime;
    }

    // If there is a previous position, calculate speed and distance
    if (previousPosition) {
        const distance = calculateDistance(previousPosition.coords, position.coords);  // Distance in meters
        totalDistance += distance;  // Add distance to the total distance

        const timeDiff = (currentTime - previousPosition.timestamp) / 1000;  // Time difference in seconds
        const speed = (distance / timeDiff) * 3.6;  // Speed in km/h (convert from m/s)

        updateUI(speed, totalDistance, currentTime - startTime);  // Update UI with speed, distance, and time
    }

    previousPosition = position;  // Update the previous position with the current one
}

// Function to handle location errors
function errorCallback(error) {
    console.error("Error getting location: ", error);
}

// Function to calculate distance between two GPS coordinates using Haversine formula
function calculateDistance(prevCoords, currCoords) {
    const R = 6371e3;  // Earth's radius in meters
    const lat1 = prevCoords.latitude * (Math.PI / 180);  // Convert latitude to radians
    const lat2 = currCoords.latitude * (Math.PI / 180);  // Convert latitude to radians
    const deltaLat = (currCoords.latitude - prevCoords.latitude) * (Math.PI / 180);
    const deltaLon = (currCoords.longitude - prevCoords.longitude) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;  // Distance in meters
}

// Function to update the UI with speed, distance, and elapsed time
function updateUI(speed, distance, elapsedTime) {
    document.getElementById("speed").innerText = speed.toFixed(2) + " km/h";  // Update speed
    document.getElementById("distance").innerText = (distance / 1000).toFixed(2) + " km";  // Update distance in kilometers
    document.getElementById("time").innerText = formatTime(elapsedTime);  // Update elapsed time
}

// Function to format the time (milliseconds to MM:SS)
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}
