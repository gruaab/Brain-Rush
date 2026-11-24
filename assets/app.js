const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const modal = $('#modal');
const modalBody = $('#modalBody');
let activeTimer = null;
let timerMode = 'countdown';
let timerSeconds = 300;
let stopwatchSeconds = 0;
let qrLoaded = false;

const translations = {
  en: {
    "Tools":"Tools","About":"About","Privacy":"Privacy","Search tools...":"Search tools...",
    "FREE • FAST • USEFUL":"FREE • FAST • USEFUL","Everyday tools.":"Everyday tools.","One smart place.":"One smart place.",
    "Calculate, convert, generate and solve everyday tasks in seconds. No account required.":"Calculate, convert, generate and solve everyday tasks in seconds. No account required.",
    "Explore tools":"Explore tools","Surprise me":"Surprise me","Get things done.":"Get things done.",
    "Simple tools with zero friction.":"Simple tools with zero friction.","tools":"tools","signups":"signups","uses":"uses",
    "TOOLBOX":"TOOLBOX","What do you need?":"What do you need?","No tools matched your search.":"No tools matched your search.",
    "⚡ Fast":"⚡ Fast","Built for instant results.":"Built for instant results.","🔒 Private":"🔒 Private","Most tools run in your browser.":"Most tools run in your browser.",
    "📱 Responsive":"📱 Responsive","Works on phones and desktops.":"Works on phones and desktops.","🌍 Free":"🌍 Free","No account required.":"No account required.",
    "WHY BRAIN RUSH?":"WHY BRAIN RUSH?","Useful beats complicated.":"Useful beats complicated.",
    "Brain Rush brings small tools together so you do not have to search the web for a different calculator every time. The interface is intentionally simple, fast and mobile-friendly.":"Brain Rush brings small tools together so you do not have to search the web for a different calculator every time. The interface is intentionally simple, fast and mobile-friendly.",
    "✓ No sign-up":"✓ No sign-up","✓ Browser-first":"✓ Browser-first","✓ Responsive":"✓ Responsive","✓ Free to use":"✓ Free to use",
    "PRIVACY":"PRIVACY","Simple by design.":"Simple by design.","Common calculations happen locally in your browser and no account is required. The Currency tool contacts a public exchange-rate service when you request a rate.":"Common calculations happen locally in your browser and no account is required. The Currency tool contacts a public exchange-rate service when you request a rate.",
    "As Brain Rush grows, this section can be expanded with the final privacy policy, analytics disclosure and advertising information.":"As Brain Rush grows, this section can be expanded with the final privacy policy, analytics disclosure and advertising information.",
    "Built for everyday life.":"Built for everyday life.","Length":"Length","Weight":"Weight","Temperature":"Temperature",
    "Value":"Value","From":"From","To":"To","Result":"Result","Amount":"Amount","Convert":"Convert","Converted amount":"Converted amount",
    "Date of birth":"Date of birth","Calculate age":"Calculate age","Your age":"Your age","Uppercase":"Uppercase","Lowercase":"Lowercase",
    "Numbers":"Numbers","Symbols":"Symbols","Generate new password":"Generate new password","Paste or type your text here...":"Paste or type your text here...",
    "Words":"Words","Characters":"Characters","Lines":"Lines","Reading time":"Reading time","What is":"What is","is what % of":"is what % of",
    "Weight (kg)":"Weight (kg)","Height (cm)":"Height (cm)","Calculate BMI":"Calculate BMI","BMI":"BMI",
    "Start date":"Start date","End date":"End date","Calculate difference":"Calculate difference","Difference":"Difference",
    "Text or URL":"Text or URL","Generate":"Generate","Download PNG":"Download PNG","Countdown":"Countdown","Stopwatch":"Stopwatch",
    "Start":"Start","Pause":"Pause","Resume":"Resume","Reset":"Reset","Minimum":"Minimum","Maximum":"Maximum",
    "UPPERCASE":"UPPERCASE","lowercase":"lowercase","Title Case":"Title Case","Sentence case":"Sentence case","Copy result":"Copy result",
    "Pick a color and copy HEX or RGB values.":"Pick a color and copy HEX or RGB values.","HEX":"HEX","RGB":"RGB",
    "Quick everyday math":"Quick everyday math","Length, weight & temperature":"Length, weight & temperature","Live exchange rates":"Live exchange rates",
    "Exact age from a birthday":"Exact age from a birthday","Create strong passwords":"Create strong passwords","Words, characters & lines":"Words, characters & lines",
    "Percent calculations made easy":"Percent calculations made easy","Body mass index":"Body mass index","Days between two dates":"Days between two dates",
    "Create a QR code":"Create a QR code","Focus, cook or exercise":"Focus, cook or exercise","Pick a number instantly":"Pick a number instantly",
    "UPPER, lower & Title Case":"UPPER, lower & Title Case","Pick and copy colors":"Pick and copy colors",
    "Fast arithmetic without leaving the page.":"Fast arithmetic without leaving the page.","Convert length, weight and temperature.":"Convert length, weight and temperature.",
    "Current rates from the Frankfurter public API.":"Current rates from the Frankfurter public API.","Find exact age in years, months and days.":"Find exact age in years, months and days.",
    "Create a strong random password locally.":"Create a strong random password locally.","Count words, characters, lines and reading time.":"Count words, characters, lines and reading time.",
    "Handle common percentage questions quickly.":"Handle common percentage questions quickly.","Calculate body mass index using metric units.":"Calculate body mass index using metric units.",
    "Find the number of days between dates.":"Find the number of days between dates.","Turn text or a URL into a downloadable QR code.":"Turn text or a URL into a downloadable QR code.",
    "A simple focus timer and stopwatch.":"A simple focus timer and stopwatch.","Generate a random integer between two values.":"Generate a random integer between two values.",
    "Convert text to upper, lower, title or sentence case.":"Convert text to upper, lower, title or sentence case.","Pick a color and copy HEX or RGB values.":"Pick a color and copy HEX or RGB values.",
    "Calculator":"Calculator","Unit Converter":"Unit Converter","Currency Converter":"Currency Converter","Age Calculator":"Age Calculator",
    "Password Generator":"Password Generator","Text Counter":"Text Counter","Percentage Calculator":"Percentage Calculator","BMI Calculator":"BMI Calculator",
    "Date Difference":"Date Difference","QR Code Generator":"QR Code Generator","Timer & Stopwatch":"Timer & Stopwatch","Random Number":"Random Number",
    "Case Converter":"Case Converter","Color Picker":"Color Picker","Copy":"Copy","Category":"Category","Strong password":"Strong password",
    "Your age":"Your age","Current rate":"Current rate","Underweight":"Underweight","Normal range":"Normal range","Overweight":"Overweight","Obesity":"Obesity",
    "Timer finished!":"Timer finished!","Generate a QR code first.":"Generate a QR code first.","QR renderer could not be loaded.":"QR renderer could not be loaded.",
    "Result copied":"Result copied","HEX copied":"HEX copied","RGB copied":"RGB copied"
  },
  tr: {
    "Tools":"Araçlar","About":"Hakkında","Privacy":"Gizlilik","Search tools...":"Araçlarda ara...",
    "FREE • FAST • USEFUL":"ÜCRETSİZ • HIZLI • KULLANIŞLI","Everyday tools.":"Günlük araçlar.","One smart place.":"Tek akıllı yerde.",
    "Calculate, convert, generate and solve everyday tasks in seconds. No account required.":"Hesapla, dönüştür, oluştur ve günlük işlerini saniyeler içinde çöz. Üyelik gerekmez.",
    "Explore tools":"Araçları keşfet","Surprise me":"Beni şaşırt","Get things done.":"İşlerini hallet.",
    "Simple tools with zero friction.":"Sade, hızlı ve zahmetsiz araçlar.","tools":"araç","signups":"kayıt","uses":"kullanım",
    "TOOLBOX":"ARAÇ KUTUSU","What do you need?":"Neye ihtiyacın var?","No tools matched your search.":"Aramanızla eşleşen araç bulunamadı.",
    "⚡ Fast":"⚡ Hızlı","Built for instant results.":"Anında sonuç için tasarlandı.","🔒 Private":"🔒 Gizli","Most tools run in your browser.":"Çoğu araç tarayıcınızda çalışır.",
    "📱 Responsive":"📱 Mobil Uyumlu","Works on phones and desktops.":"Telefon ve bilgisayarlarda çalışır.","🌍 Free":"🌍 Ücretsiz","No account required.":"Üyelik gerekmez.",
    "WHY BRAIN RUSH?":"NEDEN BRAIN RUSH?","Useful beats complicated.":"Karmaşıklık yerine kullanışlılık.",
    "Brain Rush brings small tools together so you do not have to search the web for a different calculator every time. The interface is intentionally simple, fast and mobile-friendly.":"Brain Rush, her seferinde farklı bir hesap makinesi aramanıza gerek kalmaması için kullanışlı araçları tek yerde toplar. Arayüz özellikle sade, hızlı ve mobil uyumlu tasarlandı.",
    "✓ No sign-up":"✓ Üyelik yok","✓ Browser-first":"✓ Tarayıcı öncelikli","✓ Responsive":"✓ Mobil uyumlu","✓ Free to use":"✓ Ücretsiz kullanım",
    "PRIVACY":"GİZLİLİK","Simple by design.":"Sadelik önceliğimiz.","Common calculations happen locally in your browser and no account is required. The Currency tool contacts a public exchange-rate service when you request a rate.":"Yaygın hesaplamalar tarayıcınızda yerel olarak yapılır ve üyelik gerekmez. Para birimi aracı kur istediğinizde herkese açık bir döviz kuru servisine bağlanır.",
    "As Brain Rush grows, this section can be expanded with the final privacy policy, analytics disclosure and advertising information.":"Brain Rush büyüdükçe bu bölüm kapsamlı gizlilik politikası, analiz ve reklam bilgilendirmeleriyle genişletilebilir.",
    "Built for everyday life.":"Günlük hayat için tasarlandı.","Length":"Uzunluk","Weight":"Ağırlık","Temperature":"Sıcaklık",
    "Value":"Değer","From":"Kaynak","To":"Hedef","Result":"Sonuç","Amount":"Miktar","Convert":"Dönüştür","Converted amount":"Dönüştürülen miktar",
    "Date of birth":"Doğum tarihi","Calculate age":"Yaşı hesapla","Your age":"Yaşınız","Uppercase":"Büyük harf","Lowercase":"Küçük harf",
    "Numbers":"Rakamlar","Symbols":"Semboller","Generate new password":"Yeni şifre oluştur","Paste or type your text here...":"Metninizi buraya yapıştırın veya yazın...",
    "Words":"Kelime","Characters":"Karakter","Lines":"Satır","Reading time":"Okuma süresi","What is":"Nedir","is what % of":"hangi yüzde?",
    "Weight (kg)":"Ağırlık (kg)","Height (cm)":"Boy (cm)","Calculate BMI":"VKİ hesapla","BMI":"VKİ",
    "Start date":"Başlangıç tarihi","End date":"Bitiş tarihi","Calculate difference":"Farkı hesapla","Difference":"Fark",
    "Text or URL":"Metin veya URL","Generate":"Oluştur","Download PNG":"PNG indir","Countdown":"Geri sayım","Stopwatch":"Kronometre",
    "Start":"Başlat","Pause":"Duraklat","Resume":"Devam et","Reset":"Sıfırla","Minimum":"Minimum","Maximum":"Maksimum",
    "UPPERCASE":"BÜYÜK HARF","lowercase":"küçük harf","Title Case":"Başlık Biçimi","Sentence case":"Cümle biçimi","Copy result":"Sonucu kopyala",
    "Pick a color and copy HEX or RGB values.":"Bir renk seçin ve HEX veya RGB değerini kopyalayın.","HEX":"HEX","RGB":"RGB",
    "Quick everyday math":"Hızlı günlük matematik","Length, weight & temperature":"Uzunluk, ağırlık ve sıcaklık","Live exchange rates":"Güncel döviz kurları",
    "Exact age from a birthday":"Doğum tarihinden tam yaş","Create strong passwords":"Güçlü şifreler oluşturun","Words, characters & lines":"Kelime, karakter ve satır sayısı",
    "Percent calculations made easy":"Yüzde hesaplamalarını kolaylaştırın","Body mass index":"Vücut kitle indeksi","Days between two dates":"İki tarih arasındaki günler",
    "Create a QR code":"QR kod oluşturun","Focus, cook or exercise":"Odaklanın, yemek yapın veya egzersiz yapın","Pick a number instantly":"Anında bir sayı seçin",
    "UPPER, lower & Title Case":"BÜYÜK, küçük ve Başlık Biçimi","Pick and copy colors":"Renk seçin ve kopyalayın",
    "Fast arithmetic without leaving the page.":"Sayfadan ayrılmadan hızlı matematik.","Convert length, weight and temperature.":"Uzunluk, ağırlık ve sıcaklığı dönüştürün.",
    "Current rates from the Frankfurter public API.":"Frankfurter herkese açık API'sinden güncel kurlar.","Find exact age in years, months and days.":"Yıl, ay ve gün olarak tam yaşınızı bulun.",
    "Create a strong random password locally.":"Tarayıcıda güçlü ve rastgele bir şifre oluşturun.","Count words, characters, lines and reading time.":"Kelime, karakter, satır ve okuma süresini sayın.",
    "Handle common percentage questions quickly.":"Yaygın yüzde hesaplamalarını hızlıca yapın.","Calculate body mass index using metric units.":"Metrik birimlerle vücut kitle indeksini hesaplayın.",
    "Find the number of days between dates.":"İki tarih arasındaki gün sayısını bulun.","Turn text or a URL into a downloadable QR code.":"Metin veya URL'yi indirilebilir QR koduna dönüştürün.",
    "A simple focus timer and stopwatch.":"Basit bir odak sayacı ve kronometre.","Generate a random integer between two values.":"İki değer arasında rastgele tam sayı üretin.",
    "Convert text to upper, lower, title or sentence case.":"Metni büyük, küçük, başlık veya cümle biçimine dönüştürün.","Pick a color and copy HEX or RGB values.":"Bir renk seçin ve HEX veya RGB değerlerini kopyalayın.",
    "Calculator":"Hesap Makinesi","Unit Converter":"Birim Dönüştürücü","Currency Converter":"Para Birimi Dönüştürücü","Age Calculator":"Yaş Hesaplama",
    "Password Generator":"Şifre Oluşturucu","Text Counter":"Metin Sayacı","Percentage Calculator":"Yüzde Hesaplama","BMI Calculator":"VKİ Hesaplama",
    "Date Difference":"Tarih Farkı","QR Code Generator":"QR Kod Oluşturucu","Timer & Stopwatch":"Sayaç ve Kronometre","Random Number":"Rastgele Sayı",
    "Case Converter":"Büyük/Küçük Harf Dönüştürücü","Color Picker":"Renk Seçici","Copy":"Kopyala","Category":"Kategori","Strong password":"Güçlü şifre",
    "Current rate":"Güncel kur","Underweight":"Zayıf","Normal range":"Normal aralık","Overweight":"Fazla kilolu","Obesity":"Obezite",
    "Timer finished!":"Sayaç tamamlandı!","Generate a QR code first.":"Önce bir QR kod oluşturun.","QR renderer could not be loaded.":"QR oluşturucu yüklenemedi.",
    "Result copied":"Sonuç kopyalandı","HEX copied":"HEX kopyalandı","RGB copied":"RGB kopyalandı"
  }
};

function t(value){
  const lang=localStorage.getItem('brainrush-language')||'en';
  return (translations[lang]&&translations[lang][value])||value;
}

function translateRoot(root=document){
  const lang=localStorage.getItem('brainrush-language')||'en';
  const dict=translations[lang]||translations.en;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    const key=node.nodeValue.trim();
    if(dict[key] && node.nodeValue.trim()===key) node.nodeValue=node.nodeValue.replace(key,dict[key]);
  });
  $('input[placeholder], textarea[placeholder]',root).forEach(el=>{
    const key=el.getAttribute('placeholder');
    if(dict[key]) el.setAttribute('placeholder',dict[key]);
  });
  $('button',root).forEach(el=>{
    const key=el.getAttribute('data-label-key');
    if(key && dict[key]) el.textContent=dict[key];
  });
}

function setLanguage(lang){
  localStorage.setItem('brainrush-language',lang);
  document.documentElement.lang=lang;
  translateRoot(document);
  $('#languageSelect').value=lang;
  if(!modal.hidden) {
    const active=document.querySelector('.tool-card.active-tool');
    // Re-translate the currently open modal without rebuilding its state.
    translateRoot(modalBody);
  }
}

const initialLanguage=localStorage.getItem('brainrush-language')||'en';
document.documentElement.lang=initialLanguage;
$('#languageSelect').value=initialLanguage;
$('#languageSelect').addEventListener('change',e=>setLanguage(e.target.value));
translateRoot(document);


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
  translateRoot(modalBody);
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
    let cat=bmi<18.5?t('Underweight'):bmi<25?t('Normal range'):bmi<30?t('Overweight'):t('Obesity');
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
    catch{box.textContent=t('QR renderer could not be loaded.');}
  }
  $('#generateQR').addEventListener('click',generate);
  $('#downloadQR').addEventListener('click',()=>{
    const img=box.querySelector('img');
    if(!img){alert(t('Generate a QR code first.'));return;}
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
    if(activeTimer){clearInterval(activeTimer);activeTimer=null;$('#timerStart').textContent=t('Resume');return;}
    if(timerMode==='countdown') timerSeconds=Number($('#timerMinutes').value||0)*60+Number($('#timerSeconds').value||0);
    activeTimer=setInterval(()=>{
      if(timerMode==='countdown'){if(timerSeconds<=0){clearInterval(activeTimer);activeTimer=null;alert(t('Timer finished!'));return;}timerSeconds--;}
      else stopwatchSeconds++;
      render();
    },1000);
    $('#timerStart').textContent=t('Pause');render();
  });
  $('#timerReset').addEventListener('click',()=>{
    if(activeTimer){clearInterval(activeTimer);activeTimer=null;}
    timerSeconds=Number($('#timerMinutes').value||5)*60+Number($('#timerSeconds').value||0);stopwatchSeconds=0;$('#timerStart').textContent=t('Start');render();
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
  $('#copyCase').addEventListener('click',()=>copyText(out.value,t('Result copied')));
}
function bindColor(){
  const input=$('#colorInput');
  const update=()=>{
    const hex=input.value.toUpperCase(),n=parseInt(hex.slice(1),16);
    const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    $('#colorPreview').style.background=hex;$('#hexValue').textContent=hex;$('#rgbValue').textContent='rgb('+r+', '+g+', '+b+')';
  };
  input.addEventListener('input',update);
  $('#copyHex').addEventListener('click',()=>copyText($('#hexValue').textContent,t('HEX copied')));
  $('#copyRgb').addEventListener('click',()=>copyText($('#rgbValue').textContent,t('RGB copied')));update();
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
