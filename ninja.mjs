import fs from 'fs';
import path from 'path';

// 1. Remove className="mobile-only" from components
const componentsPath = "c:/Programacion/elestudiante/src/components/mobile";
const mobileFiles = fs.readdirSync(componentsPath).filter(f => f.endsWith('.tsx'));

for (const file of mobileFiles) {
    const filePath = path.join(componentsPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('className="mobile-only"')) {
        // Just empty the class instead of removing it entirely to prevent <div > which is valid but <div className=""> is cleaner
        content = content.replace(/className="mobile-only"/g, 'className=""');
        fs.writeFileSync(filePath, content);
        console.log(`Removed mobile-only class from ${file}`);
    }
}

// 2. Wrap <Mobile...> in page.tsx
function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const dirFile = path.join(dir, file);
        const dirent = fs.statSync(dirFile);
        if (dirent.isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (file === 'page.tsx') filelist.push(dirFile);
        }
    }
    return filelist;
}

const pageFiles = walkSync("c:/Programacion/elestudiante/src/app");
for (const page of pageFiles) {
    if (page.includes('eventos\\\\page.tsx') || page.includes('eventos/page.tsx')) continue; // Already did eventos

    let content = fs.readFileSync(page, 'utf8');

    // Find `<MobileSomething ... />`
    // For single line
    const match = content.match(/(\n\s*)(<Mobile[A-Za-z]+\b[^>]*\/>)/);
    if (match) {
        const indent = match[1]; // spaces before
        const component = match[2];

        // Ensure not already wrapped by checking if it contains mobile-only
        if (!content.includes('mobile-only')) {
            const spacesOnly = indent.replace('\n', '');
            const replacement = `${indent}<div className="mobile-only">\n${spacesOnly}    ${component}\n${spacesOnly}</div>`;
            content = content.replace(match[0], replacement);
            fs.writeFileSync(page, content);
            console.log(`Wrapped mobile component in ${page}`);
        }
    }
}

console.log("Ninja path completed!");
