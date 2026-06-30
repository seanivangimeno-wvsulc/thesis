const fs = require('fs');

function replaceClassOnLineWithText(content, text, searchClass, replaceClass) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(text)) {
            // Find the closest preceding line with className, or the same line
            let j = i;
            while (j >= 0 && !lines[j].includes('className=')) {
                j--;
            }
            if (j >= 0) {
                // We will just swap out 'text-slate-900' with 'text-blue-600', 'dark:text-white' with 'dark:text-blue-400' etc.
                let newLine = lines[j]
                    .replace('text-slate-900', 'text-blue-600')
                    .replace('text-slate-950', 'text-blue-600')
                    .replace('text-neutral-900', 'text-blue-600')
                    .replace('text-slate-850', 'text-blue-600')
                    .replace('dark:text-white', 'dark:text-blue-400')
                    .replace('dark:text-slate-200', 'dark:text-blue-400')
                    
                    // for the subtext
                    .replace('text-slate-500', 'text-blue-600')
                    .replace('dark:text-slate-400', 'dark:text-blue-400')
                    .replace('text-slate-400', 'text-blue-600')
                    .replace('dark:text-slate-500', 'dark:text-blue-400');
                    
                lines[j] = newLine;
            }
        }
    }
    return lines.join('\n');
}

let appContent = fs.readFileSync('src/pages/App.tsx', 'utf8');

// 1. Dropdown service names
// They are mapped so we just target {service.name} and {service.fullName} maybe?
// Let's just do it directly.
appContent = appContent.replace(/<p className="font-bold text-xs text-slate-950 dark:text-white">\{service\.name\}<\/p>/g, '<p className="font-bold text-xs text-blue-600 dark:text-blue-400">{service.name}</p>');
appContent = appContent.replace(/<p className="font-bold text-\[11px\] leading-tight text-slate-850 dark:text-slate-200">\{service\.name\}<\/p>/g, '<p className="font-bold text-[11px] leading-tight text-blue-600 dark:text-blue-400">{service.name}</p>');

appContent = replaceClassOnLineWithText(appContent, 'Our Core Social Services');
appContent = replaceClassOnLineWithText(appContent, 'MSWDO Tubungan Citizen Charter');
appContent = replaceClassOnLineWithText(appContent, '{translations[language].qualificationsSub}');
appContent = replaceClassOnLineWithText(appContent, '{translations[language].aboutTitle}');
appContent = replaceClassOnLineWithText(appContent, '{translations[language].aboutSub}');
appContent = replaceClassOnLineWithText(appContent, '{translations[language].contactTitle}');
appContent = replaceClassOnLineWithText(appContent, '{translations[language].contactSub}');
appContent = replaceClassOnLineWithText(appContent, 'My Assistance Applications');
appContent = replaceClassOnLineWithText(appContent, 'Check timeline updates and download submitted requirements.');

// 11. Cancel / Delete Application
appContent = appContent.replace(/bg-rose-600 hover:bg-rose-700 text-white(.*?)>(\s*)Cancel \/ Delete Application/g, 'bg-transparent border border-blue-600 hover:bg-blue-50 text-blue-600 dark:text-blue-400$1>$2Cancel / Delete Application');

// 12. + File New Request
appContent = appContent.replace(/bg-blue-700 hover:bg-blue-800 text-white(.*?)>(\s*)\+\s*File New Request/g, 'bg-transparent border border-blue-600 hover:bg-blue-50 text-blue-600 dark:text-blue-400$1>$2+ File New Request');

fs.writeFileSync('src/pages/App.tsx', appContent);

let trackerContent = fs.readFileSync('src/components/ApplicationTracker.tsx', 'utf8');
trackerContent = replaceClassOnLineWithText(trackerContent, '{t.submittedRequests}');
trackerContent = replaceClassOnLineWithText(trackerContent, '{app.controlNumber}');
// Pending Review status style is in getStatusStyle
trackerContent = trackerContent.replace(/const getStatusStyle = \(status: AICSApplication\['status'\]\) => \{\s*switch \(status\) \{\s*case 'Pending Review':\s*return \{ bg: '[^']*', dot: '[^']*' \};/g, `const getStatusStyle = (status: AICSApplication['status']) => {
    switch (status) {
      case 'Pending Review':
        return { bg: 'bg-transparent text-blue-600 dark:text-blue-400 border-blue-500/25', dot: 'bg-blue-500' };`);
        
trackerContent = replaceClassOnLineWithText(trackerContent, '{app.assistanceType} Assistance');
trackerContent = replaceClassOnLineWithText(trackerContent, '&ldquo;{app.justification}&rdquo;');
trackerContent = replaceClassOnLineWithText(trackerContent, '{new Date(app.submissionDate).toLocaleDateString()}');
trackerContent = replaceClassOnLineWithText(trackerContent, '{t.viewDetails}');

fs.writeFileSync('src/components/ApplicationTracker.tsx', trackerContent);
console.log("Done");
