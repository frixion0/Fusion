document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const promptInput = document.getElementById('prompt');
    const imageCount = document.getElementById('imageCount');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    async function downloadImage(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image');
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Image URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy URL');
        });
    }

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        generateBtn.disabled = true;
        loadingDiv.style.display = 'flex';
        resultsDiv.innerHTML = '';
        
        try {
            const response = await fetch('https://beta.sree.shop/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ddc-beta-x9i7rvclsa-SRCASdNny4LQZSqysXWXBAjXOVHFmbcY6Jq'
                },
                body: JSON.stringify({
                    model: "Provider-5/flux-pro",
                    prompt: prompt,
                    n: parseInt(imageCount.value),
                    size: "512x512"
                })
            });

            const data = await response.json();
            
            if (data.data) {
                data.data.forEach((image, index) => {
                    const card = document.createElement('div');
                    card.className = 'image-card';
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';
                    
                    const img = document.createElement('img');
                    img.src = image.url;
                    img.alt = prompt;
                    
                    const actions = document.createElement('div');
                    actions.className = 'image-actions';
                    
                    const downloadBtn = document.createElement('button');
                    downloadBtn.className = 'action-button';
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
                    downloadBtn.title = 'Download Image';
                    downloadBtn.onclick = () => downloadImage(image.url, `ai-image-${index + 1}.png`);
                    
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'action-button';
                    copyBtn.innerHTML = '<i class="fas fa-link"></i>';
                    copyBtn.title = 'Copy Image URL';
                    copyBtn.onclick = () => copyToClipboard(image.url);
                    
                    imageContainer.appendChild(img);
                    actions.appendChild(downloadBtn);
                    actions.appendChild(copyBtn);
                    card.appendChild(imageContainer);
                    card.appendChild(actions);
                    resultsDiv.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating images');
        } finally {
            loadingDiv.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});

