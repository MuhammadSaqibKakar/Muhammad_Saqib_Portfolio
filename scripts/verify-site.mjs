import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const pages=readdirSync('.').filter(name=>name.endsWith('.html'));
const errors=[];
const htmlOf=new Map(pages.map(name=>[name,readFileSync(name,'utf8')]));
const localTarget=value=>{
  if(!value||/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value))return null;
  const [pathname,fragment='']=value.split('#');
  return { pathname:decodeURIComponent((pathname||'').split('?')[0]),fragment:decodeURIComponent(fragment) };
};
for(const [name,html] of htmlOf){
  if(!/<!doctype html>/i.test(html))errors.push(name+': missing doctype');
  if(!/<html\s+lang="en"/i.test(html))errors.push(name+': missing document language');
  if(!/<title>.+<\/title>/i.test(html))errors.push(name+': missing title');
  if(!/name="viewport"/i.test(html))errors.push(name+': missing responsive viewport');
  if(!/name="description"/i.test(html))errors.push(name+': missing meta description');
  const h1=(html.match(/<h1\b/g)||[]).length;
  if(h1!==1)errors.push(name+': expected one H1, found '+h1);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  for(const id of ids.filter((x,i)=>ids.indexOf(x)!==i))errors.push(name+': repeated id '+id);
  for(const tag of html.match(/<img\b[^>]*>/g)||[]){
    if(!/\balt="[^"]*"/.test(tag))errors.push(name+': image missing alternative text');
  }
  for(const tag of html.match(/<(?:a|img|script|link)\b[^>]*>/g)||[]){
    const match=tag.match(/\b(?:href|src)="([^"]*)"/);
    if(!match)continue;
    const target=localTarget(match[1]);
    if(!target)continue;
    const pathname=target.pathname || name;
    const rel=pathname.endsWith('/')?pathname+'index.html':pathname;
    if(!existsSync(resolve(dirname(name),rel)))errors.push(name+': missing '+pathname);
    if(target.fragment&&htmlOf.has(rel)){
      const linked=htmlOf.get(rel);
      if(!linked.includes('id="'+target.fragment+'"'))errors.push(name+': missing anchor #'+target.fragment+' in '+rel);
    }
  }
}
for(const name of ['index.html','projects.html','contact.html','certificates.html']){
  const html=htmlOf.get(name)||'';
  if(!html.includes('privacy.html'))errors.push(name+': privacy link missing');
}
if(errors.length){
  console.error('Portfolio validation failed:\n'+errors.map(x=>' - '+x).join('\n'));
  process.exit(1);
}
console.log('Validated '+pages.length+' HTML pages, asset references, headings, links and IDs.');
