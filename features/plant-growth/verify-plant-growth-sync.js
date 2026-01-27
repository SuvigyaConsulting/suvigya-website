#!/usr/bin/env node

/**
 * Plant Growth Animation Sync Verification Script
 * 
 * This script verifies that all files related to the plant growth animation
 * are properly synchronized and ready for parameter configuration.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✓ ${description}: ${filePath}`, 'green');
    return true;
  } else {
    log(`✗ ${description}: ${filePath} (MISSING)`, 'red');
    return false;
  }
}

function checkImport(filePath, importPattern, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    log(`✗ Cannot check import: ${filePath} (FILE MISSING)`, 'red');
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(importPattern)) {
    log(`✓ ${description}: Found in ${filePath}`, 'green');
    return true;
  } else {
    log(`✗ ${description}: Not found in ${filePath}`, 'red');
    return false;
  }
}

function checkPackageJson(dependency, description) {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    log(`✗ package.json not found`, 'red');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (allDeps[dependency]) {
    log(`✓ ${description}: ${dependency}@${allDeps[dependency]}`, 'green');
    return true;
  } else {
    log(`✗ ${description}: ${dependency} (NOT INSTALLED)`, 'red');
    return false;
  }
}

// Main verification
log('\n🌱 Plant Growth Animation Sync Verification\n', 'blue');
log('=' .repeat(50), 'blue');

let allChecks = [];

// Phase 1: File Integrity
log('\n📁 Phase 1: File Integrity Check', 'yellow');
allChecks.push(checkFile('components/OrganicPlantGrowth.tsx', 'Main component'));
allChecks.push(checkFile('lib/plantGrowthConfig.ts', 'Configuration file'));
allChecks.push(checkFile('app/layout.tsx', 'Layout file'));
allChecks.push(checkFile('components/AccessibilityProvider.tsx', 'Accessibility provider'));
allChecks.push(checkFile('package.json', 'Package configuration'));

// Phase 2: Dependency Verification
log('\n📦 Phase 2: Dependency Verification', 'yellow');
allChecks.push(checkPackageJson('gsap', 'GSAP animation library'));
allChecks.push(checkPackageJson('react', 'React framework'));
allChecks.push(checkPackageJson('react-dom', 'React DOM'));

// Phase 3: Integration Verification
log('\n🔗 Phase 3: Integration Verification', 'yellow');
allChecks.push(checkImport('app/layout.tsx', 'OrganicPlantGrowth', 'Component import'));
allChecks.push(checkImport('components/OrganicPlantGrowth.tsx', 'useAccessibility', 'Accessibility hook'));
allChecks.push(checkImport('components/OrganicPlantGrowth.tsx', 'gsap', 'GSAP import'));

// Phase 4: Configuration Readiness
log('\n⚙️  Phase 4: Configuration Readiness', 'yellow');
const plantGrowthPath = path.join(process.cwd(), 'components/OrganicPlantGrowth.tsx');
const configPath = path.join(process.cwd(), 'lib/plantGrowthConfig.ts');

if (fs.existsSync(plantGrowthPath)) {
  const content = fs.readFileSync(plantGrowthPath, 'utf8');
  const hasScrollTrigger = content.includes('ScrollTrigger');
  const hasStemPath = content.includes('generateStemPath');
  const hasBranchSystem = content.includes('branchPoints');
  
  if (hasScrollTrigger) {
    log('✓ ScrollTrigger integration implemented', 'green');
    allChecks.push(true);
  } else {
    log('✗ ScrollTrigger integration not found', 'red');
    allChecks.push(false);
  }
  
  if (hasStemPath) {
    log('✓ Organic stem path generation implemented', 'green');
    allChecks.push(true);
  } else {
    log('✗ Stem path generation not found', 'red');
    allChecks.push(false);
  }
  
  if (hasBranchSystem) {
    log('✓ Branching system implemented', 'green');
    allChecks.push(true);
  } else {
    log('✗ Branching system not found', 'red');
    allChecks.push(false);
  }
}

if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const hasConfigInterface = configContent.includes('PlantGrowthConfig');
  
  if (hasConfigInterface) {
    log('✓ Configuration interface defined', 'green');
    allChecks.push(true);
  } else {
    log('✗ Configuration interface not found', 'red');
    allChecks.push(false);
  }
} else {
  log('✗ Configuration file not found', 'red');
  allChecks.push(false);
}

// Summary
log('\n' + '='.repeat(50), 'blue');
const passed = allChecks.filter(Boolean).length;
const total = allChecks.length;
const percentage = Math.round((passed / total) * 100);

if (percentage === 100) {
  log(`\n✅ All checks passed! (${passed}/${total})`, 'green');
  log('🎉 System is ready for growth model parameters!\n', 'green');
  process.exit(0);
} else {
  log(`\n⚠️  Some checks failed (${passed}/${total} - ${percentage}%)`, 'yellow');
  log('Please review the issues above before proceeding.\n', 'yellow');
  process.exit(1);
}
