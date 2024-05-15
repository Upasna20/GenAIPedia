document.getElementById('send-button').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const responseDiv = document.getElementById('response');
    
    responseDiv.textContent = 'Loading...';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        responseDiv.textContent = data.response;
    } catch (error) {
        responseDiv.textContent = 'Error: ' + error.message;
    }
});
