const fs = require('fs');
const path = require('path');

// 1. Update Layout
const layoutPath = path.join(__dirname, 'src', 'app', 'patient', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  content = content.replace(
    '<main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10 w-full min-w-0 mx-auto">',
    '<main className="flex-grow px-6 md:px-8 py-6 md:py-8 w-full min-w-0">'
  );
  fs.writeFileSync(layoutPath, content, 'utf8');
  console.log('Updated Layout');
}

// 2. Update Detection page
const detectionPath = path.join(__dirname, 'src', 'app', 'patient', 'detection', 'page.tsx');
if (fs.existsSync(detectionPath)) {
  let content = fs.readFileSync(detectionPath, 'utf8');
  content = content.replace(
    'className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 bg-[#F7FAFF] min-h-screen p-1"',
    'className="w-full flex flex-col gap-6 animate-in fade-in duration-500"'
  );
  fs.writeFileSync(detectionPath, content, 'utf8');
  console.log('Updated Detection page');
}

// 3. Update Dashboard page
const dashboardPath = path.join(__dirname, 'src', 'app', 'patient', 'dashboard', 'page.tsx');
if (fs.existsSync(dashboardPath)) {
  let content = fs.readFileSync(dashboardPath, 'utf8');
  content = content.replace(
    'className="w-full flex flex-col gap-6 animate-in fade-in duration-500 bg-[#F7FAFF] min-h-screen p-1"',
    'className="w-full flex flex-col gap-6 animate-in fade-in duration-500"'
  );
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('Updated Dashboard page');
}

// 4. Update Profile page
const profilePath = path.join(__dirname, 'src', 'app', 'patient', 'profile', 'page.tsx');
if (fs.existsSync(profilePath)) {
  let content = fs.readFileSync(profilePath, 'utf8');
  content = content.replace(
    'className="flex flex-col gap-6 max-w-4xl mx-auto w-full"',
    'className="flex flex-col gap-6 w-full animate-in fade-in duration-500"'
  );
  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('Updated Profile page');
}
