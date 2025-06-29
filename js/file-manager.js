/**
 * File Manager for handling file uploads and drag & drop
 */

class FileManager {
    constructor() {
        this.onFilesLoaded = null;
        this.onError = null;
        this.maxFileSize = 100 * 1024 * 1024; // 100MB
        this.maxFiles = 20; // Maximum number of files
        this.supportedFormats = ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg'];
        this.lastUploadTime = 0;
        this.uploadCooldown = 1000; // 1 second between uploads

        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.selectFilesBtn = document.getElementById('select-files-btn');
    }
    
    setupEventListeners() {
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Select files button
        this.selectFilesBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling to drop zone
            this.fileInput.click();
        });
        
        // Drop zone events
        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });
        
        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!this.dropZone.contains(e.relatedTarget)) {
                this.dropZone.classList.remove('drag-over');
            }
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Prevent default drag behaviors on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }
    
    handleFiles(fileList) {
        // Rate limiting check
        const now = Date.now();
        if (now - this.lastUploadTime < this.uploadCooldown) {
            this.showError('Please wait before uploading more files.');
            return;
        }
        this.lastUploadTime = now;

        const files = Array.from(fileList);

        // Check file count limit
        if (files.length > this.maxFiles) {
            this.showError(`Too many files. Maximum allowed: ${this.maxFiles}`);
            return;
        }

        const validFiles = [];
        const errors = [];
        
        // Validate each file
        files.forEach((file, index) => {
            const fileErrors = this.validateFile(file);
            if (fileErrors.length === 0) {
                validFiles.push({
                    file,
                    id: this.generateFileId(file, index),
                    name: this.cleanFileName(file.name)
                });
            } else {
                errors.push({
                    file: file.name,
                    errors: fileErrors
                });
            }
        });
        
        // Report errors
        if (errors.length > 0) {
            this.reportErrors(errors);
        }
        
        // Process valid files
        if (validFiles.length > 0) {
            if (this.onFilesLoaded) {
                this.onFilesLoaded(validFiles);
            }
            // Reset file input to allow selecting the same files again if needed
            this.fileInput.value = '';
        } else if (files.length > 0) {
            this.showError('No valid audio files were selected.');
        }
    }
    
    validateFile(file) {
        const errors = [];
        
        // Check if file exists
        if (!file) {
            errors.push('Invalid file');
            return errors;
        }
        
        // Check file type by extension
        const extension = Utils.getFileExtension(file.name);
        if (!this.supportedFormats.includes(extension)) {
            errors.push(`Unsupported format: ${extension.toUpperCase()}. Supported: ${this.supportedFormats.map(f => f.toUpperCase()).join(', ')}`);
        }

        // Additional MIME type validation for security
        if (file.type && !Utils.isValidAudioMimeType(file.type)) {
            errors.push(`Invalid MIME type: ${file.type}. Expected audio file.`);
        }
        
        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File too large: ${Utils.formatFileSize(file.size)}. Maximum: ${Utils.formatFileSize(this.maxFileSize)}`);
        }
        
        // Check if file is empty
        if (file.size === 0) {
            errors.push('File is empty');
        }
        
        return errors;
    }
    
    generateFileId(file, index) {
        // Create a unique ID based on file properties and timestamp
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `stem_${timestamp}_${index}_${random}`;
    }
    
    cleanFileName(fileName) {
        // First sanitize the file name for security
        const sanitized = Utils.sanitizeFileName(fileName);

        // Remove file extension and clean up the name
        const nameWithoutExt = sanitized.replace(/\.[^/.]+$/, '');

        // Replace common separators with spaces and clean up
        return nameWithoutExt
            .replace(/[_-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, l => l.toUpperCase()) || 'Untitled'; // Title case with fallback
    }
    
    reportErrors(errors) {
        const errorMessages = errors.map(error => {
            return `${error.file}: ${error.errors.join(', ')}`;
        });
        
        this.showError(`File validation errors:\n${errorMessages.join('\n')}`);
    }
    
    showError(message) {
        if (this.onError) {
            this.onError(message);
        } else {
            console.error('FileManager Error:', message);
            alert(message); // Fallback
        }
    }
    
    // Public methods
    reset() {
        this.fileInput.value = '';
        this.dropZone.classList.remove('drag-over');
    }
    
    setMaxFileSize(sizeInBytes) {
        this.maxFileSize = sizeInBytes;
    }
    
    setSupportedFormats(formats) {
        this.supportedFormats = formats.map(f => f.toLowerCase());
    }
    
    // Static utility methods
    static createFileFromBlob(blob, fileName) {
        return new File([blob], fileName, { type: blob.type });
    }
    
    static async readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
    
    static async readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
    
    static async readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    static downloadFile(blob, fileName) {
        const url = Utils.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        Utils.revokeObjectURL(url);
    }
    
    // File type detection
    static getAudioMimeType(fileName) {
        const extension = Utils.getFileExtension(fileName);
        const mimeTypes = {
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'flac': 'audio/flac',
            'm4a': 'audio/mp4',
            'aac': 'audio/aac',
            'ogg': 'audio/ogg',
            'webm': 'audio/webm'
        };
        return mimeTypes[extension] || 'audio/*';
    }
    
    // Batch processing
    async processFilesInBatches(files, batchSize = 5, processor) {
        const results = [];
        
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const batchPromises = batch.map(file => processor(file));
            
            try {
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            } catch (error) {
                Utils.logError(error, 'FileManager batch processing');
                throw error;
            }
        }
        
        return results;
    }
    
    // File organization
    static groupFilesByType(files) {
        const groups = {
            vocals: [],
            drums: [],
            bass: [],
            other: [],
            unknown: []
        };
        
        files.forEach(file => {
            const name = file.name.toLowerCase();
            
            if (name.includes('vocal') || name.includes('voice') || name.includes('lead')) {
                groups.vocals.push(file);
            } else if (name.includes('drum') || name.includes('kick') || name.includes('snare') || name.includes('hat')) {
                groups.drums.push(file);
            } else if (name.includes('bass') || name.includes('low')) {
                groups.bass.push(file);
            } else if (name.includes('other') || name.includes('instrument') || name.includes('music')) {
                groups.other.push(file);
            } else {
                groups.unknown.push(file);
            }
        });
        
        return groups;
    }
    
    static suggestStemType(fileName) {
        const name = fileName.toLowerCase();
        
        if (name.includes('vocal') || name.includes('voice') || name.includes('lead')) {
            return 'vocals';
        } else if (name.includes('drum') || name.includes('kick') || name.includes('snare') || name.includes('hat')) {
            return 'drums';
        } else if (name.includes('bass') || name.includes('low')) {
            return 'bass';
        } else if (name.includes('other') || name.includes('instrument') || name.includes('music')) {
            return 'other';
        }
        
        return 'unknown';
    }
}

// Make FileManager available globally
window.FileManager = FileManager;
