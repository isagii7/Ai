<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 StudyAI - Upload & Ask (Heroku Style)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 28px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            overflow: hidden;
            animation: slideUp 0.5s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 32px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .header p {
            opacity: 0.85;
            font-size: 14px;
        }
        
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 12px;
        }
        
        .content {
            padding: 32px;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        label {
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
            color: #1e293b;
            font-size: 14px;
        }
        
        textarea {
            width: 100%;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 14px;
            font-size: 15px;
            font-family: inherit;
            resize: vertical;
            transition: all 0.2s;
        }
        
        textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
        
        .upload-zone {
            border: 2px dashed #cbd5e1;
            border-radius: 20px;
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .upload-zone:hover {
            border-color: #667eea;
            background: #eff6ff;
            transform: scale(1.01);
        }
        
        .upload-zone.dragover {
            border-color: #667eea;
            background: #e0e7ff;
        }
        
        #fileInput {
            display: none;
        }
        
        .preview-area {
            margin-top: 16px;
            text-align: center;
        }
        
        .preview-image {
            max-width: 100%;
            max-height: 200px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .file-info {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
        }
        
        button {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s;
            margin-top: 16px;
        }
        
        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102,126,234,0.3);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .response-card {
            margin-top: 28px;
            background: #f1f5f9;
            border-radius: 20px;
            padding: 20px;
            display: none;
        }
        
        .response-card.show {
            display: block;
            animation: fadeIn 0.4s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .response-header {
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .response-text {
            background: white;
            padding: 20px;
            border-radius: 16px;
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 15px;
            color: #1e293b;
        }
        
        .metadata {
            margin-top: 12px;
            font-size: 11px;
            color: #64748b;
            text-align: right;
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid white;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .footer {
            background: #f8fafc;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>
            📚 Study Assistant
        </h1>
        <p>Upload picture + Ask anything • AI answers instantly</p>
        <div class="badge">⚡ Powered by Klyphic API (Claude Opus 4.7)</div>
    </div>
    
    <div class="content">
        <div class="form-group">
            <label>✏️ Your Question *</label>
            <textarea id="question" rows="3" placeholder="Example: Explain this diagram... Solve this math problem... What's in this image?..."></textarea>
        </div>
        
        <div class="upload-zone" id="uploadZone">
            📸 <strong>Click or drag & drop to upload picture</strong><br>
            <small>JPG, PNG, GIF (Max 10MB) - Optional</small>
            <input type="file" id="fileInput" accept="image/jpeg,image/png,image/gif,image/webp">
        </div>
        
        <div id="previewArea" class="preview-area"></div>
        
        <button id="askButton">
            🚀 Ask AI
        </button>
        
        <div id="responseCard" class="response-card">
            <div class="response-header">
                🤖 AI Response:
            </div>
            <div id="responseText" class="response-text"></div>
            <div id="metadata" class="metadata"></div>
        </div>
    </div>
    
    <div class="footer">
        Fast • Heroku-style hosting • Real-time API calls
    </div>
</div>

<script>
    const API_ENDPOINT = '/api/ask';
    let selectedFile = null;
    
    const questionEl = document.getElementById('question');
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const previewArea = document.getElementById('previewArea');
    const askButton = document.getElementById('askButton');
    const responseCard = document.getElementById('responseCard');
    const responseText = document.getElementById('responseText');
    const metadataEl = document.getElementById('metadata');
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            alert('Please drop an image file');
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    });
    
    function handleFile(file) {
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large! Max 10MB');
            return;
        }
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
            previewArea.innerHTML = `
                <img src="${ev.target.result}" class="preview-image" alt="Preview">
                <div class="file-info">📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
            `;
        };
        reader.readAsDataURL(file);
    }
    
    async function askAI() {
        const question = questionEl.value.trim();
        
        if (!question) {
            alert('Please type your question');
            return;
        }
        
        // Disable button and show loading
        askButton.disabled = true;
        askButton.innerHTML = '<span class="spinner"></span> Getting answer from AI...';
        responseCard.classList.remove('show');
        
        const formData = new FormData();
        formData.append('question', question);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                responseText.textContent = data.answer;
                if (data.metadata.imageReceived) {
                    metadataEl.textContent = `📷 Image: ${data.metadata.imageName} • 🤖 Model: ${data.metadata.model} • 🔤 Tokens: ${data.metadata.tokens_used || 'N/A'}`;
                } else {
                    metadataEl.textContent = `🤖 Model: ${data.metadata.model} • 🔤 Tokens: ${data.metadata.tokens_used || 'N/A'}`;
                }
                responseCard.classList.add('show');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error:', error);
            responseText.textContent = `❌ Error: ${error.message}\n\nPlease check if the server is running.`;
            metadataEl.textContent = '';
            responseCard.classList.add('show');
        } finally {
            askButton.disabled = false;
            askButton.innerHTML = '🚀 Ask AI';
        }
    }
    
    askButton.addEventListener('click', askAI);
    
    // Enter to submit (Ctrl+Enter)
    questionEl.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            askAI();
        }
    });
</script>
</body>
</html>
