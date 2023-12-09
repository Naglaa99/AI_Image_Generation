const api = "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";
const images = document.querySelector('.images');
const input = document.getElementById('input');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

const getImages = async () => {
    loading.style.display = 'block';
    error.style.display = 'none';

    try {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api}`
            },
            body: JSON.stringify({
                "prompt": input.value,
                "n": 3,
                "size": "256x256"
            })
        };

        const res = await fetch("https://api.openai.com/v1/images/generations", fetchOptions);

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        const listImages = data.data;

        images.textContent = '';

        listImages.forEach(photo => {
            const container = document.createElement('div');
            images.append(container);
            const img = document.createElement('img');
            container.append(img);
            img.src = photo.url;
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: `Something went wrong while generating images. Error: ${err.message}`,
        });
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
};

// Function to handle speech input
const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        getImages();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
    };

    recognition.start();
};

document.getElementById('speechButton').addEventListener('click', handleSpeechInput);
