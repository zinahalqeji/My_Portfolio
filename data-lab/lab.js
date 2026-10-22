"use strict";
const $ = id => document.getElementById(id);
const sek = n => new Intl.NumberFormat('en-SE',{maximumFractionDigits:0}).format(n);
let source = [];
function parseCSV(text) {
 const [head,...lines] = text.trim().split(/\r?\n/);
 const keys = head.split(',');
 return lines.filter(Boolean).map(line => { const values=line.split(',');const row=Object.fromEntries(keys.map((k,i)=>[k,values[i]]));for(const k of ['order_id','quantity','unit_price_sek','revenue_sek'])row[k]=Number(row[k]);return row; });
}
function optionize(id,values){for(const value of values.sort()) {const el=document.createElement('option');el.value=value;el.textContent=value;$(id).append(el);}}
function render(){
 const year=$('year').value,region=$('region').value,category=$('category').value;
 const data=source.filter(r=>(year==='all'||r.order_date.slice(0,4)===year)&&(region==='all'||r.region===region)&&(category==='all'||r.category===category));
 const revenue=data.reduce((s,r)=>s+r.revenue_sek,0),units=data.reduce((s,r)=>s+r.quantity,0);
 $('revenue').textContent=sek(revenue)+' kr';$('orders').textContent=sek(data.length);$('units').textContent=sek(units);$('aov').textContent=sek(data.length?revenue/data.length:0)+' kr';
 $('status').textContent=`Showing ${data.length} of ${source.length} synthetic orders`;
 const monthly=new Map();for(const r of data){const m=r.order_date.slice(0,7);monthly.set(m,(monthly.get(m)||0)+r.revenue_sek);}
 const points=[...monthly].sort(([a],[b])=>a.localeCompare(b));const max=Math.max(1,...points.map(p=>p[1]));
 const w=720,h=255,pad=35,plotH=185,barW=Math.max(3,(w-2*pad)/Math.max(points.length,1)*.7);
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${pad}" x2="${w-pad}" y1="${h-pad-t*plotH}" y2="${h-pad-t*plotH}" stroke="#27485a" stroke-dasharray="3 5"/>`).join('');
 const bars=points.map(([month,val],i)=>{const step=(w-2*pad)/points.length;const x=pad+i*step+(step-barW)/2;const ht=val/max*plotH;return `<rect x="${x}" y="${h-pad-ht}" width="${barW}" height="${ht}" rx="3" fill="#36c6e6"><title>${month}: ${sek(val)} SEK</title></rect>`;}).join('');
 const labels=points.filter((_,i)=>i%Math.max(1,Math.ceil(points.length/6))===0).map(([m],i)=>{const index=points.findIndex(p=>p[0]===m),step=(w-2*pad)/points.length;return `<text x="${pad+(index+.5)*step}" y="${h-12}" text-anchor="middle" fill="#9bbdcd" font-size="12">${m}</text>`;}).join('');
 $('trend').innerHTML=points.length?`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${grid}${bars}${labels}</svg>`:'<p>No data for this selection.</p>';
 const cats=new Map();for(const r of data)cats.set(r.category,(cats.get(r.category)||0)+r.revenue_sek);
 const ordered=[...cats].sort((a,b)=>b[1]-a[1]);const catMax=Math.max(1,...ordered.map(p=>p[1]));
 $('categories').replaceChildren();for(const [name,value] of ordered){const item=document.createElement('div');const label=document.createElement('div');label.className='bar-label';const nameSpan=document.createElement('span');nameSpan.textContent=name;const amount=document.createElement('span');amount.textContent=sek(value)+' kr';label.append(nameSpan,amount);const track=document.createElement('div');track.className='bar-track';const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=(value/catMax*100)+'%';track.append(fill);item.append(label,track);$('categories').append(item);}
 if(!ordered.length)$('categories').textContent='No data for this selection.';
 $('records').replaceChildren();for(const r of data.slice(0,12)){const tr=document.createElement('tr');for(const value of [r.order_id,r.order_date,r.region,r.category,r.quantity,sek(r.revenue_sek)]){const td=document.createElement('td');td.textContent=value;tr.append(td);}$('records').append(tr);}
}
fetch('data-lab/orders.csv').then(r=>{if(!r.ok)throw new Error('CSV not found');return r.text()}).then(text=>{source=parseCSV(text);optionize('year',[...new Set(source.map(r=>r.order_date.slice(0,4)))]);optionize('region',[...new Set(source.map(r=>r.region))]);optionize('category',[...new Set(source.map(r=>r.category))]);['year','region','category'].forEach(id=>$(id).addEventListener('change',render));$('reset').addEventListener('click',()=>{['year','region','category'].forEach(id=>$(id).value='all');render();});render();}).catch(e=>{$('status').textContent='Could not load demo data. Open this site via GitHub Pages or a local web server (not file://).';console.error(e);});
