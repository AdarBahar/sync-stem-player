/**
 * Utility functions for the Stem Player
 */

// Time formatting utilities
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    return minutes * 60 + seconds;
}

// File utilities
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function isAudioFile(filename) {
    const audioExtensions = ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'webm'];
    return audioExtensions.includes(getFileExtension(filename));
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Color utilities
function generateStemColor(index) {
    const colors = [
        '#4CAF50', // Green - Vocals
        '#2196F3', // Blue - Drums
        '#FF9800', // Orange - Bass
        '#9C27B0', // Purple - Other
        '#F44336', // Red
        '#00BCD4', // Cyan
        '#FFEB3B', // Yellow
        '#795548'  // Brown
    ];
    return colors[index % colors.length];
}

// Instrument icon utilities
function getInstrumentIcon(stemType) {
    const icons = {
        'vocals': '🎤',
        'drums': '🥁',
        'bass': '🎸',
        'other': '🎸', // Guitar for "other" instruments
        'unknown': '🎵'
    };
    return icons[stemType] || icons['unknown'];
}

function getStemTypeFromFileName(fileName) {
    const name = fileName.toLowerCase();

    if (name.includes('vocal') || name.includes('voice') || name.includes('lead')) {
        return 'vocals';
    } else if (name.includes('drum') || name.includes('kick') || name.includes('snare') || name.includes('hat')) {
        return 'drums';
    } else if (name.includes('bass') || name.includes('low')) {
        return 'bass';
    } else if (name.includes('other') || name.includes('instrument') || name.includes('music') || name.includes('guitar')) {
        return 'other';
    }

    return 'unknown';
}

// Security utilities
function sanitizeText(text) {
    if (typeof text !== 'string') return '';

    // Remove potentially dangerous characters and limit length
    return text
        .replace(/[<>'"&]/g, '') // Remove HTML/script injection chars
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/data:/gi, '') // Remove data: protocol
        .substring(0, 255) // Limit length
        .trim();
}

function sanitizeFileName(fileName) {
    if (typeof fileName !== 'string') return 'untitled';

    // More restrictive sanitization for file names
    return fileName
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid file name chars
        .replace(/^\.+/, '') // Remove leading dots
        .substring(0, 100) // Reasonable file name length
        .trim() || 'untitled';
}

function isValidAudioMimeType(mimeType) {
    const validTypes = [
        'audio/mpeg', 'audio/mp3',
        'audio/wav', 'audio/wave',
        'audio/flac',
        'audio/mp4', 'audio/m4a',
        'audio/aac',
        'audio/ogg', 'audio/vorbis',
        'audio/webm'
    ];
    return validTypes.includes(mimeType.toLowerCase());
}

function hexToRgba(hex, alpha = 1) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 0, 0, ${alpha})`;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// DOM utilities
function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Event utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Audio utilities
function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        throw new Error('Web Audio API is not supported in this browser');
    }
    return new AudioContext();
}

function loadAudioBuffer(audioContext, arrayBuffer) {
    return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
            arrayBuffer,
            buffer => resolve(buffer),
            error => reject(error)
        );
    });
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return defaultValue;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
        return false;
    }
}

// Validation utilities
function validateAudioFile(file) {
    const errors = [];

    if (!file) {
        errors.push('No file provided');
        return errors;
    }

    if (!isAudioFile(file.name)) {
        errors.push('File must be an audio file (MP3, WAV, FLAC, M4A, AAC, OGG)');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    return errors;
}

// Browser compatibility utilities
function checkBrowserSupport() {
    const features = {
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
        dragDrop: 'draggable' in document.createElement('div'),
        localStorage: (() => {
            try {
                const test = 'test';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        })()
    };
    
    return features;
}

// Error handling utilities
function createError(message, type = 'Error', details = null) {
    const error = new Error(message);
    error.type = type;
    error.details = details;
    return error;
}

function logError(error, context = '') {
    console.error(`[Stem Player${context ? ` - ${context}` : ''}]:`, error);
}

// Performance utilities
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// URL utilities
function createObjectURL(blob) {
    return URL.createObjectURL(blob);
}

function revokeObjectURL(url) {
    URL.revokeObjectURL(url);
}

// Math utilities
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Array utilities
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function uniqueArray(array) {
    return [...new Set(array)];
}

// Create global Utils object
window.Utils = {
    formatTime,
    parseTime,
    getFileExtension,
    isAudioFile,
    formatFileSize,
    generateStemColor,
    hexToRgba,
    createElement,
    removeAllChildren,
    debounce,
    throttle,
    createAudioContext,
    loadAudioBuffer,
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,
    validateAudioFile,
    checkBrowserSupport,
    createError,
    logError,
    measurePerformance,
    createObjectURL,
    revokeObjectURL,
    clamp,
    lerp,
    mapRange,
    shuffleArray,
    uniqueArray,
    getInstrumentIcon,
    getStemTypeFromFileName,
    sanitizeText,
    sanitizeFileName,
    isValidAudioMimeType
};
