import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../public/projects/', import.meta.url));
mkdirSync(output, { recursive: true });
const rect = (x,y,w,h,fill,rx=12,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const text = (x,y,value,size=18,color='#dbe5f3',weight=500) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${value}</text>`;
const line = (x,y,w) => rect(x,y,w,6,'#314359',3);
const dot = (x,y,color,r=6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const title = (name,kicker) => text(54,72,kicker,13,'#b8c8de',600)+text(54,122,name,38,'#fff',700);
const panel = (x,y,w,h) => rect(x,y,w,h,'#111f32',16,'stroke="#ffffff20"');
const windowFrame = (name,body) => `<g filter="url(#shadow)">${panel(54,158,852,326)}${rect(54,158,852,40,'#1b2b40',16)}${dot(77,178,'#ee8f99',4)}${dot(91,178,'#eac073',4)}${dot(105,178,'#79cdb3',4)}${text(130,184,name,12,'#c8d6e8')}${body}</g>`;
const label = text(744,73,'CONCEPT COVER',12,'#fff',600);
const map = (x,y,w,h,accent) => `<g>${rect(x,y,w,h,'#152e3b')}
 <path d="M${x+10} ${y+h*.7} Q${x+w*.3} ${y+h*.1} ${x+w*.5} ${y+h*.7} T${x+w} ${y+h*.2}" fill="none" stroke="#285a67" stroke-width="30"/>
 <path d="M${x} ${y+h*.3}L${x+w} ${y+h*.8} M${x+w*.2} ${y}L${x+w*.7} ${y+h}" stroke="#547173" stroke-width="2"/>
 <path d="M${x+w*.1} ${y+h*.85}L${x+w*.3} ${y+h*.4}L${x+w*.65} ${y+h*.6}L${x+w*.85} ${y+h*.2}" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="7 6"/>
 ${[.25,.5,.75].map((n,i)=>dot(x+w*n,y+h*(i%2?.35:.65),accent,7)).join('')}</g>`;
function svg(name,kicker,accent,body) {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img"><title>${name} — conceptual project illustration</title><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#122035"/><stop offset="1" stop-color="${accent}" stop-opacity=".65"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dy="12" stdDeviation="16" flood-opacity=".3"/></filter></defs><rect width="960" height="540" fill="#0b1425"/><rect width="960" height="540" fill="url(#bg)"/><g font-family="Arial,Helvetica,sans-serif">${title(name,kicker)}${label}${body}${text(54,516,'ILLUSTRATIVE DESIGN · NOT AN APPLICATION SCREENSHOT',11,'#c2d0e4')}</g></svg>`;
}
const emergency = map(350,214,528,242,'#66d5e8')+
 panel(78,214,250,91)+text(96,244,'Flood advisory',18,'#ffb6a5',700)+text(96,272,'Stay informed. Stay safe.',13)+
 panel(78,321,250,135)+text(96,350,'Emergency response',17,'#fff',600)+
 ['Incident reporting','Community updates','Shelter information'].map((v,i)=>dot(100,377+i*25,'#66d5e8',4)+text(115,382+i*25,v,13)).join('')+
 rect(644,391,211,47,'#183b4b')+text(662,419,'Flood monitoring map',14,'#bceef8');
writeFileSync(output+'resq1.svg',svg('ResQ1','DISASTER EARLY WARNING','#1d5f7a',windowFrame('Emergency response · illustrative overview',emergency)));
const wildlife = map(78,214,507,242,'#8ed5a4')+
 panel(607,214,271,112)+text(627,246,'Ranger field reports',18,'#a9e9bd',600)+text(627,275,'Observe · report · respond',13)+
 panel(607,342,271,114)+text(627,374,'Conservation monitoring',17,'#fff',600)+
 '<path d="M628 432L660 413L698 418L739 391L778 402L817 381L857 392" fill="none" stroke="#8ed5a4" stroke-width="3"/>';
writeFileSync(output+'wildguard.svg',svg('WildGuard.lk','WILDLIFE CONSERVATION','#245d48',windowFrame('Protected landscapes · illustrative overview',wildlife)));
const health = panel(78,214,245,242)+text(98,246,'Care, connected.',21,'#91e6dd',700)+
 rect(98,266,205,63,'#1d3c46')+text(116,293,'Medical services',16,'#fff',600)+text(116,315,'A connected care concept',11)+
 ['Patient services','Care coordination','Distributed systems'].map((v,i)=>line(99,350+i*34,18)+text(132,358+i*34,v,13)).join('')+
 [0,1,2].map((v)=>{const x=345+v*180;return panel(x,214,166,112)+rect(x+18,233,32,32,'#244d56',9)+text(x+18,295,['Appointments','Care teams','Services'][v],16,'#fff',600);}).join('')+
 panel(345,344,526,112)+text(365,375,'Connected healthcare services',18,'#fff',600)+
 [0,1,2].map(i=>rect(365+i*164,395,145,39,'#1c3947',8)+text(380+i*164,420,['Gateway','Services','Data'][i],13)).join('');
writeFileSync(output+'arogya.svg',svg('Arogya','HEALTHCARE · DISTRIBUTED SYSTEMS','#1d686d',windowFrame('Healthcare platform · illustrative overview',health)));
const books = panel(78,214,205,242)+text(98,246,'Your reading space',17,'#dbc9ff',600)+
 ['All books','Want to read','Reading','Completed'].map((v,i)=>text(100,287+i*40,v,14)).join('')+
 text(309,240,'A shelf for every story.',23,'#fff',600)+
 [0,1,2,3].map((n)=>{const x=311+n*143;return rect(x,262,119,145,['#9e7362','#587e8a','#796998','#718868'][n],8)+
 `<path d="M${x+13} 263V406" stroke="#ffffff33" stroke-width="2"/>`+text(x+23,302,['THE','SMALL','QUIET','NEW'][n],13,'#fff',700)+text(x+23,324,['JOURNEY','WONDERS','HOURS','CHAPTERS'][n],12,'#fff',600)+line(x+18,351,77)+text(x,433,['Reading','Want to read','Completed','Reading'][n],12,'#c4cfe0');}).join('');
writeFileSync(output+'library.svg',svg('Personal Library Manager','BOOKS · COLLECTIONS · READING','#5a4478',windowFrame('Personal collection · illustrative overview',books)));
const inventory = panel(78,214,210,242)+text(98,246,'Textile collection',18,'#f2c8c2',600)+
 [0,1,2].map(i=>rect(98+i*55,269,43,137,['#a86680','#558e8a','#ba9067'][i],7)+`<path d="M${108+i*55} 277v120m8-120v120" stroke="#ffffff30" stroke-width="3"/>`).join('')+
 text(315,242,'Inventory overview',22,'#fff',600)+
 rect(311,263,563,33,'#273147',5)+text(327,285,'Collection',12)+text(572,285,'Category',12)+text(748,285,'Availability',12)+
 [0,1,2].map(i=>panel(311,309+i*47,563,38)+text(327,333+i*47,['Silk collection','Cotton collection','Occasion collection'][i],13)+text(572,333+i*47,['Silk','Cotton','Woven'][i],13)+text(748,333+i*47,'Sample record',12,'#d3baa9')).join('');
writeFileSync(output+'textile.svg',svg('Textile Saree Management','TEXTILES · INVENTORY','#714957',windowFrame('Inventory management · illustrative overview',inventory)));
const hrm = panel(78,214,214,242)+text(98,245,'People &amp; teams',18,'#cebcff',600)+
 [0,1,2].map(i=>dot(108,283+i*60,['#987ac7','#6c9fb7','#83ad98'][i],14)+line(136,273+i*60,110)+line(136,288+i*60,76)).join('')+
 [0,1,2].map(i=>panel(312+i*190,214,174,85)+text(331+i*190,245,['Team directory','Attendance','Leave requests'][i],14,'#e2d9ff',600)+line(331+i*190,269,85)).join('')+
 panel(312,316,554,140)+text(332,347,'Workforce overview',17,'#fff',600)+
 [52,72,45,85,65,95,75,88].map((v,i)=>rect(335+i*61,437-v*.7,26,v*.7,i%2?'#7960b3':'#b29add',5)).join('');
writeFileSync(output+'hrm.svg',svg('3S HRM','PROFESSIONAL WORK · CONCEPT ONLY','#4f3b76',windowFrame('Human resources · fictional demonstration data',hrm)));
const crm = text(80,244,'A clear view of every relationship.',23,'#fff',600)+
 [0,1,2].map(i=>panel(78+i*273,267,254,189)+text(96+i*273,296,['New enquiries','In conversation','Follow-up'][i],17,'#bfcffd',600)+
 [0,1].map(j=>rect(95+i*273,313+j*63,220,49,'#23334d',8)+dot(114+i*273,338+j*63,['#8ea6eb','#b19ad7','#77bba6'][i],7)+text(131+i*273,335+j*63,`Sample contact ${i*2+j+1}`,12)+line(131+i*273,344+j*63,102)).join('')).join('');
writeFileSync(output+'crm.svg',svg('Celcius CRM','PROFESSIONAL WORK · CONCEPT ONLY','#344e80',windowFrame('Customer relationships · fictional demonstration data',crm)));
console.log('Created seven local, 16:9 conceptual project covers.');
