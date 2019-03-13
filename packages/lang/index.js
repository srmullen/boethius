import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import compile from './src/main';

program
    .version("0.0.1")
    .option("-f, --file <file>", "File to parse")
    .option("-i, --indir <indir>", "NOT YET IMPLEMENTED - Directory containing boethius files")
    .option("-o, --outdir <outdir>", "Directory to output html file and assets")
    .parse(process.argv);

const outdir = program.outdir || './';

// If outdir doesn't exist then create it.
if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
}

if (program.file) {
    const bth = fs.readFileSync(program.file, 'utf8');
    const {name} = path.parse(program.file);
    const compiled = compile(bth);

    fs.writeFileSync(path.join(outdir, name + '.json'), JSON.stringify(compiled, null, '\t'));

    console.log(chalk.green('Success!'));
} else if (program.indir) {
    const dir = fs.readdirSync(program.indir);
    console.log("Compiling Directory");
    dir.forEach(item => {
        const fullpath = path.join(program.indir, item);
        if (fs.lstatSync(fullpath).isFile() && path.parse(item).ext === '.bth') {
            const bth = fs.readFileSync(fullpath, 'utf8');
            const {name} = path.parse(item);
            const compiled = compile(bth);

            fs.writeFileSync(path.join(outdir, name + '.json'), JSON.stringify(compiled, null, '\t'));
        }
    });

    console.log(chalk.green('Success!'));
}
