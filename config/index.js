const path = require('path');

/**
 * Load configuration based on NODE_ENV
 * @returns {Object} Configuration object
 */
function loadConfig() {
  // Get environment from NODE_ENV, default to 'development'
  const env = process.env.NODE_ENV || 'development';
  
  console.log(`📋 Loading configuration for environment: ${env}`);
  
  // Determine which config file to load
  let configFile;
  
  switch (env.toLowerCase()) {
    case 'production':
      configFile = './production.js';
      console.log('✅ Using production configuration');
      break;
      
    case 'staging':
      configFile = './staging.js';
      console.log('✅ Using staging configuration');
      break;
      
    case 'test':
      configFile = './test.js';
      console.log('✅ Using test configuration');
      break;
      
    case 'development':
    default:
      configFile = './development.js';
      console.log('✅ Using development configuration');
      break;
  }
  
  // Load the selected config file
  try {
    const config = require(configFile);
    return config;
  } catch (error) {
    console.error(`❌ Error loading config file: ${configFile}`);
    console.error(error.message);
    
    // Fallback to development config
    console.log('⚠️  Falling back to development configuration');
    return require('./development.js');
  }
}

// Export the loaded configuration
module.exports = loadConfig();
