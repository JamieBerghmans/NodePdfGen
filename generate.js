import { readdirSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Argument parsing ---
const args = process.argv.slice(2);

const getArg = (flag, short, def = undefined) => {
    const longIdx  = args.indexOf(`--${flag}`);
    const shortIdx = short ? args.indexOf(`-${short}`) : -1;
    const idx = longIdx !== -1 ? longIdx : shortIdx;
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('-')) return args[idx + 1];
    const prefixed = args.find(a => a.startsWith(`--${flag}=`));
    if (prefixed) return prefixed.split('=').slice(1).join('=');
    return def;
};

const getBoolArg = (flag) => args.includes(`--${flag}`);

// Collect truly positional args (exclude values of named flags)
const flagsWithValues = new Set(['--template', '-t', '--device', '-d', '--lang', '-l', '--year', '-y', '--start-sprint']);
const positional = [];
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
        if (flagsWithValues.has(args[i])) i++; // skip the value of this named flag
    } else {
        positional.push(args[i]);
    }
}

const template   = getArg('template', 't')  || positional[0];
const device     = getArg('device', 'd')    || positional[1] || 'boox-note-air';
const lang       = getArg('lang', 'l')      || positional[2] || 'en';
const year       = getArg('year', 'y')      || positional[3] || String(new Date().getFullYear());
const startSprint = getArg('start-sprint')  || '1';
const noOpen     = getBoolArg('no-open');

// --- Validate template ---
if (!template) {
    const templates = readdirSync(join(__dirname, 'templates')).filter(f => !f.startsWith('.'));
    const devices   = readdirSync(join(__dirname, 'devices')).filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
    console.error('Error: --template is required\n');
    console.error(`Usage: node generate.js --template <name> [--device <device>] [--lang <lang>] [--year <year>] [--no-open]`);
    console.error(`       node generate.js <template> [device] [lang] [year]\n`);
    console.error(`Available templates: ${templates.join(', ')}`);
    console.error(`Available devices:   ${devices.join(', ')}`);
    console.error(`Example: node generate.js --template gratitude --device ipad-pro --lang nl --year 2026`);
    process.exit(1);
}

// --- Load device config ---
let deviceConfig;
try {
    const mod = await import(`./devices/${device}.js`);
    deviceConfig = mod.default;
} catch {
    const deviceFiles = readdirSync(join(__dirname, 'devices'))
        .filter(f => f.endsWith('.js'))
        .map(f => f.replace('.js', ''));
    console.error(`Unknown device: "${device}"`);
    console.error(`Available devices: ${deviceFiles.join(', ')}`);
    process.exit(1);
}

// --- Ensure outputs directory exists ---
const outputDir = join(__dirname, 'outputs');
mkdirSync(outputDir, { recursive: true });

const outputPath = `outputs/${template}-${device}-${lang}.pdf`;

// --- Pass config to template via environment variables ---
process.env.PDF_PAGE_WIDTH   = String(deviceConfig.pageWidth);
process.env.PDF_PAGE_HEIGHT  = String(deviceConfig.pageHeight);
process.env.PDF_LANG         = lang;
process.env.PDF_YEAR         = year;
process.env.PDF_OPEN         = noOpen ? '0' : '1';
process.env.PDF_TEMPLATE     = template;
process.env.PDF_DEVICE       = device;
process.env.PDF_OUTPUT_PATH  = outputPath;
process.env.PDF_START_SPRINT = startSprint;

console.log(`Generating "${template}" | Device: ${deviceConfig.name} (${deviceConfig.pageWidth}×${deviceConfig.pageHeight}pt) | Language: ${lang} | Year: ${year}`);

// --- Run the template ---
try {
    await import(`./templates/${template}/index.js`);
} catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND' && e.message.includes(template)) {
        const templates = readdirSync(join(__dirname, 'templates')).filter(f => !f.startsWith('.'));
        console.error(`\nUnknown template: "${template}"`);
        console.error(`Available templates: ${templates.join(', ')}`);
        process.exit(1);
    }
    throw e;
}
