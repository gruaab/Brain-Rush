const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));

const EN={
"Avuç içi kadar basit araçlar":"Simple tools for everyday tasks",
"Araçlar":"Tools","Oyunlar":"Games","Hakkımızda":"About",
"ÜCRETSİZ • HIZLI • PRATİK":"FREE • FAST • USEFUL",
"Günlük işlerin için tek akıllı merkez.":"One smart place for everyday tasks.",
"Hesapla, dönüştür, metinleri düzenle, üret ve eğlen. Hesap açmadan kullan.":"Calculate, convert, edit text, generate and play. No account required.",
"Araçları keşfet":"Explore tools","Oyunlara git":"Play games","Hemen başla":"Start now","Basit, hızlı ve ücretsiz.":"Simple, fast and free.",
"ARAÇ KUTUSU":"TOOLBOX","Ne yapmak istiyorsun?":"What do you need?","Araç ara...":"Search tools...",
"Hesap Makinesi":"Calculator","Yüzde Hesaplama":"Percentage Calculator","İndirim Hesaplama":"Discount Calculator","KDV Hesaplama":"VAT Calculator","Yaş Hesaplama":"Age Calculator","Metin Sayacı":"Text Counter","Şifre Oluşturucu":"Password Generator","Rastgele Sayı":"Random Number","Büyük Küçük Harf":"Case Converter","JSON Düzenleyici":"JSON Formatter","Base64 Kodlayıcı":"Base64 Encoder","Lorem Ipsum":"Lorem Ipsum",
"Dört işlem ve hızlı hesaplama":"Basic arithmetic","Yüzde, değişim ve indirim":"Percent, change and discount","İndirimli fiyatı bul":"Find the discounted price","KDV dahil ve hariç fiyat":"VAT included and excluded price","Doğum tarihinden yaşını bul":"Calculate age from birth date","Kelime ve karakter say":"Count words and characters","Güçlü rastgele şifre":"Strong random password","Aralıktan sayı üret":"Generate a number in a range","Metin biçimini değiştir":"Change text case","JSON biçimlendir ve doğrula":"Format and validate JSON","Metni kodla veya çöz":"Encode or decode text","Yer tutucu metin oluştur":"Generate placeholder text","Aradığın araç bulunamadı.":"No matching tool found.",
"ZİHİN OYUNLARI":"BRAIN GAMES","Oyna, düşün, geliştir.":"Play, think, improve.","Hafıza Eşleştirme":"Memory Match","Aynı kartları bul.":"Find matching cards.","Tepki Yarışı":"Reaction Rush","Ne kadar hızlısın?":"How fast are you?","Hızlı Matematik":"Quick Math","30 saniyede en yüksek skoru yap.":"Get the highest score in 30 seconds.","Sayı Avı":"Number Hunt","Gizli sayıyı tahmin et.":"Guess the hidden number.","Taş Kağıt Makas":"Rock Paper Scissors","Bilgisayara karşı oyna.":"Play against the computer.","Sıralama":"Sequence","Sırayı hatırla ve tekrar et.":"Remember and repeat the sequence.",
"BRAIN RUSH":"BRAIN RUSH","Faydalı olanı basitleştiriyoruz.":"We make useful things simple.","Brain Rush hızlı, ücretsiz ve kolay kullanılabilen çevrimiçi araçları ve zihin oyunlarını tek yerde toplar.":"Brain Rush brings fast, free online tools and brain games together in one place.","Kurucu":"Founder",
"İşlem":"Expression","Hesapla":"Calculate","Oluştur":"Generate","Kontrol Et":"Check","Başlat":"Start","Kapat":"Close","Doğru":"Correct","Tekrar dene":"Try again","Daha büyük":"Higher","Daha küçük":"Lower","Skor":"Score","Hamle":"Moves","Tahmin":"Guess","Cevap":"Answer","Fiyat":"Price","İndirim":"Discount","Doğum tarihi":"Birth date","Paragraf sayısı":"Paragraphs","Kodla":"Encode","Çöz":"Decode","Süre":"Time"
};

function translate(root){
  var lang=$("#language") ? $("#language").value : "tr";
  if(lang!=="en") lang="tr";
  root=root||document;
  root.querySelectorAll("[data-i18n]").forEach(function(el){
    var key=el.getAttribute("data-i18n");
    if(lang==="en" && EN[key]) el.textContent=EN[key];
    else if(lang==="tr") el.textContent=key;
  });
  var search=$("#search");
  if(search) search.placeholder=lang==="en"?"Search tools...":"Araç ara...";
}
function setLanguage(lang){
  localStorage.setItem("brainrush-lang",lang);
  document.documentElement.lang=lang;
  $("#language").value=lang;
  translate(document);
}

function showModal(title,html,setup){
  $("#modalContent").innerHTML='<div class="panel"><h3>'+title+'</h3>'+html+'</div>';
  $("#modal").hidden=false;
  translate($("#modalContent"));
  if(setup) setup();
}
function closeModal(){
  $("#modal").hidden=true;
  $("#modalContent").innerHTML="";
}

function openTool(name){
  if(name==="calculator") showModal("Hesap Makinesi",'<div class="field"><label data-i18n="İşlem">İşlem</label><input id="calc" placeholder="2 + 2 * 5"></div><button class="btn primary" id="calcGo" data-i18n="Hesapla">Hesapla</button><div class="result" id="calcResult">—</div>',function(){
    $("#calcGo").onclick=function(){
      var value=$("#calc").value;
      if(!/^[0-9+\-*/().%\s]+$/.test(value)){ $("#calcResult").textContent="Geçersiz işlem"; return; }
      try{ $("#calcResult").textContent=String(Function("return ("+value+")")()); }catch(e){ $("#calcResult").textContent="Geçersiz işlem"; }
    };
  });
  else if(name==="percentage") showModal("Yüzde Hesaplama",'<div class="row"><div class="field"><label>%</label><input id="pct" type="number" value="20"></div><div class="field"><label>Sayı</label><input id="pctBase" type="number" value="200"></div></div><button class="btn primary" id="pctGo" data-i18n="Hesapla">Hesapla</button><div class="result" id="pctResult">—</div>',function(){
    $("#pctGo").onclick=function(){ $("#pctResult").textContent=(Number($("#pctBase").value)*Number($("#pct").value)/100).toLocaleString("tr-TR"); };
  });
  else if(name==="discount") showModal("İndirim Hesaplama",'<div class="row"><div class="field"><label data-i18n="Fiyat">Fiyat</label><input id="price" type="number" value="1000"></div><div class="field"><label data-i18n="İndirim">İndirim %</label><input id="disc" type="number" value="20"></div></div><button class="btn primary" id="discGo" data-i18n="Hesapla">Hesapla</button><div class="result" id="discResult">—</div>',function(){
    $("#discGo").onclick=function(){var p=Number($("#price").value),d=Number($("#disc").value);$("#discResult").textContent=(p*(1-d/100)).toLocaleString("tr-TR");};
  });
  else if(name==="vat") showModal("KDV Hesaplama",'<div class="row"><div class="field"><label data-i18n="Fiyat">Fiyat</label><input id="vatPrice" type="number" value="1000"></div><div class="field"><label>KDV %</label><input id="vatRate" type="number" value="20"></div></div><button class="btn primary" id="vatGo" data-i18n="Hesapla">Hesapla</button><div class="result" id="vatResult">—</div>',function(){
    $("#vatGo").onclick=function(){var p=Number($("#vatPrice").value),r=Number($("#vatRate").value);$("#vatResult").textContent="KDV: "+(p*r/100).toLocaleString("tr-TR")+" · Toplam: "+(p*(1+r/100)).toLocaleString("tr-TR");};
  });
  else if(name==="age") showModal("Yaş Hesaplama",'<div class="field"><label data-i18n="Doğum tarihi">Doğum tarihi</label><input id="birth" type="date"></div><button class="btn primary" id="ageGo" data-i18n="Hesapla">Hesapla</button><div class="result" id="ageResult">—</div>',function(){
    $("#ageGo").onclick=function(){var d=new Date($("#birth").value);if(isNaN(d.getTime()))return;var n=new Date(),a=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))a--;$("#ageResult").textContent=a+" yaş";};
  });
  else if(name==="counter") showModal("Metin Sayacı",'<textarea id="counterText" rows="8" placeholder="Metninizi yazın..."></textarea><div class="result" id="counterResult">0 kelime · 0 karakter</div>',function(){
    $("#counterText").oninput=function(){var x=this.value.trim();$("#counterResult").textContent=(x?x.split(/\s+/).length:0)+" kelime · "+this.value.length+" karakter";};
  });
  else if(name==="password") showModal("Şifre Oluşturucu",'<div class="field"><label data-i18n="Uzunluk">Uzunluk</label><input id="passLen" type="number" min="6" max="64" value="16"></div><button class="btn primary" id="passGo" data-i18n="Oluştur">Oluştur</button><div class="result" id="passResult">—</div>',function(){
    $("#passGo").onclick=function(){var chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";var out="",len=Math.max(6,Math.min(64,Number($("#passLen").value)||16));for(var i=0;i<len;i++)out+=chars[Math.floor(Math.random()*chars.length)];$("#passResult").textContent=out;};
  });
  else if(name==="random") showModal("Rastgele Sayı",'<div class="row"><input id="min" type="number" value="1"><input id="max" type="number" value="100"></div><button class="btn primary" id="randGo" data-i18n="Oluştur">Oluştur</button><div class="result game-big" id="randResult">—</div>',function(){
    $("#randGo").onclick=function(){var a=Number($("#min").value),b=Number($("#max").value);if(a>b){var t=a;a=b;b=t;}$("#randResult").textContent=Math.floor(Math.random()*(b-a+1))+a;};
  });
  else if(name==="case") showModal("Büyük Küçük Harf",'<textarea id="caseText" rows="7"></textarea><div class="game-actions"><button id="upper">BÜYÜK</button><button id="lower">küçük</button><button id="titleCase">Başlık</button></div>',function(){
    $("#upper").onclick=function(){$("#caseText").value=$("#caseText").value.toLocaleUpperCase("tr-TR");};
    $("#lower").onclick=function(){$("#caseText").value=$("#caseText").value.toLocaleLowerCase("tr-TR");};
    $("#titleCase").onclick=function(){$("#caseText").value=$("#caseText").value.toLocaleLowerCase("tr-TR").replace(/(^|\s)\S/g,function(c){return c.toLocaleUpperCase("tr-TR");});};
  });
  else if(name==="json") showModal("JSON Düzenleyici",'<textarea id="jsonText" rows="10" placeholder="{&quot;ad&quot;:&quot;Selim&quot;}"></textarea><button class="btn primary" id="jsonGo" data-i18n="Kontrol Et">Kontrol Et</button><div class="result" id="jsonResult">—</div>',function(){
    $("#jsonGo").onclick=function(){try{$("#jsonResult").textContent=JSON.stringify(JSON.parse($("#jsonText").value),null,2);}catch(e){$("#jsonResult").textContent="Geçersiz JSON";}};
  });
  else if(name==="base64") showModal("Base64 Kodlayıcı",'<textarea id="b64" rows="7"></textarea><div class="game-actions"><button id="b64e" data-i18n="Kodla">Kodla</button><button id="b64d" data-i18n="Çöz">Çöz</button></div><div class="result" id="b64r">—</div>',function(){
    $("#b64e").onclick=function(){try{$("#b64r").textContent=btoa(unescape(encodeURIComponent($("#b64").value)));}catch(e){$("#b64r").textContent="Hata";}};
    $("#b64d").onclick=function(){try{$("#b64r").textContent=decodeURIComponent(escape(atob($("#b64").value)));}catch(e){$("#b64r").textContent="Geçersiz Base64";}};
  });
  else if(name==="lorem") showModal("Lorem Ipsum",'<div class="field"><label data-i18n="Paragraf sayısı">Paragraf sayısı</label><input id="loremN" type="number" value="2" min="1" max="10"></div><button class="btn primary" id="loremGo" data-i18n="Oluştur">Oluştur</button><textarea id="loremR" rows="9" readonly></textarea>',function(){
    $("#loremGo").onclick=function(){var n=Math.max(1,Math.min(10,Number($("#loremN").value)||2));var a=[];for(var i=0;i<n;i++)a.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo nec neque tincidunt feugiat.");$("#loremR").value=a.join("\n\n");};
  });
}

function openGame(name){
  if(name==="memory"){
    showModal("Hafıza Eşleştirme",'<div class="cards" id="mem"></div><p class="memory-status" id="memStatus">Hamle: 0</p>',function(){
      var icons=["🍎","🍌","🍇","🍉","🥝","🍒","🍋","🥕"],arr=icons.concat(icons).sort(function(){return Math.random()-.5}),open=[],moves=0;
      var grid=$("#mem");
      arr.forEach(function(icon,index){var b=document.createElement("button");b.className="card";b.textContent="?";b.onclick=function(){if(b.classList.contains("open")||open.length===2)return;b.classList.add("open");b.textContent=icon;open.push({index:index,button:b});if(open.length===2){moves++;$("#memStatus").textContent="Hamle: "+moves;if(arr[open[0].index]===arr[open[1].index]){open=[];}else{var pair=open.slice();open=[];setTimeout(function(){pair.forEach(function(x){x.button.classList.remove("open");x.button.textContent="?";});},600);}}};grid.appendChild(b);});
    });
  } else if(name==="reaction"){
    showModal("Tepki Yarışı",'<button id="react" class="reaction game-big">Hazır...<br><small>Başlatmak için dokun</small></button><p id="reactResult" class="memory-status">—</p>',function(){
      var waiting=false,start=0;
      $("#react").onclick=function(){if(waiting)return;waiting=true;$("#react").textContent="Bekle...";setTimeout(function(){start=performance.now();$("#react").textContent="ŞİMDİ!";$("#react").onclick=function(){if(!start)return;$("#reactResult").textContent=Math.round(performance.now()-start)+" ms";start=0;waiting=false;};},1000+Math.random()*2500);};
    });
  } else if(name==="math"){
    showModal("Hızlı Matematik",'<div class="game-big" id="mq">—</div><input id="ma" type="number" placeholder="Cevap"><button class="btn primary" id="mc">Kontrol Et</button><p id="ms" class="memory-status">Skor: 0</p>',function(){
      var score=0,a=0,b=0;
      function next(){a=Math.floor(Math.random()*20)+1;b=Math.floor(Math.random()*20)+1;$("#mq").textContent=a+" + "+b+" = ?";$("#ma").value="";}
      $("#mc").onclick=function(){if(Number($("#ma").value)===a+b){score++;$("#ms").textContent="Skor: "+score;next();}else{$("#ms").textContent="Tekrar dene";}};
      next();
    });
  } else if(name==="number"){
    showModal("Sayı Avı",'<div class="game-big">1–100</div><input id="ni" type="number" placeholder="Tahmin"><button class="btn primary" id="ng">Tahmin</button><p id="nm" class="memory-status">—</p>',function(){
      var target=Math.floor(Math.random()*100)+1,tries=0;
      $("#ng").onclick=function(){var n=Number($("#ni").value);tries++;$("#nm").textContent=n===target?"🎉 Doğru! "+tries+" tahminde":n<target?"Daha büyük":"Daha küçük";};
    });
  } else if(name==="rps"){
    showModal("Taş Kağıt Makas",'<div class="game-actions"><button data-r="taş">✊ Taş</button><button data-r="kağıt">✋ Kağıt</button><button data-r="makas">✌️ Makas</button></div><p id="rpsr" class="memory-status">—</p>',function(){
      var choices=["taş","kağıt","makas"];
      $$("[data-r]").forEach(function(button){button.onclick=function(){var user=button.getAttribute("data-r"),bot=choices[Math.floor(Math.random()*3)],result="Kaybettin!";if(user===bot)result="Berabere";else if((user==="taş"&&bot==="makas")||(user==="kağıt"&&bot==="taş")||(user==="makas"&&bot==="kağıt"))result="Kazandın!";$("#rpsr").textContent="Sen: "+user+" · Bilgisayar: "+bot+" · "+result;};});
    });
  } else if(name==="sequence"){
    showModal("Sıralama",'<div class="game-big" id="seq">Başlat</div><button class="btn primary" id="seqStart">Başlat</button><div id="seqBtns" class="game-actions"></div><p id="seqMsg" class="memory-status">—</p>',function(){
      var sequence=[],user=[],active=false;
      function add(){sequence.push(Math.floor(Math.random()*4));user=[];active=false;$("#seq").textContent=sequence.map(function(x){return x+1;}).join(" · ");setTimeout(function(){$("#seq").textContent="?";active=true;},900);}
      $("#seqStart").onclick=function(){sequence=[];add();};
      $("#seqBtns").onclick=function(e){if(!active||!e.target.hasAttribute("data-s"))return;var v=Number(e.target.getAttribute("data-s"));user.push(v);var i=user.length-1;if(user[i]!==sequence[i]){active=false;$("#seqMsg").textContent="Oyun bitti";}else if(user.length===sequence.length){$("#seqMsg").textContent="Doğru!";setTimeout(add,500);}};
      for(var i=0;i<4;i++){var b=document.createElement("button");b.setAttribute("data-s",i);b.textContent=i+1;$("#seqBtns").appendChild(b);}
    });
  }
}

function init(){
  var saved=localStorage.getItem("brainrush-lang")||"tr";
  $("#language").value=saved==="en"?"en":"tr";
  $("#language").onchange=function(){setLanguage(this.value);};
  var dark=localStorage.getItem("brainrush-theme")==="dark";
  if(dark){document.body.classList.add("dark");$("#theme").textContent="☀";}
  $("#theme").onclick=function(){document.body.classList.toggle("dark");var on=document.body.classList.contains("dark");localStorage.setItem("brainrush-theme",on?"dark":"light");$("#theme").textContent=on?"☀":"☾";};
  $$("[data-scroll]").forEach(function(b){b.onclick=function(){var el=document.getElementById(b.getAttribute("data-scroll"));if(el)el.scrollIntoView({behavior:"smooth"});};});
  $("#close").onclick=closeModal;
  $("#modal").onclick=function(e){if(e.target===this)closeModal();};
  $$(".tool").forEach(function(b){b.onclick=function(){openTool(b.getAttribute("data-tool"));};});
  $$(".game").forEach(function(b){b.onclick=function(){openGame(b.getAttribute("data-game"));};});
  $("#search").oninput=function(){var q=this.value.toLocaleLowerCase("tr-TR"),found=0;$$(".tool").forEach(function(b){var ok=b.textContent.toLocaleLowerCase("tr-TR").indexOf(q)>=0;b.hidden=!ok;if(ok)found++;});$("#noResults").hidden=found>0;};
  translate(document);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();