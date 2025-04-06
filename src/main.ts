import './style.css'
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete"
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search"
import { lintKeymap } from "@codemirror/lint"
import { indentUnit } from '@codemirror/language';

const editorContainer = document.getElementById('editor-container');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

// --- Animation State ---
let inputCode = `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");`; // Example code
let animationIndex = 0;
let isAnimating = false;
let timeoutId: number | null = null;
const BASE_DELAY = 80; // ms
const RANDOM_DELAY_RANGE = 80; // ms - Defines the range for random delay variation
const NEWLINE_PAUSE = 350; // ms - Extra pause for newlines
const PUNCTUATION_PAUSE = 120; // ms - Extra pause for punctuation/whitespace
const PAUSE_CHARS = ".;{}() "; // Characters triggering the punctuation pause

// --- Typo Simulation Constants ---
const TYPO_CHANCE = 0.03; // 3% chance of a typo per character
const TYPO_CHAR = 'X'; // Character to insert for a typo
const TYPO_REALIZATION_DELAY = 180; // ms delay before noticing typo
const TYPO_CORRECTION_DELAY = 120; // ms delay before correcting typo

// --- CodeMirror View ---
let view: EditorView; // Declare view in a higher scope

if (editorContainer && startButton && resetButton) {
  const startState = EditorState.create({
    doc: "", // Start empty
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentUnit.of("  "),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      javascript(),
      EditorView.editable.of(false),
      EditorView.theme({
        "&": { 
          height: "100%",
          backgroundColor: "#282c34"
        },
        ".cm-content": { caretColor: "#fff" }, 
        ".cm-gutters": { backgroundColor: "#282c34", border: "none" },
        ".cm-activeLineGutter": { backgroundColor: "#3e4451" }
      })
    ]
  })

  // Assign to the higher-scoped variable
  view = new EditorView({
    state: startState,
    parent: editorContainer
  })

  // --- Animation Functions ---
  const calculateDelay = (char: string): number => {
    let delay = BASE_DELAY + (Math.random() * RANDOM_DELAY_RANGE) - (RANDOM_DELAY_RANGE / 2);
    if (char === '\n') {
      delay += NEWLINE_PAUSE;
    } else if (PAUSE_CHARS.includes(char)) {
      delay += PUNCTUATION_PAUSE;
    }
    return Math.max(20, delay); // Ensure a minimum delay
  };

  const scheduleNextCharacter = (char: string) => {
      const delay = calculateDelay(char);
      timeoutId = setTimeout(typeNextCharacter, delay);
  }

  const typeNextCharacter = () => {
    if (!isAnimating || animationIndex >= inputCode.length) {
      isAnimating = false;
      timeoutId = null;
      if (startButton) startButton.textContent = "Start Animation";
      return;
    }

    const correctChar = inputCode[animationIndex];

    // --- Typo Logic ---
    if (Math.random() < TYPO_CHANCE) {
      // Insert incorrect character
      view.dispatch({
        changes: { from: view.state.doc.length, insert: TYPO_CHAR }
      });

      // Schedule realization (delete)
      timeoutId = setTimeout(() => {
        // Delete the typo
        view.dispatch({
            changes: { from: view.state.doc.length - TYPO_CHAR.length, to: view.state.doc.length }
        });

        // Schedule correction (insert correct)
        timeoutId = setTimeout(() => {
            // Insert correct character
            view.dispatch({ 
                changes: { from: view.state.doc.length, insert: correctChar }
            });
            animationIndex++;
            // Schedule the *next* character after correction
            scheduleNextCharacter(correctChar);
        }, TYPO_CORRECTION_DELAY);

      }, TYPO_REALIZATION_DELAY);

    } else {
      // --- No Typo: Standard Insertion ---
      view.dispatch({
        changes: { from: view.state.doc.length, insert: correctChar }
      });
      animationIndex++;
      // Schedule the next character normally
      scheduleNextCharacter(correctChar);
    }
  };

  const handleStartAnimation = () => {
    if (isAnimating) return;

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Reset state
    animationIndex = 0;
    isAnimating = true;
    if (startButton) startButton.textContent = "Animating...";

    // Clear editor content
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: '' }
    });

    // Start typing
    typeNextCharacter();
  };

  const handleReset = () => {
    // Clear any ongoing animation timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Reset state
    isAnimating = false;
    animationIndex = 0;
    if (startButton) startButton.textContent = "Start Animation";

    // Clear editor content
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: '' }
    });
  };

  // --- Event Listeners ---
  startButton.addEventListener('click', handleStartAnimation);
  resetButton.addEventListener('click', handleReset);

} else {
  console.error("Required elements (editor container or buttons) not found!");
}

// We will add our animation logic here later
