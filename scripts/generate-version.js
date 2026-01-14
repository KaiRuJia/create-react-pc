const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

function getGitInfo() {
  try {
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    const version = execSync('git describe --tags --always', { encoding: 'utf8' }).trim()
    return { commit, branch, version }
  } catch (error) {
    console.log('error', error)
    return { commit: 'unKnown', branch: 'unKnown', version: 'dev'}
  }
}

function formatDateToYYYYMMDDHHmmss(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}${m}${d}${h}${min}${s}`
}

const { commit, branch, version } = getGitInfo()
const buildTime = formatDateToYYYYMMDDHHmmss()
const timestamp = formatDateToYYYYMMDDHHmmss()

const versionInfo = {
  version: `${version}-${timestamp}`,
  commit,
  branch,
  buildTime,
  buildNumber: process.env.BUILD_NUMBER || 'local'
}

const outputPath = path.resolve(__dirname, '../public/version.json')
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
console.log(`✅ Generated version.json: ${versionInfo.version}`);