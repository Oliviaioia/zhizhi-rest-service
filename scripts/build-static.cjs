const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'web');
const output = path.join(root, 'dist');

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
fs.copyFileSync(path.join(root, 'shared', 'domain.js'), path.join(output, 'domain.js'));

const mobileSource = path.join(root, 'mobile-web');
const mobileOutput = path.join(output, 'mobile-web');
fs.cpSync(mobileSource, mobileOutput, {
  recursive: true,
  filter: (entry) => !entry.endsWith('.log') && !entry.includes(`${path.sep}app${path.sep}assets`)
});
const mobileStylePath = path.join(mobileOutput, 'app', 'style.css');
const mobileStyle = fs.readFileSync(mobileStylePath, 'utf8')
  .replaceAll("url('./assets/", "url('../../assets/");
fs.writeFileSync(mobileStylePath, mobileStyle, 'utf8');

const indexPath = path.join(output, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8')
  .replaceAll('/web/style.css', './style.css')
  .replaceAll('/shared/domain.js', './domain.js')
  .replaceAll('/web/app.js', './app.js');
fs.writeFileSync(indexPath, index, 'utf8');

const stylePath = path.join(output, 'style.css');
const style = fs.readFileSync(stylePath, 'utf8')
  .replaceAll("url('/web/assets/", "url('./assets/");
fs.writeFileSync(stylePath, style, 'utf8');

fs.writeFileSync(path.join(output, 'CNAME'), 'restservice.tech\n', 'utf8');
fs.writeFileSync(path.join(output, '.nojekyll'), '', 'utf8');

console.log(`Static site built at ${output}`);

