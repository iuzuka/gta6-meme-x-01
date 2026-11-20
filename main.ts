import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const postJsonPath = path.join(__dirname, 'POST.json');

    const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
    const outputPostJsonPath = path.join(outputDir, 'POST.json');

    await fs.mkdir(outputDir, { recursive: true });
    await fs.copyFile(postJsonPath, outputPostJsonPath);
    console.log('POST.json copied to', outputPostJsonPath);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
