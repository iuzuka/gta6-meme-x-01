import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const htmlPath = path.join(__dirname, 'composer.html');
    const postJsonPath = path.join(__dirname, 'POST.json');

    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1200, height: 675 }
    });
    const page = await context.newPage();

    await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    });
    await page.waitForTimeout(1000);

    const screenshotPath = path.join(__dirname, 'entry.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
    const outputPostJsonPath = path.join(outputDir, 'POST.json');

    try {
        await fs.mkdir(outputDir, { recursive: true });
        await fs.copyFile(postJsonPath, outputPostJsonPath);
    } catch (err) {
        console.error('Failed to setup output:', err);
        process.exit(1);
    }

    await browser.close();
    console.log('Done');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});