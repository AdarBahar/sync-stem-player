/**
 * Keyboard Controller for handling keyboard shortcuts
 */

class KeyboardController {
    constructor() {
        this.shortcuts = new Map();
        this.isEnabled = true;
        this.focusedElement = null;
        
        this.setupDefaultShortcuts();
        this.setupEventListeners();
    }
    
    setupDefaultShortcuts() {
        // Playback controls
        this.addShortcut('Space', 'Play/Pause', () => {
            this.dispatchEvent('keyboard-play-pause');
        });
        
        this.addShortcut('KeyR', 'Stop/Reset', () => {
            this.dispatchEvent('keyboard-stop');
        });
        
        // Seeking
        this.addShortcut('ArrowLeft', 'Seek backward 5s', () => {
            this.dispatchEvent('keyboard-seek', { direction: -5 });
        });
        
        this.addShortcut('ArrowRight', 'Seek forward 5s', () => {
            this.dispatchEvent('keyboard-seek', { direction: 5 });
        });
        
        // Volume presets (1-9 keys)
        for (let i = 1; i <= 9; i++) {
            this.addShortcut(`Digit${i}`, `Set volume to ${i * 10}%`, () => {
                this.dispatchEvent('keyboard-volume-preset', { volume: i * 10 });
            });
        }
        
        // Stem controls (require focused stem)
        this.addShortcut('KeyM', 'Mute focused stem', () => {
            this.dispatchEvent('keyboard-mute-focused');
        });
        
        this.addShortcut('KeyS', 'Solo focused stem', () => {
            this.dispatchEvent('keyboard-solo-focused');
        });
        
        // UI controls
        this.addShortcut('KeyF', 'Toggle fullscreen', () => {
            this.dispatchEvent('keyboard-fullscreen');
        });
        
        this.addShortcut('KeyH', 'Show/hide help', () => {
            this.dispatchEvent('keyboard-help');
        });
        
        this.addShortcut('KeyT', 'Toggle theme', () => {
            this.dispatchEvent('keyboard-theme');
        });
        
        // View controls
        this.addShortcut('KeyC', 'Compact view', () => {
            this.dispatchEvent('keyboard-view', { mode: 'compact' });
        });
        
        this.addShortcut('KeyE', 'Expanded view', () => {
            this.dispatchEvent('keyboard-view', { mode: 'expanded' });
        });
        
        // Master volume
        this.addShortcut('Equal', 'Increase master volume', () => {
            this.dispatchEvent('keyboard-master-volume', { direction: 1 });
        });
        
        this.addShortcut('Minus', 'Decrease master volume', () => {
            this.dispatchEvent('keyboard-master-volume', { direction: -1 });
        });
        
        // Escape key
        this.addShortcut('Escape', 'Close modals/Cancel', () => {
            this.dispatchEvent('keyboard-escape');
        });
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // Track focus changes
        document.addEventListener('focusin', (e) => {
            this.focusedElement = e.target;
        });
        
        document.addEventListener('focusout', () => {
            this.focusedElement = null;
        });
    }
    
    handleKeyDown(e) {
        if (!this.isEnabled) return;
        
        // Don't handle shortcuts when typing in inputs
        if (this.isTypingContext(e.target)) return;
        
        // Don't handle shortcuts when modals are open (except Escape)
        if (this.isModalOpen() && e.code !== 'Escape') return;
        
        const shortcut = this.shortcuts.get(e.code);
        if (shortcut) {
            // Check for modifier keys
            const hasModifiers = e.ctrlKey || e.altKey || e.metaKey;
            
            // Some shortcuts should work with modifiers, others shouldn't
            if (this.shouldIgnoreModifiers(e.code) && hasModifiers) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            try {
                shortcut.handler();
            } catch (error) {
                Utils.logError(error, 'KeyboardController shortcut execution');
            }
        }
    }
    
    handleKeyUp(e) {
        // Handle any key-up specific logic here
    }
    
    isTypingContext(element) {
        if (!element) return false;
        
        const tagName = element.tagName.toLowerCase();
        const inputTypes = ['input', 'textarea', 'select'];
        
        // Check if it's an input element
        if (inputTypes.includes(tagName)) {
            return true;
        }
        
        // Check if it's contenteditable
        if (element.contentEditable === 'true') {
            return true;
        }
        
        // Check if parent is contenteditable
        let parent = element.parentElement;
        while (parent) {
            if (parent.contentEditable === 'true') {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    isModalOpen() {
        const modals = document.querySelectorAll('.modal');
        return Array.from(modals).some(modal => {
            const style = window.getComputedStyle(modal);
            return style.display !== 'none';
        });
    }
    
    shouldIgnoreModifiers(code) {
        // These shortcuts should work without modifiers
        const noModifierKeys = [
            'Space', 'KeyR', 'ArrowLeft', 'ArrowRight',
            'KeyM', 'KeyS', 'KeyF', 'KeyH', 'KeyT',
            'KeyC', 'KeyE', 'Equal', 'Minus', 'Escape'
        ];
        
        // Number keys for volume presets
        for (let i = 1; i <= 9; i++) {
            noModifierKeys.push(`Digit${i}`);
        }
        
        return noModifierKeys.includes(code);
    }
    
    addShortcut(key, description, handler) {
        this.shortcuts.set(key, {
            key,
            description,
            handler
        });
    }
    
    removeShortcut(key) {
        this.shortcuts.delete(key);
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
    }
    
    getShortcuts() {
        return Array.from(this.shortcuts.values());
    }
    
    getShortcutByKey(key) {
        return this.shortcuts.get(key);
    }
    
    // Helper method to get human-readable key names
    static getKeyDisplayName(code) {
        const keyNames = {
            'Space': 'Space',
            'KeyR': 'R',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'KeyM': 'M',
            'KeyS': 'S',
            'KeyF': 'F',
            'KeyH': 'H',
            'KeyT': 'T',
            'KeyC': 'C',
            'KeyE': 'E',
            'Equal': '+',
            'Minus': '-',
            'Escape': 'Esc',
            'Digit1': '1',
            'Digit2': '2',
            'Digit3': '3',
            'Digit4': '4',
            'Digit5': '5',
            'Digit6': '6',
            'Digit7': '7',
            'Digit8': '8',
            'Digit9': '9'
        };
        
        return keyNames[code] || code;
    }
    
    // Method to show current shortcuts (for help display)
    getShortcutsForDisplay() {
        return Array.from(this.shortcuts.values()).map(shortcut => ({
            key: KeyboardController.getKeyDisplayName(shortcut.key),
            description: shortcut.description
        }));
    }
    
    // Context-aware shortcuts
    setContext(context) {
        this.currentContext = context;
        
        // Enable/disable certain shortcuts based on context
        switch (context) {
            case 'upload':
                this.disable();
                break;
            case 'player':
                this.enable();
                break;
            case 'modal':
                // Only allow escape and basic navigation
                break;
            default:
                this.enable();
        }
    }
    
    // Batch shortcut management
    addShortcuts(shortcuts) {
        shortcuts.forEach(({ key, description, handler }) => {
            this.addShortcut(key, description, handler);
        });
    }
    
    removeShortcuts(keys) {
        keys.forEach(key => {
            this.removeShortcut(key);
        });
    }
    
    // Shortcut conflict detection
    hasConflict(key) {
        return this.shortcuts.has(key);
    }
    
    getConflicts(newShortcuts) {
        const conflicts = [];
        newShortcuts.forEach(({ key }) => {
            if (this.hasConflict(key)) {
                conflicts.push(key);
            }
        });
        return conflicts;
    }
    
    // Debug methods
    logShortcuts() {
        console.log('Registered keyboard shortcuts:');
        this.shortcuts.forEach((shortcut, key) => {
            console.log(`${key}: ${shortcut.description}`);
        });
    }
    
    testShortcut(key) {
        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            console.log(`Testing shortcut: ${key} - ${shortcut.description}`);
            shortcut.handler();
        } else {
            console.log(`No shortcut found for key: ${key}`);
        }
    }
}

// Make KeyboardController available globally
window.KeyboardController = KeyboardController;
