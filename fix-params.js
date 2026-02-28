const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    let dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
         filelist = walkSync(dirFile, filelist);
      } else {
         filelist.push(dirFile);
      }
    } catch (err) {}
  });
  return filelist;
}

const files = walkSync('./app/api/admin');
const pageFiles = walkSync('./app/admin');
const allFiles = [...files, ...pageFiles];

allFiles.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix API routes & Page parameters
    if (content.includes('{ params }: { params: { id: string } }')) {
      content = content.replace(
        /\{ params \}: \{ params: \{ id: string \} \}/g, 
        '{ params }: { params: Promise<{ id: string }> }'
      );
      content = content.replace(/params\.id/g, '(await params).id');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content);
      console.log('Fixed', file);
    }
  }
});
