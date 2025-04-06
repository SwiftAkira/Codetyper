import './style.css'
import './vscode-theme.css'
import { EditorState, Extension, StateEffect, StateField } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { RangeSetBuilder } from "@codemirror/state"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { html } from "@codemirror/lang-html"
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete"
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search"
import { lintKeymap } from "@codemirror/lint"
import { indentUnit } from '@codemirror/language';

const editorContainer = document.getElementById('editor-container');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
const exportMp4Button = document.getElementById('export-mp4-button');

// Toggle settings panel
if (settingsButton && settingsPanel) {
  settingsButton.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });
}

// --- Sample Code Examples ---
const codeExamples = {
  typescript: `// Example TypeScript code with VS Code-like syntax highlighting
import { Component, OnInit } from '@angular/core';
import * as React from 'react';
import axios from 'axios';

// Terminal commands are now highlighted with rich styling!
// npm install react react-dom --save-dev
// npx create-react-app my-app --template typescript
// yarn add @types/node @types/react
// pnpm add -D typescript ts-node

// Shell commands with flags and paths
// cd ./project && mkdir -p src/components
// rm -rf node_modules && npm ci
// find . -name "*.ts" | xargs grep "interface"
// cat package.json | grep "version"

// Environment variables and paths
// export NODE_ENV=production
// $PATH:/usr/local/bin
// Running from ~/projects/my-app
// chmod +x ./scripts/build.sh

// Build tools and package managers
// make build
// cmake --build .
// gradle build
// cargo build --release

interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];
  
  constructor() {
    console.log("UserService initialized");
  }
  
  addUser(user: User): void {
    this.users.push(user);
    console.log(\`User \${user.name} added successfully\`);
  }
  
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

const service = new UserService();
const newUser: User = { 
  id: 1, 
  name: "John Doe", 
  email: "john@example.com" 
};

service.addUser(newUser);
const user = service.getUserById(1);
console.log(user);`,

  javascript: `// Example JavaScript code with enhanced syntax highlighting
const express = require('express');
const path = require('path');
const fs = require('fs');

// Framework and library setup commands
// npm init -y
// npm install express mongoose dotenv cors
// yarn add webpack webpack-cli --dev
// npx eslint --init
// docker-compose up -d

// Shell operations with paths
// mkdir -p public/assets/js
// cp -r src/* dist/
// find . -type f -name "*.js" | xargs wc -l

// Environment setup
// export DEBUG=app:*
// NODE_ENV=development nodemon server.js
// $HOME/.npm/bin

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', async (req, res) => {
  try {
    // Fetch users from database
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// Implement a simple caching mechanism
const cache = new Map();

function getOrSetCache(key, callback) {
  if (cache.has(key)) {
    console.log('Cache hit');
    return cache.get(key);
  }
  
  console.log('Cache miss');
  const result = callback();
  cache.set(key, result);
  return result;
}

// Example using async/await with try/catch
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`,

  python: `# Python code example with enhanced terminal syntax highlighting

import os
import sys
import json
from typing import List, Dict, Optional
from pathlib import Path

# Python environment setup commands
# pip install django requests sqlalchemy
# python -m venv .venv
# source .venv/bin/activate
# export PYTHONPATH=.

# Advanced shell commands
# find . -name "*.py" | xargs grep "def"
# python3 manage.py migrate
# DJANGO_SETTINGS_MODULE=myapp.settings python manage.py runserver
# chmod +x ./scripts/deploy.py

class DataProcessor:
    """A class for processing and analyzing data."""
    
    def __init__(self, data_path: str):
        """Initialize with the path to data file.
        
        Args:
            data_path: Path to the data file
        """
        self.data_path = data_path
        self.data: List[Dict] = []
        self._load_data()
    
    def _load_data(self) -> None:
        """Load data from file into memory."""
        try:
            with open(self.data_path, 'r') as f:
                self.data = json.load(f)
            print(f"Loaded {len(self.data)} records from {self.data_path}")
        except FileNotFoundError:
            print(f"Warning: File {self.data_path} not found")
            self.data = []
    
    def filter_by_attribute(self, attribute: str, value: any) -> List[Dict]:
        """Filter data by a specific attribute.
        
        Args:
            attribute: The attribute name to filter by
            value: The value to match
            
        Returns:
            A list of matching records
        """
        return [item for item in self.data if item.get(attribute) == value]
    
    def save_processed_data(self, output_path: str) -> None:
        """Save the processed data to a file.
        
        Args:
            output_path: Path to save the processed data
        """
        with open(output_path, 'w') as f:
            json.dump(self.data, f, indent=2)
        print(f"Saved processed data to {output_path}")


def main():
    """Main entry point of the script."""
    if len(sys.argv) < 2:
        print("Usage: python script.py <data_file>")
        return
    
    data_path = sys.argv[1]
    processor = DataProcessor(data_path)
    
    # Example operations
    filtered_data = processor.filter_by_attribute('status', 'active')
    print(f"Found {len(filtered_data)} active records")
    
    # Save processed data
    output_dir = Path("./output")
    output_dir.mkdir(exist_ok=True)
    processor.save_processed_data(str(output_dir / "processed_data.json"))


if __name__ == "__main__":
    main()`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frontend Development Demo</title>
  <link rel="stylesheet" href="styles.css">
  <!-- Terminal commands for web development -->
  <!-- npm run build -->
  <!-- npx vite -->
  <!-- yarn dev -->
  <!-- npm start -->
  <!-- python -m http.server -->
  <!-- docker build -t webapp . -->
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <img src="logo.svg" alt="Logo">
      </div>
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button class="mobile-menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  </header>

  <main>
    <section id="hero">
      <div class="container">
        <h1>Welcome to Our Platform</h1>
        <p>The most comprehensive solution for your needs</p>
        <button class="cta-button">Get Started</button>
      </div>
    </section>

    <section id="features">
      <div class="container">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="icon icon-speed"></i>
            <h3>Lightning Fast</h3>
            <p>Optimized performance for the best user experience</p>
          </div>
          <div class="feature-card">
            <i class="icon icon-secure"></i>
            <h3>Highly Secure</h3>
            <p>Enterprise-grade security to protect your data</p>
          </div>
          <div class="feature-card">
            <i class="icon icon-scalable"></i>
            <h3>Scalable</h3>
            <p>Grows with your business needs</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // JavaScript for the mobile menu toggle
    document.addEventListener('DOMContentLoaded', () => {
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      const navLinks = document.querySelector('.nav-links');
      
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('open');
      });
    });
  </script>
</body>
</html>`
};

// --- Typing Personas ---
const typingPersonas = {
  junior: {
    name: "Junior Developer",
    typoChance: 0.05,
    speedMultiplier: 0.8,
    typoRealizationDelay: 250,
    typoCorrection: 200,
    description: "New to coding, makes more mistakes and types a bit slower"
  },
  regular: {
    name: "Regular Developer",
    typoChance: 0.03,
    speedMultiplier: 1.0,
    typoRealizationDelay: 180,
    typoCorrection: 120,
    description: "Balanced typing speed and accuracy"
  },
  senior: {
    name: "Senior Developer",
    typoChance: 0.015,
    speedMultiplier: 1.3,
    typoRealizationDelay: 150,
    typoCorrection: 100,
    description: "Types faster with fewer mistakes"
  },
  tenx: {
    name: "10x Engineer",
    typoChance: 0.008,
    speedMultiplier: 1.8,
    typoRealizationDelay: 120,
    typoCorrection: 80,
    description: "Blazing fast typing with minimal errors"
  }
};

// Current persona settings
let currentPersona: keyof typeof typingPersonas = "regular";
let typoChance = typingPersonas.regular.typoChance;
let typoRealizationDelay = typingPersonas.regular.typoRealizationDelay;
let typoCorrection = typingPersonas.regular.typoCorrection;

// --- Animation State ---
let inputCode = codeExamples.typescript; // Default example
let animationIndex = 0;
let isAnimating = false;
let timeoutId: number | null = null;
const BASE_DELAY = 80; // ms
const RANDOM_DELAY_RANGE = 80; // ms - Defines the range for random delay variation
const NEWLINE_PAUSE = 350; // ms - Extra pause for newlines
const PUNCTUATION_PAUSE = 120; // ms - Extra pause for punctuation/whitespace
const PAUSE_CHARS = ".;{}() "; // Characters triggering the punctuation pause
let speedMultiplier = 1.0; // Default speed multiplier

// --- CodeMirror View ---
let view: EditorView; // Declare view in a higher scope

// --- Terminal Command Highlighter and Syntax Highlighting ---
const terminalCommandMark = Decoration.mark({ class: "cm-terminal-command" });
const importKeywordMark = Decoration.mark({ class: "cm-import-keyword" });
const fromKeywordMark = Decoration.mark({ class: "cm-from-keyword" });
const moduleNameMark = Decoration.mark({ class: "cm-module-name" });
const controlFlowMark = Decoration.mark({ class: "cm-control-flow" });
const constKeywordMark = Decoration.mark({ class: "cm-const-keyword" });
const classKeywordMark = Decoration.mark({ class: "cm-class-keyword" });
const shellCommandMark = Decoration.mark({ class: "cm-shell-command" });
const flagsMark = Decoration.mark({ class: "cm-command-flags" });
const buildToolMark = Decoration.mark({ class: "cm-build-tool" });
const packageManagerMark = Decoration.mark({ class: "cm-package-manager" });
const environmentVarMark = Decoration.mark({ class: "cm-environment-var" });
const pathMark = Decoration.mark({ class: "cm-path" });
const frameworkMark = Decoration.mark({ class: "cm-framework" });

const terminalCommands = ["npm", "npx", "yarn", "pnpm", "node", "git", "docker", "kubectl", "python", "pip", "go", "rustc", "cargo", "php", "composer", "dotnet", "flutter", "dart", "javac", "java", "scala", "sbt", "mvn", "gradle", "ng", "vue", "webpack", "babel", "tsc", "eslint", "prettier", "vite", "nuxt", "next"];
const shellCommands = ["cd", "ls", "dir", "mkdir", "touch", "rm", "cp", "mv", "cat", "echo", "find", "grep", "chmod", "chown", "sudo", "ssh", "curl", "wget", "tar", "zip", "unzip", "ps", "kill", "pwd", "env", "export"];
const buildTools = ["make", "cmake", "ninja", "bazel", "grunt", "gulp", "rollup", "parcel", "esbuild", "swc"];
const packageManagers = ["npm", "yarn", "pnpm", "pip", "gem", "cargo", "composer", "brew", "apt", "apt-get", "yum", "dnf", "pacman", "chocolatey", "scoop", "winget"];
const controlFlowKeywords = ["if", "else", "for", "while", "do", "switch", "case", "break", "continue", "return", "try", "catch", "finally", "throw", "yield", "await", "async"];
const declarationKeywords = ["const", "let", "var", "function", "class", "interface", "type", "enum"];
const objectKeywords = ["class", "interface", "extends", "implements", "new", "this", "super", "private", "public", "protected", "static", "readonly", "abstract"];
const frameworks = ["react", "vue", "angular", "svelte", "nextjs", "nuxt", "gatsby", "express", "nestjs", "django", "flask", "spring", "laravel", "symfony", "rails", "flutter", "electron"];

function findSyntaxHighlights(view: EditorView) {
  // Collect all the decorations in an array first
  const decorations: { from: number, to: number, decoration: Decoration }[] = [];
  
  // Process the document
  for (let {from, to} of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    const lines = text.split("\n");
    
    let pos = from;
    for (const line of lines) {
      // Check if this is a comment line
      const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
      
      // Look for terminal commands in comments
      if (isComment) {
        // Highlight all terminal commands
        for (const cmd of terminalCommands) {
          let cmdIndex = line.indexOf(cmd);
          while (cmdIndex >= 0) {
            // Make sure it's a standalone command (not part of another word)
            const before = cmdIndex === 0 || !line[cmdIndex - 1].match(/\w/);
            const after = cmdIndex + cmd.length === line.length || !line[cmdIndex + cmd.length].match(/\w/);
            
            if (before && after) {
              const cmdStart = pos + cmdIndex;
              const cmdEnd = cmdStart + cmd.length;
              decorations.push({ from: cmdStart, to: cmdEnd, decoration: terminalCommandMark });
            }
            
            cmdIndex = line.indexOf(cmd, cmdIndex + 1);
          }
        }
        
        // Highlight shell commands
        for (const cmd of shellCommands) {
          let cmdIndex = line.indexOf(cmd);
          while (cmdIndex >= 0) {
            // Make sure it's a standalone command (not part of another word)
            const before = cmdIndex === 0 || !line[cmdIndex - 1].match(/\w/);
            const after = cmdIndex + cmd.length === line.length || !line[cmdIndex + cmd.length].match(/\w/);
            
            if (before && after) {
              const cmdStart = pos + cmdIndex;
              const cmdEnd = cmdStart + cmd.length;
              decorations.push({ from: cmdStart, to: cmdEnd, decoration: shellCommandMark });
            }
            
            cmdIndex = line.indexOf(cmd, cmdIndex + 1);
          }
        }
        
        // Highlight build tools
        for (const tool of buildTools) {
          let toolIndex = line.indexOf(tool);
          while (toolIndex >= 0) {
            // Make sure it's a standalone tool (not part of another word)
            const before = toolIndex === 0 || !line[toolIndex - 1].match(/\w/);
            const after = toolIndex + tool.length === line.length || !line[toolIndex + tool.length].match(/\w/);
            
            if (before && after) {
              const toolStart = pos + toolIndex;
              const toolEnd = toolStart + tool.length;
              decorations.push({ from: toolStart, to: toolEnd, decoration: buildToolMark });
            }
            
            toolIndex = line.indexOf(tool, toolIndex + 1);
          }
        }
        
        // Highlight package managers
        for (const pm of packageManagers) {
          let pmIndex = line.indexOf(pm);
          while (pmIndex >= 0) {
            // Make sure it's a standalone package manager (not part of another word)
            const before = pmIndex === 0 || !line[pmIndex - 1].match(/\w/);
            const after = pmIndex + pm.length === line.length || !line[pmIndex + pm.length].match(/\w/);
            
            if (before && after) {
              const pmStart = pos + pmIndex;
              const pmEnd = pmStart + pm.length;
              decorations.push({ from: pmStart, to: pmEnd, decoration: packageManagerMark });
            }
            
            pmIndex = line.indexOf(pm, pmIndex + 1);
          }
        }
        
        // Highlight command flags (--flag or -f)
        const flagRegex = /\s(-{1,2}[a-zA-Z0-9][a-zA-Z0-9-]*)/g;
        let flagMatch;
        while ((flagMatch = flagRegex.exec(line)) !== null) {
          const flagStart = pos + flagMatch.index + 1; // +1 to skip the space
          const flagEnd = flagStart + flagMatch[1].length;
          decorations.push({ from: flagStart, to: flagEnd, decoration: flagsMark });
        }
        
        // Highlight environment variables ($VAR or ${VAR})
        const envVarRegex = /(\$[A-Z_][A-Z0-9_]*|\${[A-Z_][A-Z0-9_]*})/g;
        let envVarMatch;
        while ((envVarMatch = envVarRegex.exec(line)) !== null) {
          const varStart = pos + envVarMatch.index;
          const varEnd = varStart + envVarMatch[1].length;
          decorations.push({ from: varStart, to: varEnd, decoration: environmentVarMark });
        }
        
        // Highlight file paths
        const pathRegex = /\s((?:~|\/|\.\/|\.\.\/)[a-zA-Z0-9_\-\.\/]+)\b/g;
        let pathMatch;
        while ((pathMatch = pathRegex.exec(line)) !== null) {
          const pathStart = pos + pathMatch.index + 1; // +1 to skip the space
          const pathEnd = pathStart + pathMatch[1].length;
          decorations.push({ from: pathStart, to: pathEnd, decoration: pathMark });
        }
      }
      
      // Check if this is an import line
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("import ")) {
        // Highlight 'import' keyword
        const importIndex = line.indexOf("import");
        if (importIndex >= 0) {
          decorations.push({ from: pos + importIndex, to: pos + importIndex + 6, decoration: importKeywordMark });
        }
        
        // Highlight 'from' keyword
        const fromIndex = line.indexOf(" from ");
        if (fromIndex >= 0) {
          decorations.push({ from: pos + fromIndex + 1, to: pos + fromIndex + 5, decoration: fromKeywordMark });
        }
        
        // Highlight module name (in quotes)
        const quoteMatch = line.match(/from\s+(['"])(.*?)\1/);
        if (quoteMatch && quoteMatch.index !== undefined) {
          const moduleStart = pos + quoteMatch.index + 5 + quoteMatch[1].length;
          const moduleEnd = moduleStart + quoteMatch[2].length;
          decorations.push({ from: moduleStart, to: moduleEnd, decoration: moduleNameMark });
        }
      }
      
      // Highlight require statements for JavaScript
      const requireMatch = line.match(/require\s*\(\s*(['"])(.*?)\1\s*\)/);
      if (requireMatch && requireMatch.index !== undefined) {
        const moduleStart = pos + requireMatch.index + requireMatch[0].indexOf(requireMatch[1]) + 1;
        const moduleEnd = moduleStart + requireMatch[2].length;
        decorations.push({ from: moduleStart, to: moduleEnd, decoration: moduleNameMark });
      }
      
      // Highlight frameworks
      for (const framework of frameworks) {
        const regex = new RegExp(`\\b${framework}\\b`, 'gi');
        let match;
        while ((match = regex.exec(line)) !== null) {
          const start = pos + match.index;
          const end = start + framework.length;
          decorations.push({ from: start, to: end, decoration: frameworkMark });
        }
      }
      
      // Highlight control flow keywords
      for (const keyword of controlFlowKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          const start = pos + match.index;
          const end = start + keyword.length;
          decorations.push({ from: start, to: end, decoration: controlFlowMark });
        }
      }
      
      // Highlight declaration keywords
      for (const keyword of declarationKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          const start = pos + match.index;
          const end = start + keyword.length;
          decorations.push({ from: start, to: end, decoration: constKeywordMark });
        }
      }
      
      // Highlight object-oriented keywords
      for (const keyword of objectKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          const start = pos + match.index;
          const end = start + keyword.length;
          decorations.push({ from: start, to: end, decoration: classKeywordMark });
        }
      }
      
      // Move to next line
      pos += line.length + 1; // +1 for the newline character
    }
  }
  
  // Sort decorations by 'from' position to satisfy RangeSetBuilder requirements
  decorations.sort((a, b) => a.from - b.from);
  
  // Build the decoration set using the sorted decorations
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to, decoration } of decorations) {
    builder.add(from, to, decoration);
  }
  
  return builder.finish();
}

const syntaxHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    
    constructor(view: EditorView) {
      this.decorations = findSyntaxHighlights(view);
    }
    
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = findSyntaxHighlights(update.view);
      }
    }
  },
  {
    decorations: v => v.decorations
  }
);

// CSS for syntax highlighting (adding directly to document for simplicity)
const customSyntaxStyle = document.createElement("style");
customSyntaxStyle.textContent = `
  .cm-terminal-command {
    color: #dcdcaa !important;
    font-weight: 600;
  }
  
  .cm-shell-command {
    color: #ce9178 !important;
    font-weight: 600;
  }
  
  .cm-build-tool {
    color: #b5cea8 !important;
    font-weight: 600;
  }
  
  .cm-package-manager {
    color: #4ec9b0 !important;
    font-weight: 600;
  }
  
  .cm-command-flags {
    color: #569cd6 !important;
    font-weight: normal;
  }
  
  .cm-environment-var {
    color: #9cdcfe !important;
    font-style: italic;
  }
  
  .cm-path {
    color: #d7ba7d !important;
    text-decoration: underline;
  }
  
  .cm-framework {
    color: #4ec9b0 !important;
    font-weight: bold;
  }
  
  .cm-import-keyword {
    color: #c586c0 !important;
    font-weight: normal;
  }
  
  .cm-from-keyword {
    color: #c586c0 !important;
    font-weight: normal;
  }
  
  .cm-module-name {
    color: #ce9178 !important;
    font-weight: normal;
  }
  
  .cm-control-flow {
    color: #c586c0 !important;
    font-weight: normal;
  }
  
  .cm-const-keyword {
    color: #569cd6 !important;
    font-weight: normal;
  }
  
  .cm-class-keyword {
    color: #569cd6 !important;
    font-weight: normal;
  }
`;
document.head.appendChild(customSyntaxStyle);

if (editorContainer && startButton && resetButton) {
  // Create file selector
  const fileSelector = document.createElement('select');
  fileSelector.className = 'vscode-select';
  fileSelector.innerHTML = `
    <option value="typescript">TypeScript Example</option>
    <option value="javascript">JavaScript Example</option>
    <option value="python">Python Example</option>
    <option value="html">HTML Example</option>
    <option value="custom">Paste Your Own Code!</option>
  `;
  
  // Insert before editor
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.insertBefore(fileSelector, editorContainer);
    
    // Add margin style
    fileSelector.style.marginBottom = '8px';
    fileSelector.style.padding = '4px 8px';
    fileSelector.style.backgroundColor = '#3c3c3c';
    fileSelector.style.color = '#d4d4d4';
    fileSelector.style.border = '1px solid #3c3c3c';
    fileSelector.style.borderRadius = '2px';
    fileSelector.style.outline = 'none';
  }
  
  // Create custom code dialog elements
  const customCodeDialog = document.createElement('div');
  customCodeDialog.style.display = 'none';
  customCodeDialog.style.position = 'fixed';
  customCodeDialog.style.top = '50%';
  customCodeDialog.style.left = '50%';
  customCodeDialog.style.transform = 'translate(-50%, -50%)';
  customCodeDialog.style.backgroundColor = '#252526';
  customCodeDialog.style.padding = '20px';
  customCodeDialog.style.borderRadius = '4px';
  customCodeDialog.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
  customCodeDialog.style.zIndex = '1000';
  customCodeDialog.style.width = '80%';
  customCodeDialog.style.maxWidth = '800px';
  
  customCodeDialog.innerHTML = `
    <h3 style="color: #d4d4d4; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Paste Your Own Code</h3>
    <textarea 
      id="custom-code-input" 
      placeholder="Paste your code here..."
      style="width: 100%; height: 300px; background-color: #1e1e1e; color: #d4d4d4; border: 1px solid #3c3c3c; 
             padding: 10px; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; margin-bottom: 15px;
             resize: vertical; line-height: 1.5;"
    ></textarea>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button id="cancel-custom-code" class="vscode-button reset" style="background-color: #4d4d4d;">Cancel</button>
      <button id="apply-custom-code" class="vscode-button">Apply</button>
    </div>
  `;
  
  document.body.appendChild(customCodeDialog);
  
  const customCodeInput = document.getElementById('custom-code-input') as HTMLTextAreaElement;
  const applyCustomCodeBtn = document.getElementById('apply-custom-code') as HTMLButtonElement;
  const cancelCustomCodeBtn = document.getElementById('cancel-custom-code') as HTMLButtonElement;
  
  // Show/hide the custom code dialog
  const showCustomCodeDialog = () => {
    customCodeDialog.style.display = 'block';
    customCodeInput?.focus();
  };
  
  const hideCustomCodeDialog = () => {
    customCodeDialog.style.display = 'none';
    // Reset the file selector to the previously selected option
    if (fileSelector.value === 'custom' && previousLanguage) {
      fileSelector.value = previousLanguage;
    }
  };
  
  // Track the previously selected language
  let previousLanguage = 'typescript';
  
  // Add change event listener to file selector
  fileSelector.addEventListener('change', (e) => {
    const selectedLanguage = (e.target as HTMLSelectElement).value;
    
    if (selectedLanguage === 'custom') {
      showCustomCodeDialog();
    } else {
      previousLanguage = selectedLanguage;
      inputCode = codeExamples[selectedLanguage as keyof typeof codeExamples];
      
      // Reset the editor
      handleReset();
      
      // Update language mode based on selection
      view.dispatch({
        effects: StateEffect.reconfigure.of(getLanguageExtension(selectedLanguage))
      });
    }
  });
  
  // Handle custom code input
  if (applyCustomCodeBtn && cancelCustomCodeBtn) {
    applyCustomCodeBtn.addEventListener('click', () => {
      const customCode = customCodeInput?.value.trim();
      
      if (customCode) {
        // Update the input code
        inputCode = customCode;
        
        // Reset the editor
        handleReset();
        
        // Try to auto-detect language
        const detectedLanguage = detectLanguageFromCode(customCode);
        
        // Update language mode
        view.dispatch({
          effects: StateEffect.reconfigure.of(getLanguageExtension(detectedLanguage))
        });
        
        // Update file selector if possible
        previousLanguage = detectedLanguage;
        hideCustomCodeDialog();
      }
    });
    
    cancelCustomCodeBtn.addEventListener('click', hideCustomCodeDialog);
  }

  // Function to get language-specific extensions
  const getLanguageExtension = (lang: string): Extension => {
    switch (lang) {
      case 'python':
        return python();
      case 'html':
        return html();
      case 'javascript':
      case 'typescript':
      default:
        return javascript({ typescript: lang === 'typescript' });
    }
  };

  // Line highlighting decoration
  const currentLineMark = Decoration.line({class: "cm-active-typing-line"});

  // Define a StateEffect for setting the active line decoration
  const setLineHighlight = StateEffect.define<DecorationSet>();

  // Cursor decoration and effect
  const cursorMark = Decoration.widget({
    widget: new class extends WidgetType {
      toDOM() {
        const span = document.createElement("span");
        span.className = "cm-typing-cursor";
        span.innerHTML = "&nbsp;";
        return span;
      }
    },
    side: 1
  });
  const setCursorPosition = StateEffect.define<DecorationSet>();

  // Create a state field for the line highlighting
  const lineHighlightField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(decorations, tr) {
      decorations = decorations.map(tr.changes);
      
      for (let e of tr.effects) {
        if (e.is(setLineHighlight)) {
          decorations = e.value;
        }
      }
      
      return decorations;
    },
    provide: f => EditorView.decorations.from(f)
  });

  // Create a state field for the cursor position
  const cursorPositionField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(decorations, tr) {
      decorations = decorations.map(tr.changes);
      
      for (let e of tr.effects) {
        if (e.is(setCursorPosition)) {
          decorations = e.value;
        }
      }
      
      return decorations;
    },
    provide: f => EditorView.decorations.from(f)
  });

  // Style for the active typing line
  const lineHighlightStyle = document.createElement("style");
  lineHighlightStyle.textContent = `
    .cm-active-typing-line {
      background-color: rgba(33, 66, 131, 0.5) !important;
      border-left: 2px solid #569cd6 !important;
    }
    
    .cm-typing-cursor {
      display: inline-block;
      width: 2px;
      height: 1.2em;
      background-color: #fff;
      vertical-align: text-bottom;
      animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(lineHighlightStyle);

  const startState = EditorState.create({
    doc: "", // Start empty
    extensions: [
      lineNumbers({
        formatNumber: (lineNo) => lineNo.toString().padStart(2, ' ')
      }),
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
      syntaxHighlighter,
      lineHighlightField,
      cursorPositionField,
      EditorView.editable.of(false),
      javascript({ typescript: true }),
      EditorView.theme({
        "&": { 
          height: "100%",
          backgroundColor: "#1e1e1e"
        },
        ".cm-scroller": { backgroundColor: "#1e1e1e" },
        ".cm-gutters": { backgroundColor: "#1e1e1e" },
        ".cm-content": { backgroundColor: "#1e1e1e" }
      })
    ]
  })

  // Assign to the higher-scoped variable
  view = new EditorView({
    state: startState,
    parent: editorContainer
  })

  // Initialize speed slider functionality
  const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
  const speedValue = document.getElementById('speed-value') as HTMLSpanElement;
  
  // Initialize persona selector
  const personaSelect = document.getElementById('persona-select') as HTMLSelectElement;
  const personaDescription = document.getElementById('persona-description') as HTMLDivElement;
  
  // Initialize guided demo UI elements
  const demoSelect = document.getElementById('demo-select') as HTMLSelectElement;
  const demoDescription = document.getElementById('demo-description') as HTMLDivElement;
  const demoStartButton = document.getElementById('start-demo-button') as HTMLButtonElement;
  
  // Current guided demo state
  let currentDemo: keyof typeof guidedDemos | null = null;
  let currentStep = 0;
  let demoSteps: typeof guidedDemos[keyof typeof guidedDemos]['steps'] = [];
  let isRunningDemo = false;
  
  // Explanation tooltip
  const explanationTooltip = document.createElement('div');
  explanationTooltip.className = 'explanation-tooltip bg-gray-700 text-gray-300 p-2 rounded shadow-lg border border-gray-600 text-sm absolute hidden';
  explanationTooltip.style.maxWidth = '300px';
  explanationTooltip.style.zIndex = '1000';
  document.body.appendChild(explanationTooltip);
  
  if (personaSelect && personaDescription) {
    personaSelect.addEventListener('change', () => {
      const selectedPersona = personaSelect.value as keyof typeof typingPersonas;
      currentPersona = selectedPersona;
      
      // Update typing parameters
      typoChance = typingPersonas[selectedPersona].typoChance;
      speedMultiplier = typingPersonas[selectedPersona].speedMultiplier;
      typoRealizationDelay = typingPersonas[selectedPersona].typoRealizationDelay;
      typoCorrection = typingPersonas[selectedPersona].typoCorrection;
      
      // Update description
      if (personaDescription) {
        personaDescription.textContent = typingPersonas[selectedPersona].description;
      }
    });
  }
  
  if (speedSlider && speedValue) {
    // Update speed value display and multiplier
    speedSlider.addEventListener('input', (e) => {
      const newSpeed = parseFloat((e.target as HTMLInputElement).value);
      speedMultiplier = newSpeed;
      speedValue.textContent = `${newSpeed.toFixed(1)}x`;
      
      // If animation is currently running, no need to do anything else
      // The next character will use the new speed value
    });
  }

  if (demoSelect && demoDescription && demoStartButton) {
    demoSelect.addEventListener('change', (e) => {
      const selectedDemo = (e.target as HTMLSelectElement).value;
      
      if (selectedDemo) {
        currentDemo = selectedDemo as keyof typeof guidedDemos;
        demoDescription.textContent = guidedDemos[currentDemo].description;
        demoDescription.classList.remove('hidden');
        demoStartButton.classList.remove('hidden');
        
        // Update language in file selector to match demo
        const demoLanguage = guidedDemos[currentDemo].language;
        if (fileSelector) {
          fileSelector.value = demoLanguage;
          // Trigger language change
          fileSelector.dispatchEvent(new Event('change'));
        }
      } else {
        currentDemo = null;
        demoDescription.classList.add('hidden');
        demoStartButton.classList.add('hidden');
      }
    });
    
    demoStartButton.addEventListener('click', () => {
      if (!currentDemo || isRunningDemo) return;
      
      // Start guided demo
      isRunningDemo = true;
      currentStep = 0;
      demoSteps = guidedDemos[currentDemo].steps;
      
      // Reset editor
      handleReset();
      demoStartButton.textContent = 'Demo Running...';
      demoStartButton.disabled = true;
      
      // Start typing out demo
      runNextDemoStep();
    });
  }
  
  function runNextDemoStep() {
    if (!currentDemo || currentStep >= demoSteps.length) {
      finishDemo();
      return;
    }
    
    // Set up current code for typing
    inputCode = demoSteps[currentStep].code;
    
    // Show explanation tooltip
    showExplanation(demoSteps[currentStep].explanation);
    
    // Reset animation state for this step
    animationIndex = 0;
    isAnimating = true;
    
    // Start typing this step
    typeNextCharacter();
    
    // When typing is done, set up listener for next step
    const checkAnimationStatus = setInterval(() => {
      if (!isAnimating) {
        clearInterval(checkAnimationStatus);
        
        // Wait for user to press a key to continue
        const handleNextStep = () => {
          document.removeEventListener('keydown', handleNextStep);
          hideExplanation();
          currentStep++;
          runNextDemoStep();
        };
        
        // Listen for any key press to continue
        document.addEventListener('keydown', handleNextStep);
        
        // Also show a message to press any key
        explanationTooltip.textContent = `Step ${currentStep + 1} of ${demoSteps.length} complete. Press any key to continue...`;
      }
    }, 100);
  }
  
  function showExplanation(text: string) {
    explanationTooltip.textContent = text;
    explanationTooltip.classList.remove('hidden');
    
    // Position below the editor
    if (editorContainer) {
      const rect = editorContainer.getBoundingClientRect();
      explanationTooltip.style.top = `${rect.bottom + 10}px`;
      explanationTooltip.style.left = `${rect.left + 10}px`;
    }
  }
  
  function hideExplanation() {
    explanationTooltip.classList.add('hidden');
  }
  
  function finishDemo() {
    isRunningDemo = false;
    currentStep = 0;
    if (demoStartButton) {
      demoStartButton.textContent = 'Start Guided Demo';
      demoStartButton.disabled = false;
    }
    hideExplanation();
  }

  // --- Animation Functions ---
  const calculateDelay = (char: string): number => {
    // Apply the speed multiplier by dividing the delay
    let delay = (BASE_DELAY + (Math.random() * RANDOM_DELAY_RANGE) - (RANDOM_DELAY_RANGE / 2)) / speedMultiplier;
    if (char === '\n') {
      delay += NEWLINE_PAUSE / speedMultiplier;
    } else if (PAUSE_CHARS.includes(char)) {
      delay += PUNCTUATION_PAUSE / speedMultiplier;
    }
    return Math.max(10, delay); // Ensure a minimum delay
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
    
    // Find the current line number to highlight it
    const textUpToCursor = inputCode.substring(0, animationIndex);
    const currentLine = textUpToCursor.split('\n').length - 1;
    setActiveLine(currentLine);
    
    // Set cursor position - at current end of document
    setCursor(view.state.doc.length);

    // --- Typo Logic ---
    if (Math.random() < typoChance) {
      // Insert incorrect character
      view.dispatch({
        changes: { from: view.state.doc.length, insert: 'X' }
      });
      
      // Update cursor after insertion
      setCursor(view.state.doc.length);

      // Schedule realization (delete)
      timeoutId = setTimeout(() => {
        // Delete the typo
        view.dispatch({
            changes: { from: view.state.doc.length - 1, to: view.state.doc.length }
        });
        
        // Update cursor after deletion
        setCursor(view.state.doc.length);

        // Schedule correction (insert correct)
        timeoutId = setTimeout(() => {
            // Insert correct character
            view.dispatch({ 
                changes: { from: view.state.doc.length, insert: correctChar }
            });
            
            // Update cursor after correction
            setCursor(view.state.doc.length);
            
            animationIndex++;
            // Schedule the *next* character after correction
            scheduleNextCharacter(correctChar);
        }, typoCorrection / speedMultiplier);

      }, typoRealizationDelay / speedMultiplier);

    } else {
      // --- No Typo: Standard Insertion ---
      view.dispatch({
        changes: { from: view.state.doc.length, insert: correctChar }
      });
      
      // Update cursor position after insertion
      setCursor(view.state.doc.length);
      
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

    // Log current typing persona (this uses currentPersona to satisfy TypeScript)
    console.log(`Animation started with "${typingPersonas[currentPersona].name}" persona`);

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

  // Function to set the active line in the editor
  function setActiveLine(lineNumber: number) {
    // Map from 0-indexed line to document position
    const lines = view.state.doc.toString().split('\n');
    let pos = 0;
    
    // Calculate position at the start of the line
    for (let i = 0; i < lineNumber && i < lines.length; i++) {
      pos += lines[i].length + 1; // +1 for the newline character
    }
    
    // For line decorations, we need a zero-length range at the start of the line
    // Create a decoration set for the current line
    const decorations = Decoration.set([
      currentLineMark.range(pos)
    ]);
    
    // Update the decorations
    view.dispatch({
      effects: setLineHighlight.of(decorations)
    });
    
    // Ensure view scrolls to show the active line
    view.dispatch({
      effects: EditorView.scrollIntoView(pos, { y: 'center' })
    });
  }

  // Function to set cursor position
  function setCursor(pos: number) {
    const decorations = Decoration.set([
      cursorMark.range(pos)
    ]);
    
    view.dispatch({
      effects: setCursorPosition.of(decorations)
    });
  }

  // --- Event Listeners ---
  startButton.addEventListener('click', handleStartAnimation);
  resetButton.addEventListener('click', handleReset);

  // Remove the custom code handlers from settings panel since we now have a dedicated dialog
  
  // Initialize guided demo
  if (demoSelect && demoStartButton && demoDescription) {
    // Set up guided demo selection
    demoSelect.addEventListener('change', (e) => {
      const selectedDemo = (e.target as HTMLSelectElement).value as keyof typeof guidedDemos | '';
      
      if (selectedDemo) {
        demoDescription.textContent = guidedDemos[selectedDemo].description;
        demoDescription.classList.remove('hidden');
        demoStartButton.classList.remove('hidden');
        currentDemo = selectedDemo as keyof typeof guidedDemos;
      } else {
        demoDescription.classList.add('hidden');
        demoStartButton.classList.add('hidden');
        currentDemo = null;
      }
    });
    
    // Start guided demo
    demoStartButton.addEventListener('click', () => {
      if (currentDemo) {
        // Load the demo and start
        demoSteps = [...guidedDemos[currentDemo].steps]; // Create a copy of the steps
        currentStep = 0;
        isRunningDemo = true;
        
        // Close settings panel
        if (settingsPanel) {
          settingsPanel.classList.add('hidden');
        }
        
        // Start the demo
        handleReset();
        runNextDemoStep();
      }
    });
  }

  // Initialize persona selection
  if (personaSelect && personaDescription) {
    personaSelect.addEventListener('change', () => {
      const selectedPersona = personaSelect.value as keyof typeof typingPersonas;
      currentPersona = selectedPersona;
      
      // Update typing parameters
      typoChance = typingPersonas[selectedPersona].typoChance;
      speedMultiplier = typingPersonas[selectedPersona].speedMultiplier;
      typoRealizationDelay = typingPersonas[selectedPersona].typoRealizationDelay;
      typoCorrection = typingPersonas[selectedPersona].typoCorrection;
      
      // Update description
      if (personaDescription) {
        personaDescription.textContent = typingPersonas[selectedPersona].description;
      }
    });
  }

  function detectLanguageFromCode(code: string): string {
    // Simple language detection based on syntax patterns
    if (code.includes('import React') || code.includes('interface ') || 
        code.includes('export interface') || code.includes(': string') ||
        code.includes(': number') || code.includes(': boolean')) {
      return 'typescript';
    } else if (code.includes('function') || code.includes('const ') || 
              code.includes('let ') || code.includes('var ') ||
              code.includes('import ') || code.includes('export ')) {
      return 'javascript';
    } else if (code.includes('def ') || code.includes('import os') || 
              code.includes('class ') && code.includes('self') ||
              code.includes('__init__')) {
      return 'python';
    } else if (code.includes('<!DOCTYPE html>') || code.includes('<html>') ||
              code.includes('<div') || code.includes('<head>') ||
              code.includes('<body>')) {
      return 'html';
    }
    
    // Default to javascript
    return 'javascript';
  }

} else {
  console.error("Required elements (editor container or buttons) not found!");
}

// We will add our animation logic here later

// --- Guided Demo Scenarios ---
const guidedDemos = {
  reactComponent: {
    title: "Building a React Component",
    description: "Watch as we create a functional React component with hooks",
    language: "typescript",
    steps: [
      {
        code: "import React, { useState, useEffect } from 'react';",
        explanation: "First, we import React and necessary hooks"
      },
      {
        code: "\ninterface UserProps {\n  userId: number;\n  showDetails?: boolean;\n}",
        explanation: "We define TypeScript interfaces for our props"
      },
      {
        code: "\n\nconst UserProfile: React.FC<UserProps> = ({ userId, showDetails = false }) => {",
        explanation: "Next, we create a functional component with destructured props"
      },
      {
        code: "\n  const [user, setUser] = useState<any>(null);\n  const [loading, setLoading] = useState<boolean>(true);",
        explanation: "We set up state variables using the useState hook"
      },
      {
        code: "\n\n  useEffect(() => {\n    // Simulate API call\n    setLoading(true);\n    setTimeout(() => {\n      setUser({ id: userId, name: 'John Doe', email: 'john@example.com' });\n      setLoading(false);\n    }, 1000);\n  }, [userId]);",
        explanation: "The useEffect hook is used to fetch data when the component mounts or userId changes"
      },
      {
        code: "\n\n  if (loading) {\n    return <div>Loading user data...</div>;\n  }",
        explanation: "We handle the loading state with a conditional return"
      },
      {
        code: "\n\n  return (\n    <div className=\"user-profile\">\n      <h2>{user.name}</h2>\n      {showDetails && (\n        <div className=\"user-details\">\n          <p>Email: {user.email}</p>\n          <p>ID: {user.id}</p>\n        </div>\n      )}\n    </div>\n  );\n};",
        explanation: "Finally, we return JSX with conditional rendering based on the showDetails prop"
      },
      {
        code: "\n\nexport default UserProfile;",
        explanation: "We export the component as the default export"
      }
    ]
  },
  algorithmSolution: {
    title: "Solving an Algorithm Problem",
    description: "Watch the step-by-step solution to a coding challenge",
    language: "javascript",
    steps: [
      {
        code: "/**\n * Problem: Find the two numbers in an array that add up to a target sum\n * @param {number[]} nums - The input array of numbers\n * @param {number} target - The target sum\n * @return {number[]} - Indices of the two numbers that add up to the target\n */",
        explanation: "First, we define the problem with JSDoc comments"
      },
      {
        code: "\nfunction twoSum(nums, target) {",
        explanation: "We create a function that takes an array and a target sum"
      },
      {
        code: "\n  // Brute force approach - O(n^2) time complexity\n  // for (let i = 0; i < nums.length; i++) {\n  //   for (let j = i + 1; j < nums.length; j++) {\n  //     if (nums[i] + nums[j] === target) {\n  //       return [i, j];\n  //     }\n  //   }\n  // }",
        explanation: "We could use a brute force approach, but it would be inefficient"
      },
      {
        code: "\n\n  // Optimized approach using a hash map - O(n) time complexity\n  const numMap = new Map();",
        explanation: "Instead, we'll use a hash map for O(n) time complexity"
      },
      {
        code: "\n\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];",
        explanation: "For each number, we calculate its complement (what we need to reach the target)"
      },
      {
        code: "\n\n    // Check if the complement exists in our map\n    if (numMap.has(complement)) {\n      return [numMap.get(complement), i];\n    }",
        explanation: "If we've seen the complement before, we found our pair"
      },
      {
        code: "\n\n    // If not found, add current number to the map\n    numMap.set(nums[i], i);\n  }",
        explanation: "Otherwise, we store the current number and continue"
      },
      {
        code: "\n\n  // If no solution is found\n  return [];\n}",
        explanation: "If we reach the end of the array without finding a solution, return an empty array"
      },
      {
        code: "\n\n// Example usage\nconst nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log(twoSum(nums, target)); // Output: [0, 1]",
        explanation: "Finally, we test our function with an example"
      }
    ]
  }
};

// --- MP4 Export Dialog and Functionality ---
// Create MP4 export dialog elements
const mp4ExportDialog = document.createElement('div');
mp4ExportDialog.style.display = 'none';
mp4ExportDialog.style.position = 'fixed';
mp4ExportDialog.style.top = '50%';
mp4ExportDialog.style.left = '50%';
mp4ExportDialog.style.transform = 'translate(-50%, -50%)';
mp4ExportDialog.style.backgroundColor = '#252526';
mp4ExportDialog.style.padding = '20px';
mp4ExportDialog.style.borderRadius = '4px';
mp4ExportDialog.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
mp4ExportDialog.style.zIndex = '1000';
mp4ExportDialog.style.width = '80%';
mp4ExportDialog.style.maxWidth = '800px';

mp4ExportDialog.innerHTML = `
  <h3 style="color: #d4d4d4; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Export Animation to MP4</h3>
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; color: #d4d4d4;">Paste your code:</label>
    <textarea 
      id="mp4-code-input" 
      placeholder="Paste your code here..."
      style="width: 100%; height: 250px; background-color: #1e1e1e; color: #d4d4d4; border: 1px solid #3c3c3c; 
             padding: 10px; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px;
             resize: vertical; line-height: 1.5;"
    ></textarea>
  </div>
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; color: #d4d4d4;">Animation Settings:</label>
    <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 10px;">
      <div>
        <label style="margin-right: 5px; color: #d4d4d4; font-size: 13px;">Persona:</label>
        <select id="mp4-persona-select" style="background-color: #3c3c3c; color: #d4d4d4; border: 1px solid #3c3c3c; padding: 4px 8px; border-radius: 2px;">
          <option value="junior">Junior Developer</option>
          <option value="regular" selected>Regular Developer</option>
          <option value="senior">Senior Developer</option>
          <option value="tenx">10x Engineer</option>
        </select>
      </div>
      <div>
        <label style="margin-right: 5px; color: #d4d4d4; font-size: 13px;">Speed:</label>
        <input 
          id="mp4-speed-slider" 
          type="range" 
          min="0.5" 
          max="2.5" 
          step="0.1" 
          value="1.0" 
          style="width: 100px; vertical-align: middle;"
        >
        <span id="mp4-speed-value" style="color: #d4d4d4; font-size: 13px; width: 30px; display: inline-block;">1.0x</span>
      </div>
    </div>
    
    <!-- Video Quality Settings -->
    <div style="margin-top: 15px; border-top: 1px solid #3c3c3c; padding-top: 15px;">
      <label style="display: block; margin-bottom: 8px; color: #d4d4d4;">Video Quality Settings:</label>
      <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
        <div>
          <label style="margin-right: 5px; color: #d4d4d4; font-size: 13px;">Resolution:</label>
          <select id="mp4-quality-select" style="background-color: #3c3c3c; color: #d4d4d4; border: 1px solid #3c3c3c; padding: 4px 8px; border-radius: 2px;">
            <option value="720p">720p (1280×720)</option>
            <option value="1080p">1080p (1920×1080)</option>
            <option value="2k">2K (2560×1440)</option>
            <option value="4k" selected>4K (3840×2160)</option>
          </select>
        </div>
        <div>
          <label style="margin-right: 5px; color: #d4d4d4; font-size: 13px;">Bitrate:</label>
          <select id="mp4-bitrate-select" style="background-color: #3c3c3c; color: #d4d4d4; border: 1px solid #3c3c3c; padding: 4px 8px; border-radius: 2px;">
            <option value="low">Standard (10 Mbps)</option>
            <option value="medium">High (25 Mbps)</option>
            <option value="high" selected>Ultra (50 Mbps)</option>
            <option value="lossless">Lossless (150 Mbps)</option>
          </select>
        </div>
      </div>
      <div style="margin-top: 10px; font-size: 13px; color: #999;">
        <span style="display: inline-flex; align-items: center;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;">
            <path d="M8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5Z" stroke="#999" stroke-width="1.5"/>
            <path d="M8 4V8.5H11" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Higher resolution and bitrate will result in larger files with better quality
        </span>
        <span style="display: block; margin-top: 5px; color: #e6db74;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px; vertical-align: text-bottom;">
            <path d="M8 1L15 14H1L8 1Z" stroke="#e6db74" stroke-width="1.5"/>
            <path d="M8 11V5" stroke="#e6db74" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="13" r="1" fill="#e6db74"/>
          </svg>
          Lossless option creates extremely high quality but very large files
        </span>
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: flex-end; gap: 10px;">
    <button id="cancel-mp4-export" class="vscode-button reset" style="background-color: #4d4d4d;">Cancel</button>
    <button id="start-mp4-export" class="vscode-button">Start Export</button>
  </div>
  <div id="mp4-export-progress" style="display: none; margin-top: 15px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <span style="color: #d4d4d4; font-size: 13px;" id="mp4-export-status">Exporting animation...</span>
      <span id="mp4-export-percentage" style="color: #d4d4d4; font-size: 13px;">0%</span>
    </div>
    <div style="height: 4px; background-color: #3c3c3c; border-radius: 2px; overflow: hidden;">
      <div id="mp4-export-progress-bar" style="height: 100%; width: 0%; background-color: #0e639c; transition: width 0.3s;"></div>
    </div>
  </div>
`;

document.body.appendChild(mp4ExportDialog);

// Get dialog elements
const mp4CodeInput = document.getElementById('mp4-code-input') as HTMLTextAreaElement;
const mp4PersonaSelect = document.getElementById('mp4-persona-select') as HTMLSelectElement;
const mp4SpeedSlider = document.getElementById('mp4-speed-slider') as HTMLInputElement;
const mp4SpeedValue = document.getElementById('mp4-speed-value') as HTMLSpanElement;
const startMp4ExportBtn = document.getElementById('start-mp4-export') as HTMLButtonElement;
const cancelMp4ExportBtn = document.getElementById('cancel-mp4-export') as HTMLButtonElement;
const mp4ExportProgress = document.getElementById('mp4-export-progress') as HTMLDivElement;
const mp4ExportProgressBar = document.getElementById('mp4-export-progress-bar') as HTMLDivElement;
const mp4ExportPercentage = document.getElementById('mp4-export-percentage') as HTMLSpanElement;

// Show/hide the MP4 export dialog
const showMp4ExportDialog = () => {
  mp4ExportDialog.style.display = 'block';
  mp4CodeInput?.focus();
  
  // Hide progress elements initially
  if (mp4ExportProgress) {
    mp4ExportProgress.style.display = 'none';
  }
  
  // Reset progress
  if (mp4ExportProgressBar) {
    mp4ExportProgressBar.style.width = '0%';
  }
  if (mp4ExportPercentage) {
    mp4ExportPercentage.textContent = '0%';
  }
};

const hideMp4ExportDialog = () => {
  mp4ExportDialog.style.display = 'none';
};

// Update MP4 speed value when slider changes
if (mp4SpeedSlider && mp4SpeedValue) {
  mp4SpeedSlider.addEventListener('input', () => {
    mp4SpeedValue.textContent = `${parseFloat(mp4SpeedSlider.value).toFixed(1)}x`;
  });
}

// Handle MP4 export button click
if (exportMp4Button) {
  exportMp4Button.addEventListener('click', showMp4ExportDialog);
}

// Handle cancel button click
if (cancelMp4ExportBtn) {
  cancelMp4ExportBtn.addEventListener('click', hideMp4ExportDialog);
}

// Create a canvas element for rendering frames
const captureCanvas = document.createElement('canvas');
captureCanvas.width = 3840;  // 4K width (3840x2160)
captureCanvas.height = 2160;  // 4K height
const captureCtx = captureCanvas.getContext('2d');

// Get additional dialog elements for quality settings
const mp4QualitySelect = document.getElementById('mp4-quality-select') as HTMLSelectElement;
const mp4BitrateSelect = document.getElementById('mp4-bitrate-select') as HTMLSelectElement;
const mp4ExportStatus = document.getElementById('mp4-export-status') as HTMLSpanElement;

// Video quality settings constants
const videoQualitySettings = {
  '720p': { width: 1280, height: 720, fontBaseSize: 14, lineHeight: 20, paddingLeft: 60, paddingTop: 20 },
  '1080p': { width: 1920, height: 1080, fontBaseSize: 18, lineHeight: 26, paddingLeft: 80, paddingTop: 30 },
  '2k': { width: 2560, height: 1440, fontBaseSize: 22, lineHeight: 32, paddingLeft: 100, paddingTop: 40 },
  '4k': { width: 3840, height: 2160, fontBaseSize: 28, lineHeight: 40, paddingLeft: 150, paddingTop: 50 }
};

const videoBitrateSettings = {
  'low': 10000000,    // 10 Mbps
  'medium': 25000000, // 25 Mbps
  'high': 50000000,   // 50 Mbps
  'lossless': 150000000 // 150 Mbps (near lossless quality)
};

// Function to start the MP4 export process
if (startMp4ExportBtn) {
  startMp4ExportBtn.addEventListener('click', async () => {
    const codeToExport = mp4CodeInput?.value.trim();
    
    if (!codeToExport) {
      alert('Please paste some code to export.');
      return;
    }
    
    // Show progress UI
    if (mp4ExportProgress) {
      mp4ExportProgress.style.display = 'block';
    }
    
    // Disable export button while processing
    if (startMp4ExportBtn) {
      startMp4ExportBtn.disabled = true;
      startMp4ExportBtn.textContent = 'Exporting...';
    }
    
    try {
      // Get selected quality and bitrate
      const selectedQuality = mp4QualitySelect?.value || '4k';
      const selectedBitrate = mp4BitrateSelect?.value || 'high';
      
      // Update export status text with selected quality
      if (mp4ExportStatus) {
        mp4ExportStatus.textContent = `Exporting ${selectedQuality} animation...`;
      }
      
      // Set canvas dimensions based on selected quality
      const qualityConfig = videoQualitySettings[selectedQuality as keyof typeof videoQualitySettings];
      captureCanvas.width = qualityConfig.width;
      captureCanvas.height = qualityConfig.height;
      
      // Set up MediaRecorder with selected bitrate
      const stream = captureCanvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: videoBitrateSettings[selectedBitrate as keyof typeof videoBitrateSettings]
      });
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      // When recording is complete, create the file and trigger download
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        
        // Create download link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code-animation.mp4';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Reset UI
          hideMp4ExportDialog();
          if (startMp4ExportBtn) {
            startMp4ExportBtn.disabled = false;
            startMp4ExportBtn.textContent = 'Start Export';
          }
        }, 100);
      };
      
      // Start recording
      recorder.start();
      
      // Create a temporary editor for the animation
      const tempEditorContainer = document.createElement('div');
      tempEditorContainer.style.width = `${captureCanvas.width}px`;
      tempEditorContainer.style.height = `${captureCanvas.height}px`;
      tempEditorContainer.style.position = 'absolute';
      tempEditorContainer.style.left = '-9999px';
      document.body.appendChild(tempEditorContainer);
      
      try {
        // Set up a temporary editor instance
        const tempEditor = createTemporaryEditor(tempEditorContainer, codeToExport, mp4PersonaSelect?.value as keyof typeof typingPersonas || 'regular', parseFloat(mp4SpeedSlider?.value || '1.0'));
        
        // Animate and capture frames
        await animateForVideo(tempEditor, tempEditorContainer, codeToExport, (progress) => {
          // Update progress UI
          if (mp4ExportProgressBar) {
            mp4ExportProgressBar.style.width = `${progress}%`;
          }
          if (mp4ExportPercentage) {
            mp4ExportPercentage.textContent = `${Math.round(progress)}%`;
          }
        });
        
        // Stop recording when animation is complete
        recorder.stop();
        
        // Clean up the temporary editor if it's still in the DOM
        if (document.body.contains(tempEditorContainer)) {
          document.body.removeChild(tempEditorContainer);
        }
      } catch (error) {
        // Make sure to clean up and stop recording on error
        if (document.body.contains(tempEditorContainer)) {
          document.body.removeChild(tempEditorContainer);
        }
        recorder.stop();
        throw error;
      }
    } catch (error) {
      console.error('Error creating MP4:', error);
      alert('An error occurred while creating the MP4. Please try again.');
      
      // Reset UI on error
      if (startMp4ExportBtn) {
        startMp4ExportBtn.disabled = false;
        startMp4ExportBtn.textContent = 'Start Export';
      }
    }
  });
}

// Function to create a temporary editor for the animation
function createTemporaryEditor(container: HTMLElement, code: string, _persona: keyof typeof typingPersonas, _speed: number) {
  // Detect the language from the code
  let language: Extension;
  if (code.includes('def ') || code.includes('import os') || code.includes('__init__')) {
    language = python();
  } else if (code.includes('<!DOCTYPE html>') || code.includes('<html>') || code.includes('<div')) {
    language = html();
  } else {
    // Default to JavaScript/TypeScript
    language = javascript({ typescript: code.includes(': string') || code.includes('interface ') });
  }
  
  const editorState = EditorState.create({
    doc: "",
    extensions: [
      lineNumbers({
        formatNumber: (lineNo) => lineNo.toString().padStart(2, ' ')
      }),
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
      syntaxHighlighter,
      EditorView.editable.of(false),
      language,
      EditorView.theme({
        "&": { 
          height: "100%",
          backgroundColor: "#1e1e1e"
        },
        ".cm-scroller": { backgroundColor: "#1e1e1e" },
        ".cm-gutters": { backgroundColor: "#1e1e1e" },
        ".cm-content": { backgroundColor: "#1e1e1e" }
      })
    ]
  });
  
  return new EditorView({
    state: editorState,
    parent: container
  });
}

// Function to animate the code for video capture
async function animateForVideo(editor: EditorView, container: HTMLElement, code: string, progressCallback: (progress: number) => void) {
  return new Promise<void>((resolve) => {
    let index = 0;
    const totalChars = code.length;
    const fps = 30;
    const frameDelay = 1000 / fps;
    let lastCaptureTime = 0;
    
    // Get selected quality settings
    const selectedQuality = mp4QualitySelect?.value || '4k';
    const qualityConfig = videoQualitySettings[selectedQuality as keyof typeof videoQualitySettings];
    
    // Create an HTML element that can be rendered to canvas
    const renderedEditor = document.createElement('div');
    renderedEditor.style.width = `${captureCanvas.width}px`;
    renderedEditor.style.height = `${captureCanvas.height}px`;
    renderedEditor.style.backgroundColor = '#1e1e1e';
    renderedEditor.style.padding = `${qualityConfig.paddingTop}px`; // Dynamic padding based on resolution
    renderedEditor.style.boxSizing = 'border-box';
    renderedEditor.style.position = 'relative';
    renderedEditor.style.overflow = 'hidden';
    renderedEditor.appendChild(container);
    document.body.appendChild(renderedEditor);
    
    // Variable to track if the element is in the DOM
    let renderedEditorInDOM = true;
    
    // Function to render editor to canvas
    const renderEditorToCanvas = () => {
      if (captureCtx) {
        // Clear the canvas
        captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
        
        try {
          // Enhanced rendering of editor content
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = captureCanvas.width;
          tempCanvas.height = captureCanvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // Set VS Code dark theme background
            tempCtx.fillStyle = '#1e1e1e';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Get editor content
            const lines = editor.state.doc.toString().split('\n');
            
            // Setup proper monospace font matching the editor - size based on resolution
            tempCtx.font = `${qualityConfig.fontBaseSize}px "Consolas", "Courier New", monospace`;
            tempCtx.textBaseline = 'top';
            
            // Add padding to match editor appearance - adjusted for resolution
            const paddingLeft = qualityConfig.paddingLeft;
            const paddingTop = qualityConfig.paddingTop;
            const lineHeight = qualityConfig.lineHeight;
            
            // Draw VS Code editor chrome
            // Left sidebar/gutter
            tempCtx.fillStyle = '#252526'; // Gutter background
            tempCtx.fillRect(0, 0, paddingLeft - qualityConfig.fontBaseSize * 0.7, tempCanvas.height);
            
            // Subtle editor top bar
            tempCtx.fillStyle = '#252526'; // Editor titlebar
            tempCtx.fillRect(0, 0, tempCanvas.width, qualityConfig.paddingTop * 1.2);
            tempCtx.fillStyle = '#cccccc'; 
            tempCtx.font = `${qualityConfig.fontBaseSize * 0.85}px "Segoe UI", sans-serif`;
            tempCtx.textAlign = 'center';
            tempCtx.fillText('CodeTyper.ts - VS Code', tempCanvas.width / 2, qualityConfig.paddingTop * 0.4);
            tempCtx.textAlign = 'left';
            tempCtx.font = `${qualityConfig.fontBaseSize}px "Consolas", "Courier New", monospace`;
            
            // Background for active line
            const currentLine = lines.length - 1;
            tempCtx.fillStyle = 'rgba(33, 66, 131, 0.5)';
            tempCtx.fillRect(paddingLeft - qualityConfig.fontBaseSize * 0.7, paddingTop + currentLine * lineHeight, 
                            tempCanvas.width - paddingLeft + qualityConfig.fontBaseSize * 0.7, lineHeight);
            
            // Bar indicator for active line in gutter
            tempCtx.fillStyle = '#569cd6';
            tempCtx.fillRect(paddingLeft - qualityConfig.fontBaseSize * 0.85, paddingTop + currentLine * lineHeight, 
                            qualityConfig.fontBaseSize * 0.15, lineHeight);
            
            // Draw the line numbers
            for (let i = 0; i < lines.length; i++) {
              tempCtx.fillStyle = i === currentLine ? '#d4d4d4' : '#858585'; // Highlight current line number
              tempCtx.textAlign = 'right';
              tempCtx.fillText(`${i + 1}`, paddingLeft - qualityConfig.fontBaseSize * 0.4, paddingTop + i * lineHeight);
              tempCtx.textAlign = 'left';
            }
            
            // Apply syntax highlighting for each line
            lines.forEach((line, lineIndex) => {
              // Skip empty lines
              if (!line.trim()) return;
              
              let xPos = paddingLeft;
              
              // Detect line indentation
              const indentMatch = line.match(/^(\s+)/);
              const indentCount = indentMatch ? indentMatch[1].length : 0;
              
              // Indentation size based on the resolution
              const indentSize = qualityConfig.fontBaseSize * 0.55;
              
              if (indentCount > 0) {
                // Skip indentation in syntax processing but render it
                xPos += indentSize * indentCount;
              }
              
              // Complex syntax highlighting based on content and language patterns
              if (line.trim().startsWith('import ') || line.trim().startsWith('from ')) {
                // Handle import statements
                const parts = line.trim().split(/\s+/);
                let currentX = paddingLeft + indentSize * indentCount;
                
                // Keyword (import/from)
                tempCtx.fillStyle = '#c586c0'; // Purple for keywords
                tempCtx.fillText(parts[0], currentX, paddingTop + lineIndex * lineHeight);
                currentX += tempCtx.measureText(parts[0] + ' ').width;
                
                // Module name or items
                for (let i = 1; i < parts.length; i++) {
                  // 'from' or braces get special treatment
                  if (parts[i] === 'from' || parts[i] === 'as') {
                    tempCtx.fillStyle = '#c586c0';
                  } 
                  // Module names get string treatment
                  else if (parts[i].startsWith('"') || parts[i].startsWith("'")) {
                    tempCtx.fillStyle = '#ce9178'; // Orange for strings
                  }
                  // Variables/imports get variable treatment
                  else if (!parts[i].match(/[{}(),;]/)) {
                    tempCtx.fillStyle = '#9cdcfe'; // Light blue for variables
                  }
                  // Punctuation
                  else {
                    tempCtx.fillStyle = '#d4d4d4'; // Default for punctuation
                  }
                  
                  tempCtx.fillText(parts[i], currentX, paddingTop + lineIndex * lineHeight);
                  currentX += tempCtx.measureText(parts[i] + ' ').width;
                }
              }
              // Handle keywords and language constructs
              else if (/\b(function|class|const|let|var|if|else|for|while|return|try|catch|export|default|extends|implements|interface|type|enum)\b/.test(line)) {
                // Split line into segments to highlight properly
                let segments = [];
                let currentSegment = '';
                let inString = false;
                let stringChar = '';
                
                // Parse the line character by character for accurate tokenization
                for (let i = 0; i < line.length; i++) {
                  const char = line[i];
                  
                  // Handle string boundaries
                  if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
                    if (!inString) {
                      // Starting a new string
                      if (currentSegment) segments.push({ text: currentSegment, type: 'code' });
                      currentSegment = char;
                      inString = true;
                      stringChar = char;
                    } else if (char === stringChar) {
                      // Ending current string
                      currentSegment += char;
                      segments.push({ text: currentSegment, type: 'string' });
                      currentSegment = '';
                      inString = false;
                    } else {
                      // Different quote inside string
                      currentSegment += char;
                    }
                  } 
                  // Inside a string, just keep building it
                  else if (inString) {
                    currentSegment += char;
                  }
                  // Handle word boundaries for keyword detection
                  else if (/\W/.test(char)) {
                    if (currentSegment) {
                      // Determine if the current segment is a keyword
                      if (/^(function|class|const|let|var|if|else|for|while|return|try|catch|export|default|extends|implements|interface|type|enum)$/.test(currentSegment)) {
                        segments.push({ text: currentSegment, type: 'keyword' });
                      } else {
                        segments.push({ text: currentSegment, type: 'code' });
                      }
                      currentSegment = '';
                    }
                    segments.push({ text: char, type: 'punctuation' });
                  } else {
                    currentSegment += char;
                  }
                }
                
                // Don't forget the last segment
                if (currentSegment) {
                  if (/^(function|class|const|let|var|if|else|for|while|return|try|catch|export|default|extends|implements|interface|type|enum)$/.test(currentSegment)) {
                    segments.push({ text: currentSegment, type: 'keyword' });
                  } else {
                    segments.push({ text: currentSegment, type: 'code' });
                  }
                }
                
                // Render all segments with proper highlighting
                let xOffset = paddingLeft + indentSize * indentCount;
                for (const segment of segments) {
                  switch (segment.type) {
                    case 'keyword':
                      tempCtx.fillStyle = '#569cd6'; // Blue for keywords
                      break;
                    case 'string':
                      tempCtx.fillStyle = '#ce9178'; // Orange for strings
                      break;
                    case 'punctuation':
                      tempCtx.fillStyle = '#d4d4d4'; // Default for punctuation
                      break;
                    case 'code':
                      // Check if it might be a function name (follows "function" keyword)
                      const isFunctionName = segments.findIndex(s => s === segment) > 0 && 
                                             segments[segments.findIndex(s => s === segment) - 1].text === 'function';
                      
                      if (isFunctionName) {
                        tempCtx.fillStyle = '#dcdcaa'; // Yellow for function names
                      } else {
                        tempCtx.fillStyle = '#9cdcfe'; // Light blue for variables
                      }
                      break;
                    default:
                      tempCtx.fillStyle = '#d4d4d4'; // Default
                  }
                  tempCtx.fillText(segment.text, xOffset, paddingTop + lineIndex * lineHeight);
                  xOffset += tempCtx.measureText(segment.text).width;
                }
              }
              // Handle comments
              else if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
                tempCtx.fillStyle = '#6a9955'; // Green for comments
                tempCtx.fillText(line.trimStart(), paddingLeft + indentSize * indentCount, paddingTop + lineIndex * lineHeight);
              }
              // Handle string literals
              else if ((line.includes('"') || line.includes("'")) && !line.trim().startsWith('import')) {
                // Simple string handling - could be improved with more complex parsing
                const parts = [];
                let inString = false;
                let stringStart = 0;
                let stringChar = '';
                
                // Find string boundaries
                for (let i = 0; i < line.length; i++) {
                  if ((line[i] === '"' || line[i] === "'") && (i === 0 || line[i-1] !== '\\')) {
                    if (!inString) {
                      // Start of string - add everything before it
                      if (i > 0) {
                        parts.push({ text: line.substring(0, i), type: 'code' });
                      }
                      stringStart = i;
                      inString = true;
                      stringChar = line[i];
                    } else if (line[i] === stringChar) {
                      // End of string - add the string
                      parts.push({ text: line.substring(stringStart, i + 1), type: 'string' });
                      stringStart = i + 1;
                      inString = false;
                    }
                  }
                }
                
                // Add any remaining text
                if (stringStart < line.length) {
                  parts.push({ text: line.substring(stringStart), type: inString ? 'string' : 'code' });
                }
                
                // Render parts with proper colors
                let xOffset = paddingLeft + indentSize * indentCount;
                for (const part of parts) {
                  tempCtx.fillStyle = part.type === 'string' ? '#ce9178' : '#d4d4d4';
                  tempCtx.fillText(part.text, xOffset, paddingTop + lineIndex * lineHeight);
                  xOffset += tempCtx.measureText(part.text).width;
                }
              }
              // Default rendering for other cases
              else {
                tempCtx.fillStyle = '#d4d4d4'; // Default text color
                tempCtx.fillText(line.trimStart(), paddingLeft + indentSize * indentCount, paddingTop + lineIndex * lineHeight);
              }
            });
            
            // Add cursor at the end of the content
            const lastLine = lines.length - 1;
            const lastLineContent = lines[lastLine] || '';
            const cursorX = paddingLeft + tempCtx.measureText(lastLineContent).width;
            const cursorY = paddingTop + lastLine * lineHeight;
            
            // Draw blinking cursor (visible on even seconds)
            tempCtx.fillStyle = '#ffffff';
            const cursorWidth = Math.max(2, qualityConfig.fontBaseSize * 0.15); // Scale cursor width with font size
            tempCtx.fillRect(cursorX, cursorY, cursorWidth, lineHeight);
            
            // Apply the temp canvas to the main canvas
            captureCtx.drawImage(tempCanvas, 0, 0);
          }
        } catch (e) {
          console.error('Error rendering editor to canvas:', e);
          
          // Fallback: simpler rendering
          captureCtx.font = `${qualityConfig.fontBaseSize}px Consolas, monospace`;
          captureCtx.fillStyle = '#d4d4d4';
          
          // Get content and draw line by line with basic formatting
          const lines = editor.state.doc.toString().split('\n');
          lines.forEach((line, i) => {
            captureCtx.fillText(line, qualityConfig.paddingLeft, qualityConfig.paddingTop * 1.8 + i * qualityConfig.lineHeight);
          });
        }
      }
    };
    
    const animateFrame = (timestamp: number) => {
      // Check if we need to capture a frame
      const shouldCaptureFrame = timestamp - lastCaptureTime >= frameDelay;
      
      if (shouldCaptureFrame && index < totalChars) {
        // Insert next character
        editor.dispatch({
          changes: { from: editor.state.doc.length, insert: code[index] }
        });
        
        // Render the editor to canvas
        renderEditorToCanvas();
        
        // Update progress
        const progress = (index / totalChars) * 100;
        progressCallback(progress);
        
        // Move to next character
        index++;
        lastCaptureTime = timestamp;
      }
      
      if (index < totalChars) {
        requestAnimationFrame(animateFrame);
      } else {
        // Animation complete
        progressCallback(100);
        
        // Render one final frame
        renderEditorToCanvas();
        
        // Safely remove element if it's still in the DOM
        if (renderedEditorInDOM && document.body.contains(renderedEditor)) {
          try {
            document.body.removeChild(renderedEditor);
            renderedEditorInDOM = false;
          } catch (e) {
            console.log('Could not remove editor element:', e);
          }
        }
        
        resolve();
      }
    };
    
    // Start animation
    requestAnimationFrame(animateFrame);
    
    // Handle errors by making sure we clean up
    window.addEventListener('error', () => {
      // Safely remove the element if it exists and is in the DOM
      if (renderedEditorInDOM && document.body.contains(renderedEditor)) {
        try {
          document.body.removeChild(renderedEditor);
        } catch (e) {
          console.log('Element already removed or not found');
        }
        renderedEditorInDOM = false;
      }
    }, { once: true });
  });
}
