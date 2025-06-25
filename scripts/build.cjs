const fs = require('fs')
const path = require('path')

// Create simple SVG icons for the extension
function createIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#2563eb" rx="4"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">M</text>
  </svg>`
}

// Create icons directory and generate SVG icons
function createIcons() {
  const iconsDir = path.join(__dirname, '../dist/icons')
  
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
  }
  
  const sizes = [16, 32, 48, 128]
  
  sizes.forEach(size => {
    const svg = createIcon(size)
    const filePath = path.join(iconsDir, `icon-${size}.svg`)
    fs.writeFileSync(filePath, svg)
    console.log(`Created icon: ${filePath}`)
  })
}

// Copy static files
function copyStaticFiles() {
  const files = [
    { src: 'manifest.json', dest: 'dist/manifest.json' },
    { src: 'public/welcome.html', dest: 'dist/welcome.html' },
    { src: 'public/demo.html', dest: 'dist/demo.html' },
    { src: 'popup.html', dest: 'dist/popup.html' }
  ]
  
  files.forEach(file => {
    if (fs.existsSync(file.src)) {
      fs.copyFileSync(file.src, file.dest)
      console.log(`Copied: ${file.src} -> ${file.dest}`)
    } else {
      console.warn(`Warning: ${file.src} not found`)
    }
  })
}

// Main build process
function build() {
  console.log('Building Morph Chrome Extension...')
  
  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, '../dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }
  
  // Copy static files
  copyStaticFiles()
  
  // Create icons
  createIcons()
  
  console.log('Build completed!')
  console.log('To load the extension in Chrome:')
  console.log('1. Go to chrome://extensions/')
  console.log('2. Enable "Developer mode"')
  console.log('3. Click "Load unpacked" and select the dist folder')
  console.log('4. Test the extension by opening dist/demo.html in your browser')
}

build() 