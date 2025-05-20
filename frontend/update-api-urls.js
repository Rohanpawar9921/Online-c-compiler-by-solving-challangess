// update-api-urls.js
// This script updates all API calls in the frontend to use the config.js API_URL

const fs = require('fs');
const path = require('path');

// Components directory
const componentsDir = path.join(__dirname, 'src', 'components');

// List of components with API calls
const componentsToUpdate = [
  'AuthForm.js',
  'ChallengeBrowser.js',
  'Compiler.js',
  'ProgressDashboard.js'
];

// Add the import statement to each component
componentsToUpdate.forEach(componentFile => {
  const filePath = path.join(componentsDir, componentFile);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if it doesn't exist
    if (!content.includes("import API_URL from '../config'")) {
      content = content.replace(
        /import (.*) from ['"](.*)['"];/,
        (match) => `${match}\nimport API_URL from '../config';`
      );
    }
      // Replace hardcoded URLs with API_URL
    content = content.replace(
      /(['"`])http:\/\/localhost:5000(\/[^'"`]*)?(['"`])/g,
      (match, start, endpoint, end) => {
        return `${start}\${API_URL}${endpoint || ''}${end}`;
      }
    );
    
    // Replace direct API calls with API_URL
    content = content.replace(
      /(['"`])(\/api\/[^'"`]*|\/login|\/register)(['"`])/g,
      (match, start, endpoint, end) => {
        if (content.includes('`${API_URL}')) {
          return match; // Already updated
        }
        return `${start}\${API_URL}${endpoint}${end}`;
      }
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${componentFile}`);
  } else {
    console.log(`File not found: ${componentFile}`);
  }
});

console.log('API URL updates completed!');
