const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const modal = $('#modal');
const modalBody = $('#modalBody');
let activeTimer = null;
let timerMode = 'countdown';
let timerSeconds = 300;
let stopwatchSeconds = 0;
let qrLoaded = false;

$('#year').textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('brainrush-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$('#themeToggle').textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
$('#themeToggle').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem('brainrush-theme', dark ? 'dark' : 'light');
  $('#themeToggle').textContent = dark ? '☀' : '☾';
});

const toolTemplates = {
  calculator:'calculatorTemplate',unit:'unitTemplate',currency:'currencyTemplate',age:'ageTemplate',
  password:'passwordTemplate',text:'textTemplate',percentage:'percentageTemplate',bmi:'bmiTemplate',
  date:'dateTemplate',qr:'qrTemplate',timer:'timerTemplate',random:'randomTemplate',case:'caseTemplate',color:'colorTemplate'
};

$$('.tool-card').forEach(card => card.addEventListener('click', () => openTool(card.dataset.tool)));

function openTool(name){
  const template = document.getElementById(toolTemplates[name]);
  if (!template) return;
  modalBody.replaceChildren(template.content.cloneNode(true));
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  bindTool(name);
  setTimeout(() => $('.modal-close')?.focus(), 0);
}
function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = '';
  if(activeTimer){clearInterval(activeTimer);activeTimer=null;}
}
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !modal.hidden) closeModal(); });

function bindTool(name){
  if(name==='calculator') bindCalculator();
  if(name==='unit') bindUnit();
  if(name==='currency') bindCurrency();
  if(name==='age') bindAge();
  if(name==='password') bindPassword();
  if(name==='text') bindText();
  if(name==='percentage') bindPercentage();
  if(name==='bmi') bindBMI();
  if(name==='date') bindDate();
  if(name==='qr') bindQR();
  if(name==='timer') bindTimer();
  if(name==='random') bindRandom();
  if(name==='case') bindCase();
  if(name==='color') bindColor();
}

function bindCalculator(){
  const display = $('#calcDisplay');
  let expr = '';
  $$('.calc-grid button').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.calc;
    if(key==='clear'){expr='';display.value='0';return;}
    if(key==='back'){expr=expr.slice(0,-1);display.value=expr||'0';return;}
    if(key==='='){
      if(!expr) return;
      try{
        if(!/^[0-9+\-*/%.()\s]+$/.test(expr)) throw new Error();
        const value = Function('"use strict"; return (' + expr.replace(/%/g,'/100') + ')')();
        if(!Number.isFinite(value)) throw new Error();
        expr=String(Math.round(value*1e12)/1e12);display.value=expr;
      }catch{display.value='Error';expr='';}
      return;
    }
    if(expr.length>40) return;
    expr += key;
    display.value=expr;
  }));
}

const units = {
  length:{meter:1,kilometer:1000,centimeter:.01,millimeter:.001,mile:1609.344,yard:.9144,foot:.3048,inch:.0254},
  weight:{kilogram:1,gram:.001,milligram:.000001,pound:.45359237,ounce:.028349523125},
  temperature:{celsius:'c',fahrenheit:'f',kelvin:'k'}
};
function bindUnit(){
  const cat=$('#unitCategory'),from=$('#unitFrom'),to=$('#unitTo'),value=$('#unitValue');
  const labels={length:['meter','kilometer','centimeter','millimeter','mile','yard','foot','inch'],weight:['kilogram','gram','milligram','pound','ounce'],temperature:['celsius','fahrenheit','kelvin']};
  function populate(){
    from.innerHTML='';to.innerHTML='';
    labels[cat.value].forEach((u,i)=>{
      from.add(new Option(u[0].toUpperCase()+u.slice(1),u));
      to.add(new Option(u[0].toUpperCase()+u.slice(1),u));
      if(i===1) to.selectedIndex=1;
    });
    convert();
  }
  function convert(){
    const n=Number(value.value);
    if(!Number.isFinite(n)){ $('#unitResult').textContent='—';return; }
    let out;
    if(cat.value==='temperature') out=tempConvert(n,from.value,to.value);
    else out=n*units[cat.value][from.value]/units[cat.value][to.value];
    $('#unitResult').textContent = Number(out.toFixed(8)).toLocaleString()+' '+to.value;
  }
  function tempConvert(n,a,b){
    let c=a==='celsius'?n:a==='fahrenheit'?(n-32)*5/9:n-273.15;
    return b==='celsius'?c:b==='fahrenheit'?c*9/5+32:c+273.15;
  }
  [cat,from,to,value].forEach(el=>el.addEventListener('input',convert));
  cat.addEventListener('change',populate); populate();
}

function bindCurrency(){
  const from=$('#currencyFrom'),to=$('#currencyTo'),amount=$('#currencyAmount'),result=$('#currencyResult'),status=$('#currencyStatus');
  $('#currencyConvert').addEventListener('click',async()=>{
    const n=Number(amount.value); if(!Number.isFinite(n)||n<0){result.textContent='Enter a valid amount';return;}
    if(from.value===to.value){result.textContent=n.toFixed(2)+' '+to.value;status.textContent='Same currency';return;}
    result.textContent='Loading…';status.textContent='';
    try{
      const res=await fetch('https://api.frankfurter.app/latest?amount='+encodeURIComponent(n)+'&from='+from.value+'&to='+to.value);
      if(!res.ok) throw new Error();
      const data=await res.json();
      result.textContent=Number(data.rates[to.value]).toLocaleString(undefined,{maximumFractionDigits:4})+' '+to.value;
      status.textContent='Rate supplied by Frankfurter.';
    }catch{result.textContent='Unable to load rate';status.textContent='Check your connection and try again.';}
  });
}

function bindAge(){
  const input=$('#birthDate'),now=new Date();
  input.max=now.toISOString().slice(0,10);
  input.value='1990-01-01';
  $('#ageCalculate').addEventListener('click',()=>{
    const birth=new Date(input.value+'T00:00:00');
    if(!input.value||birth>now){$('#ageResult').textContent='Choose a valid date';return;}
    let y=now.getFullYear()-birth.getFullYear(),m=now.getMonth()-birth.getMonth(),d=now.getDate()-birth.getDate();
    if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
    if(m<0){y--;m+=12;}
    const days=Math.floor((now-birth)/86400000);
    $('#ageResult').textContent=y+' years, '+m+' months, '+d+' days';
    $('#ageDays').textContent=days.toLocaleString()+' days lived (approximately)';
  });
}

function bindPassword(){
  const length=$('#passwordLength'),out=$('#passwordOutput');
  const generate=()=>{
    $('#passwordLengthOut').value=length.value;
    const sets=[];
    if($('#passUpper').checked) sets.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
    if($('#passLower').checked) sets.push('abcdefghijkmnopqrstuvwxyz');
    if($('#passNumbers').checked) sets.push('23456789');
    if($('#passSymbols').checked) sets.push('!@#$%^&*_-+=?');
    if(!sets.length){out.value='Select at least one option';return;}
    const all=sets.join('');
    const bytes=new Uint32Array(Number(length.value));crypto.getRandomValues(bytes);
    let result='';
    sets.forEach((set,i)=>result+=set[bytes[i]%set.length]);
    for(let i=result.length;i<Number(length.value);i++) result+=all[bytes[i]%all.length];
    out.value=result.split('').sort(()=>Math.random()-.5).join('');
  };
  length.addEventListener('input',()=>$('#passwordLengthOut').textContent=length.value);
  $('#generatePassword').addEventListener('click',generate);
  $('#copyPassword').addEventListener('click',()=>copyText(out.value,'Password copied'));
  generate();
}

function bindText(){
  const input=$('#textInput');
  const update=()=>{
    const text=input.value;
    const words=text.trim()?text.trim().split(/\s+/).length:0;
    $('#wordCount').textContent=words.toLocaleString();
    $('#charCount').textContent=text.length.toLocaleString();
    $('#lineCount').textContent=text?text.split(/\n/).length:0;
    $('#readTime').textContent=(words?Math.max(1,Math.ceil(words/200)):0)+' min';
  };
  input.addEventListener('input',update);update();
}

function bindPercentage(){
  const update=()=>{
    const a=Number($('#pctA').value),b=Number($('#pctB').value),c=Number($('#pctC').value),d=Number($('#pctD').value);
    $('#pctResult').textContent=Number.isFinite(a*b/100)?(a*b/100).toLocaleString():'—';
    $('#pctResult2').textContent=d?((c/d)*100).toFixed(2)+'%':'—';
  };
  $$('#modal input').forEach(x=>x.addEventListener('input',update));update();
}

function bindBMI(){
  const update=()=>{
    const w=Number($('#bmiWeight').value),h=Number($('#bmiHeight').value)/100;
    if(w<=0||h<=0){$('#bmiResult').textContent='—';return;}
    const bmi=w/(h*h);$('#bmiResult').textContent=bmi.toFixed(1);
    let cat=bmi<18.5?'Underweight':bmi<25?'Normal range':bmi<30?'Overweight':'Obesity';
    $('#bmiCategory').textContent=cat;
  };
  $('#bmiCalculate').addEventListener('click',update);update();
}

function bindDate(){
  const s=$('#dateStart'),e=$('#dateEnd'),now=new Date();
  s.value=now.toISOString().slice(0,10);e.value=now.toISOString().slice(0,10);
  $('#dateCalculate').addEventListener('click',()=>{
    const a=new Date(s.value+'T00:00:00'),b=new Date(e.value+'T00:00:00');
    const days=Math.abs(Math.round((b-a)/86400000));
    $('#dateResult').textContent=days.toLocaleString()+' days';
  });
}

function loadQRLib(){
  return new Promise((resolve,reject)=>{
    if(window.QRCode){resolve();return;}
    const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload=resolve;script.onerror=reject;document.head.appendChild(script);
  });
}
async function bindQR(){
  const text=$('#qrText'),box=$('#qrCode');
  async function generate(){
    box.replaceChildren();
    try{await loadQRLib();new QRCode(box,{text:text.value||'Brain Rush',width:210,height:210,colorDark:'#111827',colorLight:'#ffffff'});}
    catch{box.textContent='QR renderer could not be loaded.';}
  }
  $('#generateQR').addEventListener('click',generate);
  $('#downloadQR').addEventListener('click',()=>{
    const img=box.querySelector('img');
    if(!img){alert('Generate a QR code first.');return;}
    const a=document.createElement('a');a.href=img.src;a.download='brainrush-qr.png';a.click();
  });
  generate();
}

function bindTimer(){
  const display=$('#timerDisplay'),inputs=$('#countdownInputs');
  const render=()=>{
    const total=timerMode==='countdown'?timerSeconds:stopwatchSeconds;
    const m=Math.floor(total/60),s=total%60;
    display.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  };
  $$('.timer-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.timer-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    timerMode=btn.dataset.timerMode;inputs.style.display=timerMode==='countdown'?'flex':'none';
    if(activeTimer){clearInterval(activeTimer);activeTimer=null;}render();
  }));
  $('#timerStart').addEventListener('click',()=>{
    if(activeTimer){clearInterval(activeTimer);activeTimer=null;$('#timerStart').textContent='Resume';return;}
    if(timerMode==='countdown') timerSeconds=Number($('#timerMinutes').value||0)*60+Number($('#timerSeconds').value||0);
    activeTimer=setInterval(()=>{
      if(timerMode==='countdown'){if(timerSeconds<=0){clearInterval(activeTimer);activeTimer=null;alert('Timer finished!');return;}timerSeconds--;}
      else stopwatchSeconds++;
      render();
    },1000);
    $('#timerStart').textContent='Pause';render();
  });
  $('#timerReset').addEventListener('click',()=>{
    if(activeTimer){clearInterval(activeTimer);activeTimer=null;}
    timerSeconds=Number($('#timerMinutes').value||5)*60+Number($('#timerSeconds').value||0);stopwatchSeconds=0;$('#timerStart').textContent='Start';render();
  });
  $('#timerMinutes').addEventListener('input',render);$('#timerSeconds').addEventListener('input',render);render();
}

function bindRandom(){
  $('#randomGenerate').addEventListener('click',()=>{
    let min=Math.ceil(Number($('#randomMin').value)),max=Math.floor(Number($('#randomMax').value));
    if(min>max)[min,max]=[max,min];
    if(!Number.isFinite(min)||!Number.isFinite(max)){return;}
    $('#randomResult').textContent=String(Math.floor(Math.random()*(max-min+1))+min);
  });
}

function bindCase(){
  const input=$('#caseInput'),out=$('#caseOutput');
  $$('.case-actions button').forEach(btn=>btn.addEventListener('click',()=>{
    const t=input.value,mode=btn.dataset.case;
    if(mode==='upper')out.value=t.toUpperCase();
    if(mode==='lower')out.value=t.toLowerCase();
    if(mode==='title')out.value=t.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
    if(mode==='sentence')out.value=t.toLowerCase().replace(/(^|[.!?]\s+)(\w)/g,(m,a,b)=>a+b.toUpperCase());
  }));
  $('#copyCase').addEventListener('click',()=>copyText(out.value,'Result copied'));
}
function bindColor(){
  const input=$('#colorInput');
  const update=()=>{
    const hex=input.value.toUpperCase(),n=parseInt(hex.slice(1),16);
    const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    $('#colorPreview').style.background=hex;$('#hexValue').textContent=hex;$('#rgbValue').textContent='rgb('+r+', '+g+', '+b+')';
  };
  input.addEventListener('input',update);
  $('#copyHex').addEventListener('click',()=>copyText($('#hexValue').textContent,'HEX copied'));
  $('#copyRgb').addEventListener('click',()=>copyText($('#rgbValue').textContent,'RGB copied'));update();
}
async function copyText(value,message){
  if(!value)return;
  try{await navigator.clipboard.writeText(value);alert(message);}
  catch{alert(value);}
}

$('#toolSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();let visible=0;
  $$('.tool-card').forEach(card=>{
    const ok=!q||(card.dataset.tool+' '+card.dataset.keywords+' '+card.textContent).toLowerCase().includes(q);
    card.hidden=!ok;if(ok)visible++;
  });
  $('#noResults').hidden=visible!==0;
});
$('#randomTool').addEventListener('click',()=>{
  const cards=$$('.tool-card');cards[Math.floor(Math.random()*cards.length)].click();
});
