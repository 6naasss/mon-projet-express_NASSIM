import fs from 'fs';
import('file:///C:/Users/zouha/OneDrive/Documents/RBcode/src/server.ts').catch(e => {
    fs.writeFileSync('error.json', JSON.stringify({
        message: e.message,
        name: e.name,
        code: e.code,
        url: e.url,
        stack: e.stack
    }, null, 2));
});
