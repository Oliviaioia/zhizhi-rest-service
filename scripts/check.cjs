const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
let count=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name==='node_modules'||e.name.startsWith('.'))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(js|cjs)$/.test(p)){cp.execFileSync(process.execPath,['--check',p]);count++;}else if(p.endsWith('.json'))JSON.parse(fs.readFileSync(p,'utf8'));}}
walk(root);const a=fs.readFileSync(path.join(root,'shared/domain.js'),'utf8'),b=fs.readFileSync(path.join(root,'miniprogram/utils/domain.js'),'utf8');if(a!==b)throw Error('两端业务逻辑不一致');console.log(`${count} JavaScript files passed syntax checks; JSON and shared module verified.`);
