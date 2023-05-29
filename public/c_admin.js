window.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the log data from the server
    fetch('/logData')
        .then(response => response.json())
        .then(data => {
            const logDataDiv = document.getElementById('logData');

            // Format and display the log data
            data.forEach(logEntry => {
                const div = document.createElement('div');
                div.className = 'log-entry';
                
                const nameElement = document.createElement('span');
                nameElement.innerHTML = `<span class="name">Name:</span> <span class="value">${logEntry.Name}</span>`;
                div.appendChild(nameElement);

                const roleElement = document.createElement('span');
                roleElement.innerHTML = `<span class="role">Role:</span> <span class="value">${logEntry.Role}</span>`;
                div.appendChild(roleElement);

                const actionElement = document.createElement('span');
                actionElement.innerHTML = `<span class="action">Action:</span> <span class="value">${logEntry.Action}</span>`;
                div.appendChild(actionElement);

                const timestampElement = document.createElement('span');
                const dateTime = logEntry.TimeStamp.replace('T', ' ').replace('Z', '');
                const dateObj = new Date(dateTime);
                dateObj.setHours(dateObj.getHours() + 2); // Convert to South African time (GMT+2)
                const formattedDateTime = dateObj.toLocaleString('en-ZA'); // Format date and time to South African locale
                timestampElement.innerHTML = `<span class="timestamp">Date and Time:</span> <span class="value">${formattedDateTime}</span>`;
                div.appendChild(timestampElement);

                logDataDiv.appendChild(div);
            });
        });
});
