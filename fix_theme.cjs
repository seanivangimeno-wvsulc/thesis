const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/className="([^"]*)"/g, (match, classList) => {
    let classes = classList.split(' ');
    let hasDarkText = classes.some(c => c.startsWith('dark:text-'));
    let hasDarkBg = classes.some(c => c.startsWith('dark:bg-'));
    let hasDarkBorder = classes.some(c => c.startsWith('dark:border-'));

    if (!hasDarkText) {
      if (classes.includes('text-white')) classes.push('dark:text-white', 'text-slate-900');
      if (classes.includes('text-slate-900')) classes.push('dark:text-white');
      if (classes.includes('text-neutral-900')) classes.push('dark:text-white');
      if (classes.includes('text-slate-800')) classes.push('dark:text-slate-100');
      if (classes.includes('text-slate-300')) classes.push('dark:text-slate-300', 'text-slate-600');
      if (classes.includes('text-slate-400')) classes.push('dark:text-slate-400', 'text-slate-500');
      if (classes.includes('text-neutral-700')) classes.push('dark:text-slate-300');
      if (classes.includes('text-neutral-500')) classes.push('dark:text-slate-400');
    }

    if (!hasDarkBg) {
      if (classes.includes('bg-white')) classes.push('dark:bg-slate-900');
      if (classes.includes('bg-slate-900')) classes.push('dark:bg-slate-900', 'bg-white');
      if (classes.includes('bg-slate-50')) classes.push('dark:bg-slate-950');
      if (classes.includes('bg-neutral-50')) classes.push('dark:bg-slate-950');
      if (classes.includes('bg-slate-800')) classes.push('dark:bg-slate-800', 'bg-slate-100');
    }
    
    if (!hasDarkBorder) {
       if (classes.includes('border-slate-800')) classes.push('dark:border-slate-800', 'border-slate-200');
       if (classes.includes('border-slate-200')) classes.push('dark:border-slate-800');
       if (classes.includes('border-neutral-200')) classes.push('dark:border-slate-800');
       if (classes.includes('border-neutral-100')) classes.push('dark:border-slate-800');
       if (classes.includes('border-neutral-300')) classes.push('dark:border-slate-700');
    }

    // Clean up duplicates and contradictions
    let finalClasses = [];
    classes.forEach(c => {
      // If we added text-slate-900 but there's text-white, remove text-white since it's light mode default
      if (c === 'text-white' && classes.includes('text-slate-900')) return;
      if (c === 'bg-slate-900' && classes.includes('bg-white')) return;
      if (c === 'text-slate-300' && classes.includes('text-slate-600')) return;
      if (c === 'text-slate-400' && classes.includes('text-slate-500')) return;
      if (c === 'bg-slate-800' && classes.includes('bg-slate-100')) return;
      if (c === 'border-slate-800' && classes.includes('border-slate-200')) return;
      
      // Preserve gradient styles without touching them
      if (c.includes('bg-gradient') || c.includes('from-') || c.includes('to-') || c.includes('via-')) {
          // If a section is a gradient, we should PROBABLY keep text-white. 
          // So let's re-add it if we removed it! Actually, let's just let it be.
      }
      
      if (!finalClasses.includes(c)) finalClasses.push(c);
    });
    
    // Fix gradients where text should always be white
    if (finalClasses.includes('bg-gradient-to-r') || finalClasses.includes('bg-gradient-to-br')) {
      if (finalClasses.includes('text-slate-900') && finalClasses.includes('dark:text-white')) {
        finalClasses = finalClasses.filter(c => c !== 'text-slate-900' && c !== 'dark:text-white');
        finalClasses.push('text-white');
      }
      if (finalClasses.includes('bg-white') && finalClasses.includes('dark:bg-slate-900')) {
        finalClasses = finalClasses.filter(c => c !== 'bg-white' && c !== 'dark:bg-slate-900');
      }
    }
    
    // Fix navbar, should stay dark blue.
    if (finalClasses.includes('bg-blue-900')) {
      if (finalClasses.includes('text-slate-900')) {
        finalClasses = finalClasses.filter(c => c !== 'text-slate-900' && c !== 'dark:text-white');
        finalClasses.push('text-white');
      }
    }

    return 'className="' + finalClasses.join(' ') + '"';
  });

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/App.tsx',
  'src/components/ServiceCard.tsx',
  'src/components/PortalHeader.tsx',
  'src/components/AuthModal.tsx',
  'src/components/ApplicationTracker.tsx',
  'src/components/AICSApplicationForm.tsx'
];

files.forEach(processFile);
console.log("Done");
