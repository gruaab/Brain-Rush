const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const modal = $('#modal');
const modalBody = $('#modalBody');
let activeTimer = null;
let timerMode = 'countdown';
let timerSeconds = 300;
let stopwatchSeconds = 0;
let qrLoaded = false;


// Theme system: saved preference first, then OS preference.
function applyTheme(theme){
  const dark=theme==='dark';
  document.documentElement.dataset.theme=dark?'dark':'light';
  localStorage.setItem('brainrush-theme',dark?'dark':'light');
  const btn=$('#themeToggle');
  if(btn){
    btn.textContent=dark?'☀':'☾';
    btn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
    btn.setAttribute('title',dark?'Light theme':'Dark theme');
  }
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content=dark?'#080b12':'#f6f7fb';
}
const savedTheme=localStorage.getItem('brainrush-theme');
const preferredTheme=savedTheme||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
applyTheme(preferredTheme);
$('#themeToggle').addEventListener('click',()=>{
  applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
});
if(window.matchMedia){
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change',e=>{
    if(!localStorage.getItem('brainrush-theme')) applyTheme(e.matches?'dark':'light');
  });
}

const translations = {
  en: {
    "Size Guessing Games":"Size Guessing Games","Compare real-world objects and resize the red object until its scale is correct.":"Compare real-world objects and resize the red object until its scale is correct.","Size It Up":"Size It Up","Use a reference object to match the real-world size of another object.":"Use a reference object to match the real-world size of another object.","Match the red object to its real-world size using the blue reference.":"Match the red object to its real-world size using the blue reference.","ROUND":"ROUND","SCORE":"SCORE","Reference":"Reference","Target":"Target","Drag the handle to resize":"Drag the handle to resize","Your estimate":"Your estimate","Smaller":"Smaller","Larger":"Larger","Lock In":"Lock In","Next Round":"Next Round","5 rounds • closer estimates earn more points":"5 rounds • closer estimates earn more points","Restart Game":"Restart Game","Adjust the red object to estimate its real length.":"Adjust the red object to estimate its real length.","Real length:":"Real length:","from the real size":"from the real size","Great estimate!":"Great estimate!","Nice try!":"Nice try!","Real size":"Real size","Error":"Error","points":"points","Game complete!":"Game complete!","Final score":"Final score","Play Again":"Play Again","Door":"Door","Table":"Table","Car":"Car","Bus":"Bus","Basketball Hoop":"Basketball Hoop","Person":"Person","Refrigerator":"Refrigerator","Sofa":"Sofa","Container":"Container","Shark":"Shark","Laptop":"Laptop","Keyboard":"Keyboard","Ruler":"Ruler","Guitar":"Guitar",
    "Image Size Checker":"Image Size Checker","Find the exact dimensions and technical details of an image":"Find the exact dimensions and technical details of an image","Drop an image here":"Drop an image here","or click to choose a file • processed in your browser":"or click to choose a file • processed in your browser","Choose Image":"Choose Image","JPG, PNG, WebP, GIF, AVIF and other browser-supported formats":"JPG, PNG, WebP, GIF, AVIF and other browser-supported formats","Analyzing image...":"Analyzing image...","Local browser analysis":"Local browser analysis","Actual dimensions":"Actual dimensions","Aspect ratio":"Aspect ratio","Megapixels":"Megapixels","File size":"File size","Format":"Format","Orientation":"Orientation","DPI / PPI":"DPI / PPI","Estimated print size":"Estimated print size","Physical size depends on DPI/PPI":"Physical size depends on DPI/PPI","DPI":"DPI","Custom":"Custom","Copy summary":"Copy summary","Check another image":"Check another image","Landscape":"Landscape","Portrait":"Portrait","Square":"Square","Not saved":"Not saved","DPI not saved":"DPI not saved","Copied!":"Copied!","Görsel Boyutu Bulucu":"Görsel Boyutu Bulucu","Piksel, oran, dosya boyutu ve baskı ölçüsünü bulun":"Piksel, oran, dosya boyutu ve baskı ölçüsünü bulun","Bir görselin gerçek boyutunu ve teknik detaylarını bulun":"Bir görselin gerçek boyutunu ve teknik detaylarını bulun",
    "Fuel Cost":"Fuel Cost","Trip fuel and cost calculator":"Trip fuel and cost calculator","Salary Calculator":"Salary Calculator","Convert salary to hourly and daily pay":"Convert salary to hourly and daily pay","Savings Goal":"Savings Goal","Plan how much to save each month":"Plan how much to save each month","Aspect Ratio Calculator":"Aspect Ratio Calculator","Resize images and videos proportionally":"Resize images and videos proportionally","Speed Converter":"Speed Converter","Convert km/h, mph and m/s":"Convert km/h, mph and m/s","Slug Generator":"Slug Generator","Create clean SEO-friendly slugs":"Create clean SEO-friendly slugs","Regex Tester":"Regex Tester","Test regular expressions safely":"Test regular expressions safely","Random Picker":"Random Picker","Pick one item from a list":"Pick one item from a list",
    "Heads":"Heads","Tails":"Tails","Team":"Team","Enter at least one item":"Enter at least one item",
    "ACTIVITIES":"ACTIVITIES","Do something fun.":"Do something fun.","Quick activities for decisions, breaks and group fun.":"Quick activities for decisions, breaks and group fun.","Coin Flip":"Coin Flip","Flip a virtual coin for a quick decision.":"Flip a virtual coin for a quick decision.","Dice Roller":"Dice Roller","Roll one or more dice instantly.":"Roll one or more dice instantly.","Team Generator":"Team Generator","Split a list of people into random teams.":"Split a list of people into random teams.","Decision Maker":"Decision Maker","Let Brain Rush choose between your options.":"Let Brain Rush choose between your options.",
    "Profit Margin":"Profit Margin","Calculate profit, margin and markup":"Calculate profit, margin and markup","Break-Even Calculator":"Break-Even Calculator","Find your break-even sales volume":"Find your break-even sales volume","Work Hours":"Work Hours","Calculate shift duration and overtime":"Calculate shift duration and overtime","Date Add / Subtract":"Date Add / Subtract","Add or subtract time from a date":"Add or subtract time from a date","Data Size Converter":"Data Size Converter","Convert B, KB, MB, GB and TB":"Convert B, KB, MB, GB and TB","Pace Calculator":"Pace Calculator","Calculate running pace and speed":"Calculate running pace and speed","Color Contrast":"Color Contrast","Check text and background contrast":"Check text and background contrast","UTM Builder":"UTM Builder","Create trackable campaign URLs":"Create trackable campaign URLs","Duplicate Line Remover":"Duplicate Line Remover","Clean repeated lines from text":"Clean repeated lines from text","Word Frequency":"Word Frequency","Find the most used words in text":"Find the most used words in text",
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
    "JSON Formatter":"JSON Formatter","Base64 Encoder":"Base64 Encoder","UUID Generator":"UUID Generator","Lorem Ipsum":"Lorem Ipsum","Format, validate & minify JSON":"Format, validate & minify JSON","Encode and decode Base64 text":"Encode and decode Base64 text","Generate secure random UUIDs":"Generate secure random UUIDs","Generate placeholder text instantly":"Generate placeholder text instantly","Format, validate or minify JSON directly in your browser.":"Format, validate or minify JSON directly in your browser.","Encode and decode UTF-8 text without leaving your browser.":"Encode and decode UTF-8 text without leaving your browser.","Generate cryptographically strong UUID v4 identifiers locally.":"Generate cryptographically strong UUID v4 identifiers locally.","Generate placeholder paragraphs, sentences or words.":"Generate placeholder paragraphs, sentences or words.","Format":"Format","Minify":"Minify","Validate":"Validate","Clear":"Clear","Status":"Status","Valid JSON":"Valid JSON","Invalid JSON":"Invalid JSON","Encoded":"Encoded","Decoded":"Decoded","Click generate":"Click generate","Quantity":"Quantity","Generate UUIDs":"Generate UUIDs","Copy results":"Copy results","Type":"Type","Paragraphs":"Paragraphs","Sentences":"Sentences","Words":"Words","Generate":"Generate","Generated text will appear here...":"Generated text will appear here...","Type or paste text...":"Type or paste text...","Paste JSON here...":"Paste JSON here...","Result":"Result","Copy result":"Copy result","Calculator":"Calculator","Unit Converter":"Unit Converter","Currency Converter":"Currency Converter","Age Calculator":"Age Calculator",
    "Password Generator":"Password Generator","Text Counter":"Text Counter","Percentage Calculator":"Percentage Calculator","BMI Calculator":"BMI Calculator",
    "Date Difference":"Date Difference","QR Code Generator":"QR Code Generator","Timer & Stopwatch":"Timer & Stopwatch","Random Number":"Random Number",
    "Case Converter":"Case Converter","Color Picker":"Color Picker","Copy":"Copy","Category":"Category","Strong password":"Strong password",
    "Your age":"Your age","Current rate":"Current rate","Underweight":"Underweight","Normal range":"Normal range","Overweight":"Overweight","Obesity":"Obesity",
    "Timer finished!":"Timer finished!","Generate a QR code first.":"Generate a QR code first.","QR renderer could not be loaded.":"QR renderer could not be loaded.",
    "Result copied":"Result copied","HEX copied":"HEX copied","Add VAT":"Add VAT","Remove VAT":"Remove VAT","Total with VAT":"Total with VAT","Price without VAT":"Price without VAT","Bill amount":"Bill amount","Tip %":"Tip %","People":"People","Total":"Total","You pay":"You pay","Original price":"Original price","Discount %":"Discount %","You save":"You save","Current time":"Current time","Timestamp → Date":"Timestamp → Date","Date → Timestamp":"Date → Timestamp","Unix timestamp":"Unix timestamp","Date and time":"Date and time","SHA-256":"SHA-256","SHA-1":"SHA-1","Algorithm":"Algorithm","Invalid text":"Invalid text","RGB copied":"RGB copied","Meter":"Meter","Kilometer":"Kilometer","Centimeter":"Centimeter","Millimeter":"Millimeter","Mile":"Mile","Yard":"Yard","Foot":"Foot","Inch":"Inch","Kilogram":"Kilogram","Gram":"Gram","Milligram":"Milligram","Pound":"Pound","Ounce":"Ounce","Celsius":"Celsius","Fahrenheit":"Fahrenheit","Kelvin":"Kelvin","Enter a valid amount":"Enter a valid amount","Same currency":"Same currency","Rate supplied by Frankfurter.":"Rate supplied by Frankfurter.","Loading rate…":"Loading rate…","Unable to load rate":"Unable to load rate","Check your connection and try again.":"Check your connection and try again.","Loan Calculator":"Loan Calculator","Estimate monthly loan payments":"Estimate monthly loan payments","Compound Interest":"Compound Interest","Calculate growth with compound interest":"Calculate growth with compound interest","Number Base Converter":"Number Base Converter","Convert binary, decimal and hex":"Convert binary, decimal and hex","Text Reverser":"Text Reverser","Reverse any text instantly":"Reverse any text instantly","Time Zone Converter":"Time Zone Converter","See a date and time in another zone":"See a date and time in another zone","Compound Interest":"Compound Interest","Number Base Converter":"Number Base Converter","Text Reverser":"Text Reverser","Time Zone Converter":"Time Zone Converter","Monthly payment":"Monthly payment","Total payment":"Total payment","Total interest":"Total interest","Principal":"Principal","Annual rate":"Annual rate","Months":"Months","Interest earned":"Interest earned","Years":"Years","Compounds per year":"Compounds per year","Input number":"Input number","From base":"From base","To base":"To base","Reversed text":"Reversed text","Date and time":"Date and time","Time zone":"Time zone"
  },
  tr: {
    "Size Guessing Games":"Boyut Tahmin Oyunları","Compare real-world objects and resize the red object until its scale is correct.":"Gerçek hayattaki nesneleri karşılaştırın ve kırmızı nesneyi doğru ölçüye getirin.","Size It Up":"Boyutunu Tahmin Et","Use a reference object to match the real-world size of another object.":"Referans nesneyi kullanarak başka bir nesnenin gerçek boyutunu tahmin edin.","Match the red object to its real-world size using the blue reference.":"Mavi referansı kullanarak kırmızı nesneyi gerçek boyutuna getirin.","ROUND":"TUR","SCORE":"SKOR","Reference":"Referans","Target":"Hedef","Drag the handle to resize":"Boyutu değiştirmek için tutamacı sürükleyin","Your estimate":"Tahmininiz","Smaller":"Küçült","Larger":"Büyüt","Lock In":"Kilitle","Next Round":"Sonraki Tur","5 rounds • closer estimates earn more points":"5 tur • doğruya ne kadar yakınsanız o kadar çok puan","Restart Game":"Oyunu Yeniden Başlat","Adjust the red object to estimate its real length.":"Gerçek uzunluğu tahmin etmek için kırmızı nesneyi ayarlayın.","Real length:":"Gerçek uzunluk:","from the real size":"gerçek boyuttan sapma","Great estimate!":"Harika tahmin!","Nice try!":"İyi deneme!","Real size":"Gerçek boyut","Error":"Hata","points":"puan","Game complete!":"Oyun tamamlandı!","Final score":"Final skor","Play Again":"Tekrar Oyna","Door":"Kapı","Table":"Masa","Car":"Otomobil","Bus":"Otobüs","Basketball Hoop":"Basketbol Potası","Person":"İnsan","Refrigerator":"Buzdolabı","Sofa":"Kanepe","Container":"Konteyner","Shark":"Köpekbalığı","Laptop":"Dizüstü Bilgisayar","Keyboard":"Klavye","Ruler":"Cetvel","Guitar":"Gitar",
    "Image Size Checker":"Görsel Boyutu Bulucu","Find the exact dimensions and technical details of an image":"Bir görselin gerçek boyutunu ve teknik detaylarını bulun","Drop an image here":"Görseli buraya bırakın","or click to choose a file • processed in your browser":"veya dosya seçin • görseliniz tarayıcınızda işlenir","Choose Image":"Görsel Seç","JPG, PNG, WebP, GIF, AVIF and other browser-supported formats":"JPG, PNG, WebP, GIF, AVIF ve tarayıcının desteklediği diğer formatlar","Analyzing image...":"Görsel analiz ediliyor...","Local browser analysis":"Tarayıcıda yerel analiz","Actual dimensions":"Gerçek boyut","Aspect ratio":"En-boy oranı","Megapixels":"Megapiksel","File size":"Dosya boyutu","Format":"Format","Orientation":"Yön","DPI / PPI":"DPI / PPI","Estimated print size":"Tahmini baskı boyutu","Physical size depends on DPI/PPI":"Fiziksel boyut DPI/PPI değerine bağlıdır","DPI":"DPI","Custom":"Özel","Copy summary":"Özeti Kopyala","Check another image":"Başka Görsel Kontrol Et","Landscape":"Yatay","Portrait":"Dikey","Square":"Kare","Not saved":"Kayıtlı değil","DPI not saved":"DPI bilgisi kayıtlı değil","Copied!":"Kopyalandı!","Görsel Boyutu Bulucu":"Görsel Boyutu Bulucu","Piksel, oran, dosya boyutu ve baskı ölçüsünü bulun":"Piksel, oran, dosya boyutu ve baskı ölçüsünü bulun","Bir görselin gerçek boyutunu ve teknik detaylarını bulun":"Bir görselin gerçek boyutunu ve teknik detaylarını bulun",
    "Fuel Cost":"Yakıt Maliyeti","Trip fuel and cost calculator":"Yakıt tüketimi ve yolculuk maliyetini hesaplayın","Salary Calculator":"Maaş Hesaplama","Convert salary to hourly and daily pay":"Maaşı günlük ve saatlik ücrete dönüştürün","Savings Goal":"Birikim Hedefi","Plan how much to save each month":"Aylık ne kadar birikim yapmanız gerektiğini planlayın","Aspect Ratio Calculator":"En-Boy Oranı Hesaplama","Resize images and videos proportionally":"Görsel ve videoları orantılı olarak yeniden boyutlandırın","Speed Converter":"Hız Dönüştürücü","Convert km/h, mph and m/s":"km/sa, mil/sa ve m/sn arasında dönüştürün","Slug Generator":"SEO Slug Oluşturucu","Create clean SEO-friendly slugs":"SEO uyumlu temiz bağlantı metinleri oluşturun","Regex Tester":"Regex Test Aracı","Test regular expressions safely":"Düzenli ifadeleri güvenli şekilde test edin","Random Picker":"Rastgele Seçici","Pick one item from a list":"Listedeki bir öğeyi rastgele seçin",
    "Heads":"Yazı","Tails":"Tura","Team":"Takım","Enter at least one item":"En az bir seçenek girin",
    "ACTIVITIES":"AKTİVİTELER","Do something fun.":"Biraz eğlenelim.","Quick activities for decisions, breaks and group fun.":"Karar vermek, mola vermek ve birlikte eğlenmek için hızlı aktiviteler.","Coin Flip":"Yazı Tura","Flip a virtual coin for a quick decision.":"Hızlı bir karar için sanal para atın.","Dice Roller":"Zar Atma","Roll one or more dice instantly.":"Bir veya daha fazla zarı anında atın.","Team Generator":"Takım Oluşturucu","Split a list of people into random teams.":"Listedeki kişileri rastgele takımlara ayırın.","Decision Maker":"Karar Verici","Let Brain Rush choose between your options.":"Seçenekleriniz arasından Brain Rush karar versin.",
    "Profit Margin":"Kâr Marjı Hesaplama","Calculate profit, margin and markup":"Kârı, marjı ve kâr oranını hesaplayın","Break-Even Calculator":"Başabaş Noktası Hesaplama","Find your break-even sales volume":"Başabaş satış miktarını bulun","Work Hours":"Çalışma Saati Hesaplama","Calculate shift duration and overtime":"Vardiya süresini ve fazla mesaiyi hesaplayın","Date Add / Subtract":"Tarihe Gün Ekle / Çıkar","Add or subtract time from a date":"Bir tarihe gün, hafta veya ay ekleyin ya da çıkarın","Data Size Converter":"Veri Boyutu Dönüştürücü","Convert B, KB, MB, GB ve TB":"B, KB, MB, GB ve TB arasında dönüştürün","Pace Calculator":"Tempo Hesaplama","Calculate running pace and speed":"Koşu temposunu ve hızı hesaplayın","Color Contrast":"Renk Kontrastı","Check text and background contrast":"Metin ve arka plan kontrastını kontrol edin","UTM Builder":"UTM Oluşturucu","Create trackable campaign URLs":"Takip edilebilir kampanya URL'leri oluşturun","Duplicate Line Remover":"Tekrarlanan Satırları Temizle","Clean repeated lines from text":"Metindeki tekrar eden satırları temizleyin","Word Frequency":"Kelime Sıklığı","Find the most used words in text":"Metinde en sık kullanılan kelimeleri bulun",
"Loan Calculator":"Kredi Hesaplama","Estimate monthly loan payments":"Aylık kredi ödemesini tahmin edin","Compound Interest":"Bileşik Faiz Hesaplama","Calculate growth with compound interest":"Bileşik faiz ile büyümeyi hesaplayın","Number Base Converter":"Sayı Tabanı Dönüştürücü","Convert binary, decimal and hex":"İkili, onluk ve onaltılık sayıları dönüştürün","Text Reverser":"Metin Ters Çevirici","Reverse any text instantly":"Metni anında ters çevirin","Time Zone Converter":"Saat Dilimi Dönüştürücü","See a date and time in another zone":"Başka bir saat dilimindeki tarihi ve saati görün","Compound Interest":"Bileşik Faiz Hesaplama","Number Base Converter":"Sayı Tabanı Dönüştürücü","Text Reverser":"Metin Ters Çevirici","Time Zone Converter":"Saat Dilimi Dönüştürücü","Monthly payment":"Aylık ödeme","Total payment":"Toplam ödeme","Total interest":"Toplam faiz","Principal":"Ana para","Annual rate":"Yıllık faiz","Months":"Ay","Interest earned":"Kazanç","Years":"Yıl","Compounds per year":"Yıllık bileşik dönem","Input number":"Sayı","From base":"Kaynak taban","To base":"Hedef taban","Reversed text":"Ters metin","Date and time":"Tarih ve saat","Time zone":"Saat dilimi",    "Tools":"Araçlar","About":"Hakkında","Privacy":"Gizlilik","Search tools...":"Araçlarda ara...",
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
    "JSON Formatter":"JSON Biçimlendirici","Base64 Encoder":"Base64 Kodlayıcı","UUID Generator":"UUID Oluşturucu","Lorem Ipsum":"Lorem Ipsum","Format, validate & minify JSON":"JSON biçimlendir, doğrula ve küçült","Encode and decode Base64 text":"Base64 metnini kodla ve çöz","Generate secure random UUIDs":"Güvenli rastgele UUID'ler oluştur","Generate placeholder text instantly":"Anında örnek metin oluştur","Format, validate or minify JSON directly in your browser.":"JSON verisini tarayıcınızda biçimlendirin, doğrulayın veya küçültün.","Encode and decode UTF-8 text without leaving your browser.":"UTF-8 metinleri tarayıcıdan çıkmadan kodlayın ve çözün.","Generate cryptographically strong UUID v4 identifiers locally.":"Kriptografik olarak güçlü UUID v4 kimliklerini yerel olarak oluşturun.","Generate placeholder paragraphs, sentences or words.":"Örnek paragraf, cümle veya kelime metinleri oluşturun.","Format":"Biçimlendir","Minify":"Küçült","Validate":"Doğrula","Clear":"Temizle","Status":"Durum","Valid JSON":"Geçerli JSON","Invalid JSON":"Geçersiz JSON","Encoded":"Kodlandı","Decoded":"Çözüldü","Click generate":"Oluşturmak için tıklayın","Quantity":"Adet","Generate UUIDs":"UUID Oluştur","Copy results":"Sonuçları kopyala","Type":"Tür","Paragraphs":"Paragraf","Sentences":"Cümle","Words":"Kelime","Generated text will appear here...":"Oluşturulan metin burada görünecek...","Type or paste text...":"Metin yazın veya yapıştırın...","Paste JSON here...":"JSON verisini buraya yapıştırın...","Result":"Sonuç","Copy result":"Sonucu kopyala","Calculator":"Hesap Makinesi","Unit Converter":"Birim Dönüştürücü","Currency Converter":"Para Birimi Dönüştürücü","Age Calculator":"Yaş Hesaplama",
    "Password Generator":"Şifre Oluşturucu","Text Counter":"Metin Sayacı","Percentage Calculator":"Yüzde Hesaplama","BMI Calculator":"VKİ Hesaplama",
    "Date Difference":"Tarih Farkı","QR Code Generator":"QR Kod Oluşturucu","Timer & Stopwatch":"Sayaç ve Kronometre","Random Number":"Rastgele Sayı",
    "Case Converter":"Büyük/Küçük Harf Dönüştürücü","Color Picker":"Renk Seçici","Copy":"Kopyala","Category":"Kategori","Strong password":"Güçlü şifre",
    "Current rate":"Güncel kur","Underweight":"Zayıf","Normal range":"Normal aralık","Overweight":"Fazla kilolu","Obesity":"Obezite",
    "Timer finished!":"Sayaç tamamlandı!","Generate a QR code first.":"Önce bir QR kod oluşturun.","QR renderer could not be loaded.":"QR oluşturucu yüklenemedi.",
    "Result copied":"Sonuç kopyalandı","HEX copied":"HEX kopyalandı","Add VAT":"KDV ekle","Remove VAT":"KDV çıkar","Total with VAT":"KDV dahil toplam","Price without VAT":"KDV hariç fiyat","Bill amount":"Hesap tutarı","Tip %":"Bahşiş %","People":"Kişi","Total":"Toplam","You pay":"Ödenecek","Original price":"Orijinal fiyat","Discount %":"İndirim %","You save":"Tasarruf","Current time":"Şu an","Timestamp → Date":"Zaman damgası → Tarih","Date → Timestamp":"Tarih → Zaman damgası","Unix timestamp":"Unix zaman damgası","Date and time":"Tarih ve saat","Algorithm":"Algoritma","Invalid text":"Geçersiz metin","RGB copied":"RGB kopyalandı","Meter":"Metre","Kilometer":"Kilometre","Centimeter":"Santimetre","Millimeter":"Milimetre","Mile":"Mil","Yard":"Yarda","Foot":"Fit","Inch":"İnç","Kilogram":"Kilogram","Gram":"Gram","Milligram":"Miligram","Pound":"Pound","Ounce":"Ons","Celsius":"Santigrat","Fahrenheit":"Fahrenhayt","Kelvin":"Kelvin","Enter a valid amount":"Geçerli bir miktar girin","Same currency":"Aynı para birimi","Rate supplied by Frankfurter.":"Kur bilgisi Frankfurter tarafından sağlanıyor.","Loading rate…":"Kur yükleniyor…","Unable to load rate":"Kur alınamadı","Check your connection and try again.":"Bağlantınızı kontrol edip tekrar deneyin.",
    "Tools":"Araçlar","About":"Hakkında","Privacy":"Gizlilik","Language":"Dil",
    "FREE • FAST • USEFUL":"ÜCRETSİZ • HIZLI • KULLANIŞLI","Everyday tools.":"Günlük araçlar.","One smart place.":"Tek akıllı yerde.",
    "Explore tools":"Araçları keşfet","Surprise me":"Rastgele araç","Get things done.":"İşinizi halledin.","Brain Rush":"Brain Rush",
    "Simple tools with zero friction.":"Sade ve zahmetsiz araçlar.","TOOLBOX":"ARAÇLAR","What do you need?":"Neye ihtiyacınız var?",
    "All Tools":"Tüm Araçlar","Calculators":"Hesaplama","Text & Writing":"Metin ve Yazı","Developer":"Geliştirici","Generators":"Oluşturucular","Date & Time":"Tarih ve Zaman",
    "Calculator":"Hesap Makinesi","Quick everyday math":"Hızlı günlük matematik",
    "Unit Converter":"Birim Dönüştürücü","Length, weight & temperature":"Uzunluk, ağırlık ve sıcaklık",
    "Currency":"Para Birimi","Currency Converter":"Para Birimi Dönüştürücü","Live exchange rates":"Güncel döviz kurları",
    "Age Calculator":"Yaş Hesaplama","Exact age from a birthday":"Doğum tarihinden tam yaş",
    "Password Generator":"Şifre Oluşturucu","Create strong passwords":"Güçlü şifreler oluşturun",
    "Text Counter":"Metin Sayacı","Words, characters & lines":"Kelime, karakter ve satır sayısı",
    "Percentage":"Yüzde","Percentage Calculator":"Yüzde Hesaplama","Percent calculations made easy":"Yüzde hesaplamalarını kolayca yapın",
    "BMI Calculator":"VKİ Hesaplama","Body mass index":"Vücut kitle indeksi",
    "Date Difference":"Tarih Farkı","Days between two dates":"İki tarih arasındaki gün sayısı",
    "QR Generator":"QR Oluşturucu","QR Code Generator":"QR Kod Oluşturucu","Create a QR code":"QR kod oluşturun",
    "Timer & Stopwatch":"Sayaç ve Kronometre","Focus, cook or exercise":"Odaklanın, yemek yapın veya egzersiz yapın",
    "Random Number":"Rastgele Sayı","Pick a number instantly":"Anında bir sayı seçin",
    "Case Converter":"Harf Biçimi Dönüştürücü","UPPER, lower & Title Case":"BÜYÜK, küçük ve Başlık Biçimi",
    "Color Picker":"Renk Seçici","Pick and copy colors":"Renk seçin ve kopyalayın",
    "JSON Formatter":"JSON Biçimlendirici","Format, validate & minify JSON":"JSON'u biçimlendir, doğrula ve küçült",
    "Base64 Encoder":"Base64 Kodlayıcı","Encode and decode Base64 text":"Base64 metnini kodla ve çöz",
    "UUID Generator":"UUID Oluşturucu","Generate secure random UUIDs":"Güvenli rastgele UUID oluşturun",
    "Lorem Ipsum":"Lorem Ipsum","Generate placeholder text instantly":"Yer tutucu metinleri anında oluşturun",
    "Tip Calculator":"Bahşiş Hesaplama","Split a bill and calculate tip":"Hesabı bölüştürün ve bahşişi hesaplayın",
    "Discount Calculator":"İndirim Hesaplama","Sale price and savings":"İndirimli fiyatı ve tasarrufu hesaplayın",
    "VAT Calculator":"KDV Hesaplama","Add or remove tax":"KDV ekleyin veya çıkarın",
    "Timestamp Converter":"Zaman Damgası Dönüştürücü","Unix time ↔ readable date":"Unix zamanını ↔ okunabilir tarihe dönüştürün",
    "URL Encoder":"URL Kodlayıcı","Encode and decode URLs":"URL'leri kodlayın ve çözün",
    "Hash Generator":"Özet (Hash) Oluşturucu","SHA-256 and SHA-1 hashes":"SHA-256 ve SHA-1 özetleri",
    "Built for instant results.":"Anında sonuç almak için tasarlandı.","Most tools run in your browser.":"Çoğu araç tarayıcınızda çalışır.",
    "Works on phones and desktops.":"Telefonlarda ve bilgisayarlarda çalışır.","No account required.":"Üyelik gerekmez.",
    "WHY BRAIN RUSH?":"NEDEN BRAIN RUSH?","Useful beats complicated.":"Karmaşıklık yerine kullanışlılık.",
    "✓ No sign-up":"✓ Üyelik yok","✓ Browser-first":"✓ Tarayıcı öncelikli","✓ Responsive":"✓ Mobil uyumlu","✓ Free to use":"✓ Ücretsiz kullanım",
    "Simple by design.":"Sade ve anlaşılır.","Built for everyday life.":"Günlük yaşam için tasarlandı.",
    "Privacy":"Gizlilik","Tools":"Araçlar",
    "Common calculations happen locally in your browser and no account is required. The Currency tool contacts a public exchange-rate service when you request a rate.":"Yaygın hesaplamalar tarayıcınızda yerel olarak yapılır ve üyelik gerekmez. Para Birimi aracı, kur istediğinizde herkese açık bir döviz kuru hizmetine bağlanır.",
    "As Brain Rush grows, this section can be expanded with the final privacy policy, analytics disclosure and advertising information.":"Brain Rush büyüdükçe bu bölüm kapsamlı gizlilik politikası, analiz açıklamaları ve reklam bilgileriyle genişletilebilir.",
    "Calculate, convert, generate and solve everyday tasks in seconds. No account required.":"Hesaplayın, dönüştürün, oluşturun ve günlük işlerinizi saniyeler içinde çözün. Üyelik gerekmez.",
    "Search tools...":"Araçlarda ara...","No tools matched your search.":"Aramanızla eşleşen araç bulunamadı.",
    "Tip: You can search by what you want to do, like “discount”, “loan”, “QR”, or “password”.":"İpucu: “indirim”, “kredi”, “QR” veya “şifre” gibi yapmak istediğiniz işlemi yazarak arayabilirsiniz.",
    "Fast":"Hızlı","Private":"Gizli","Responsive":"Mobil Uyumlu","Free":"Ücretsiz",
    "Get things done.":"İşinizi halledin.","Simple tools with zero friction.":"Sade ve zahmetsiz araçlar.",
    "Length":"Uzunluk","Weight":"Ağırlık","Temperature":"Sıcaklık","Value":"Değer","From":"Kaynak","To":"Hedef",
    "Amount":"Miktar","Convert":"Dönüştür","Date of birth":"Doğum tarihi","Calculate age":"Yaşı hesapla",
    "Uppercase":"Büyük harf","Lowercase":"Küçük harf","Numbers":"Rakamlar","Symbols":"Semboller",
    "Generate new password":"Yeni şifre oluştur","Paste or type your text here...":"Metninizi buraya yazın veya yapıştırın...",
    "Words":"Kelime","Characters":"Karakter","Lines":"Satır","Reading time":"Okuma süresi","Weight (kg)":"Ağırlık (kg)","Height (cm)":"Boy (cm)",
    "Calculate BMI":"VKİ hesapla","BMI":"VKİ","Start date":"Başlangıç tarihi","End date":"Bitiş tarihi","Calculate difference":"Farkı hesapla","Difference":"Fark",
    "Text or URL":"Metin veya URL","Download PNG":"PNG indir","Countdown":"Geri Sayım","Stopwatch":"Kronometre",
    "Start":"Başlat","Pause":"Duraklat","Resume":"Devam Et","Reset":"Sıfırla","Minimum":"En düşük","Maximum":"En yüksek",
    "UPPERCASE":"BÜYÜK HARF","lowercase":"küçük harf","Title Case":"Başlık Biçimi","Sentence case":"Cümle Biçimi","Copy result":"Sonucu kopyala",
    "Pick a color and copy HEX or RGB values.":"Bir renk seçin ve HEX veya RGB değerlerini kopyalayın.",
    "Fast arithmetic without leaving the page.":"Sayfadan ayrılmadan hızlı matematik işlemleri yapın.","Convert length, weight and temperature.":"Uzunluk, ağırlık ve sıcaklık birimlerini dönüştürün.",
    "Find exact age in years, months and days.":"Yaşınızı yıl, ay ve gün olarak tam hesaplayın.","Count words, characters, lines and reading time.":"Kelime, karakter, satır ve okuma süresini sayın.",
    "Handle common percentage questions quickly.":"Yaygın yüzde hesaplamalarını hızlıca yapın.","Calculate body mass index using metric units.":"Metrik birimlerle vücut kitle indeksini hesaplayın.",
    "Find the number of days between dates.":"İki tarih arasındaki gün sayısını bulun.","Turn text or a URL into a downloadable QR code.":"Metni veya URL'yi indirilebilir QR koda dönüştürün.",
    "A simple focus timer and stopwatch.":"Basit bir odak sayacı ve kronometre.","Generate a random integer between two values.":"İki değer arasında rastgele tam sayı oluşturun.",
    "Convert text to upper, lower, title or sentence case.":"Metni büyük harf, küçük harf, başlık veya cümle biçimine dönüştürün.","Pick a color and copy HEX or RGB values.":"Renk seçin ve HEX veya RGB değerlerini kopyalayın.",
    "Format, validate or minify JSON directly in your browser.":"JSON verisini tarayıcınızda biçimlendirin, doğrulayın veya küçültün.",
    "Encode and decode UTF-8 text without leaving your browser.":"UTF-8 metinleri tarayıcıdan çıkmadan kodlayın ve çözün.",
    "Generate cryptographically strong UUID v4 identifiers locally.":"Kriptografik olarak güçlü UUID v4 kimliklerini yerel olarak oluşturun.",
    "Generate placeholder paragraphs, sentences or words.":"Yer tutucu paragraf, cümle veya kelimeler oluşturun.",
    "Format":"Biçimlendir","Minify":"Küçült","Validate":"Doğrula","Clear":"Temizle","Status":"Durum","Valid JSON":"Geçerli JSON","Invalid JSON":"Geçersiz JSON",
    "Encoded":"Kodlandı","Decoded":"Çözüldü","Click generate":"Oluşturmak için tıklayın","Quantity":"Adet","Generate UUIDs":"UUID'leri oluştur","Copy results":"Sonuçları kopyala",
    "Type":"Tür","Paragraphs":"Paragraf","Sentences":"Cümle","Generated text will appear here...":"Oluşturulan metin burada görünecek...",
    "Type or paste text...":"Metin yazın veya yapıştırın...","Paste JSON here...":"JSON verisini buraya yapıştırın...",
    "Add VAT":"KDV ekle","Remove VAT":"KDV çıkar","Total with VAT":"KDV dahil toplam","Price without VAT":"KDV hariç fiyat",
    "Bill amount":"Hesap tutarı","Tip %":"Bahşiş %","People":"Kişi","Total":"Toplam","You pay":"Ödenecek tutar","Original price":"İndirim öncesi fiyat",
    "Discount %":"İndirim %","You save":"Tasarrufunuz","Current time":"Şu an","Timestamp → Date":"Zaman damgası → Tarih","Date → Timestamp":"Tarih → Zaman damgası",
    "Unix timestamp":"Unix zaman damgası","Date and time":"Tarih ve saat","Algorithm":"Algoritma","Invalid text":"Geçersiz metin",
    "SHA-256":"SHA-256","SHA-1":"SHA-1","Meter":"Metre","Kilometer":"Kilometre","Centimeter":"Santimetre","Millimeter":"Milimetre","Mile":"Mil","Yard":"Yarda","Foot":"Fit","Inch":"İnç",
    "Kilogram":"Kilogram","Gram":"Gram","Milligram":"Miligram","Pound":"Pound","Ounce":"Ons","Celsius":"Santigrat","Fahrenheit":"Fahrenhayt","Kelvin":"Kelvin",
    "Enter a valid amount":"Geçerli bir miktar girin","Same currency":"Aynı para birimi","Rate supplied by Frankfurter.":"Kur bilgisi Frankfurter tarafından sağlanıyor.",
    "Loading rate…":"Kur yükleniyor…","Unable to load rate":"Kur alınamadı","Check your connection and try again.":"Bağlantınızı kontrol edip tekrar deneyin.",
    "Total":"Toplam","You save":"Tasarrufunuz","per person":"kişi başı","Current rate":"Güncel kur","Result copied":"Sonuç kopyalandı",
    "Timer finished!":"Sayaç tamamlandı!","Generate a QR code first.":"Önce bir QR kod oluşturun.","QR renderer could not be loaded.":"QR kod oluşturucu yüklenemedi.",
    "HEX copied":"HEX kopyalandı","RGB copied":"RGB kopyalandı","Choose a valid date":"Geçerli bir tarih seçin","years":"yıl","months":"ay","days":"gün","days lived (approximately)":"yaklaşık yaşanan gün",
    "Memory Match":"Hafıza Eşleştirme","Reaction Rush":"Tepki Yarışı","Number Hunt":"Sayı Avı","Rock Paper Scissors":"Taş Kağıt Makas",
"Quick Math":"Hızlı Matematik","Word Guess":"Kelime Tahmini","Mini Sudoku":"Mini Sudoku","Sequence":"Sıralama",
"Solve as many calculations as you can in 30 seconds.":"30 saniyede mümkün olduğunca çok işlem çözün.","Guess the hidden word before you run out of tries.":"Denemeleriniz bitmeden gizli kelimeyi bulun.",
"Complete the 4×4 number puzzle.":"4×4 sayı bulmacasını tamamlayın.","Remember the sequence and repeat it correctly.":"Sırayı hatırlayın ve doğru şekilde tekrarlayın.",
"Check":"Kontrol et","Score":"Skor","Seconds":"Saniye","Answer":"Cevap","Guess":"Tahmin et","Lives":"Can","Check Sudoku":"Sudokuyu kontrol et","Start Game":"Oyunu başlat","Game over":"Oyun bitti","Try again":"Tekrar deneyin","Level":"Seviye",
"Games":"Oyunlar","BRAIN GAMES":"ZİHİN OYUNLARI","Play. Think. Improve.":"Oyna. Düşün. Geliş.","Founder: Selim":"Kurucu: Selim","Games":"Oyunlar","BRAIN GAMES":"ZİHİN OYUNLARI","Play. Think. Improve.":"Oyna. Düşün. Geliş.",
"Quick browser games for focus, memory and reaction speed.":"Odaklanma, hafıza ve tepki hızını geliştiren hızlı tarayıcı oyunları.",
"Match the pairs and test your memory.":"Kart çiftlerini eşleştirin ve hafızanızı test edin.","How fast can you react?":"Ne kadar hızlı tepki verebilirsin?",
"Find the hidden number with fewer guesses.":"Gizli sayıyı daha az tahminle bul.","Play a quick match against the computer.":"Bilgisayara karşı hızlı bir maç yap.",
"Find all matching pairs.":"Tüm eşleşen kart çiftlerini bulun.","Moves":"Hamle","Pairs":"Çift","New game":"Yeni oyun",
"Wait for green, then click as fast as you can.":"Yeşili bekleyin, ardından mümkün olduğunca hızlı tıklayın.","Reaction time":"Tepki süresi","Best":"En iyi",
"Guess the hidden number from 1 to 100.":"1 ile 100 arasındaki gizli sayıyı tahmin edin.","Check guess":"Tahmini kontrol et","Attempts":"Deneme",
"Too low":"Daha büyük bir sayı deneyin.","Too high":"Daha küçük bir sayı deneyin.","Correct":"Doğru!","You found it":"Buldunuz!",
"Choose your move and play against the computer.":"Hamlenizi seçin ve bilgisayara karşı oynayın.","Rock":"Taş","Paper":"Kağıt","Scissors":"Makas",
"Choose a move":"Bir hamle seçin","You win!":"Kazandınız!","You lose!":"Kaybettiniz!","Draw!":"Berabere!","Waiting...":"Bekleyin...",
"Click now!":"ŞİMDİ TIKLA!","Too early!":"Çok erken!","Your reaction":"Tepkiniz","ms":"ms","Error":"Hata","min":"dk","Select at least one option":"En az bir seçenek seçin","Password copied":"Şifre kopyalandı","Choose a valid date":"Geçerli bir tarih seçin","Copy":"Kopyala","Close":"Kapat","Result":"Sonuç"
    ,"Tip: You can search by what you want to do, like “discount”, “loan”, “QR”, or “password”.":"İpucu: “indirim”, “kredi”, “QR” veya “şifre” gibi yapmak istediğiniz işlemi yazarak arayabilirsiniz.",
    "Enter your bill, choose a tip and split it between people.":"Hesap tutarını girin, bahşiş oranını seçin ve kişi sayısını belirleyin.",
    "See the sale price and exactly how much you save.":"İndirimli fiyatı ve tam olarak ne kadar tasarruf ettiğinizi görün.",
    "Add VAT to a price or remove VAT from a VAT-inclusive price.":"Fiyata KDV ekleyin veya KDV dahil fiyattan KDV'yi çıkarın.",
    "Convert Unix timestamps to dates and dates to Unix time.":"Unix zaman damgalarını tarihe, tarihleri Unix zaman damgasına dönüştürün.",
    "Safely encode or decode text used inside URLs.":"URL'lerde kullanılan metinleri güvenli şekilde kodlayın veya çözün.",
    "Create SHA-256 or SHA-1 hashes locally in your browser.":"SHA-256 veya SHA-1 özetlerini tarayıcınızda yerel olarak oluşturun.",
    "Generate hash":"Özet oluştur","Hash":"Özet",
    "Generate secure random UUIDs":"Güvenli rastgele UUID'ler oluşturun",
    "Generate placeholder paragraphs, sentences or words.":"Yer tutucu paragraf, cümle veya kelimeler oluşturun.",
    "Percentage Calculator":"Yüzde Hesaplama","Choose what you want to calculate. It's easier than formulas.":"Ne hesaplamak istediğinizi seçin. Formüllerden daha kolay.",
    "What is X% of Y?":"X'in yüzde Y'si nedir?","Percentage change":"Yüzde değişimi","Discount price":"İndirimli fiyat",
    "% of":"%'si","Answer":"Sonuç","Change":"Değişim","Discount":"İndirim","It increased by":"Şu kadar arttı:","It decreased by":"Şu kadar azaldı:",
    "Calculate body mass index using metric units.":"Metrik birimlerle vücut kitle indeksini hesaplayın.",
    "BMI is a screening measure, not a medical diagnosis.":"VKİ bir tarama ölçümüdür; tıbbi tanı değildir.",
    "Turn text or a URL into a downloadable QR code.":"Metni veya URL'yi indirilebilir QR koda dönüştürün.",
    "Pick a color and copy HEX or RGB values.":"Bir renk seçin ve HEX veya RGB değerlerini kopyalayın.",
    "Copied":"Kopyalandı","Generate hash":"Özet oluştur","Copy result":"Sonucu kopyala",
    "per person ×":"kişi başı ×","You save":"Tasarrufunuz","VAT:":"KDV:","Date":"Tarih","Price":"Fiyat","VAT %":"KDV %",
    "Converted amount":"Dönüştürülen miktar","Current rates from the Frankfurter public API.":"Frankfurter herkese açık API'sinden güncel kurlar.",
    "Password Generator":"Şifre Oluşturucu","Strong password":"Güçlü şifre","Copy":"Kopyala","Generate new password":"Yeni şifre oluştur",
    "Count words, characters, lines and reading time.":"Kelime, karakter, satır ve okuma süresini sayın.",
    "Reading time":"Okuma süresi","BMI":"VKİ","Difference":"Fark","Download PNG":"PNG indir",
    "A simple focus timer and stopwatch.":"Basit bir odak sayacı ve kronometre.",
    "Generate a random integer between two values.":"İki değer arasında rastgele tam sayı oluşturun.",
    "Convert text to upper, lower, title or sentence case.":"Metni büyük harf, küçük harf, başlık veya cümle biçimine dönüştürün.",
    "Pick a color and copy HEX or RGB values.":"Bir renk seçin ve HEX veya RGB değerlerini kopyalayın.",
    "Brain Rush. Built for everyday life.":"Brain Rush. Günlük yaşam için tasarlandı."
  }
};

function t(value){
  const lang=localStorage.getItem('brainrush-language')||'en';
  return (translations[lang]&&translations[lang][value])||value;
}

const originalTextNodes = new WeakMap();

function translateRoot(root=document){
  const lang=localStorage.getItem('brainrush-language')||'en';
  const dict=translations[lang]||translations.en;
  const scope=root||document;

  // Use only explicit i18n markers here. This avoids TreeWalker/NodeFilter
  // compatibility issues and prevents runtime errors from disabling all buttons.
  scope.querySelectorAll?.('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(Object.prototype.hasOwnProperty.call(dict,key)) el.textContent=dict[key];
  });

  scope.querySelectorAll?.('input[placeholder], textarea[placeholder]').forEach(el=>{
    if(!el.dataset.originalPlaceholder) el.dataset.originalPlaceholder=el.getAttribute('placeholder')||'';
    const key=el.dataset.originalPlaceholder;
    el.setAttribute('placeholder',dict[key]||key);
  });
}

function setLanguage(lang){
  const safeLang=translations[lang]?lang:'en';
  localStorage.setItem('brainrush-language',safeLang);
  document.documentElement.lang=safeLang;
  document.title=safeLang==='tr'?'Brain Rush — Ücretsiz Günlük Araçlar':'Brain Rush — Free Everyday Tools';
  const desc=document.querySelector('meta[name="description"]');
  if(desc) desc.content=safeLang==='tr'
    ?'Brain Rush; hesaplama, dönüştürme, metin, tarih, şifre, QR kod ve günlük işler için ücretsiz çevrimiçi araçlar sunar.'
    :'Brain Rush is a free collection of fast online tools for calculations, conversions, text, dates, passwords, QR codes and everyday tasks.';
  const languageSelect=$('#languageSelect');
  if(languageSelect) languageSelect.value=safeLang;
  translateRoot(document);
  if(modal && !modal.hidden) translateRoot(modalBody);
}

const initialLanguage=localStorage.getItem('brainrush-language')||'en';
document.documentElement.lang=translations[initialLanguage]?initialLanguage:'en';
const langSelect=$('#languageSelect');
if(langSelect){
  langSelect.value=document.documentElement.lang;
  langSelect.addEventListener('change',e=>setLanguage(e.target.value));
}
try{translateRoot(document);}catch(e){console.warn('Brain Rush translation skipped:',e);}


const toolTemplates = {
  calculator:'calculatorTemplate',unit:'unitTemplate',currency:'currencyTemplate',age:'ageTemplate',json:'jsonTemplate',base64:'base64Template',uuid:'uuidTemplate',lorem:'loremTemplate',loan:'loanTemplate',compound:'compoundTemplate',base:'baseTemplate',reverse:'reverseTemplate',timezone:'timezoneTemplate',fuel:'fuelTemplate',salary:'salaryTemplate',savings:'savingsTemplate',ratio:'ratioTemplate',speed:'speedTemplate',slug:'slugTemplate',regex:'regexTemplate',randompick:'randompickTemplate',profit:'profitTemplate',breakeven:'breakevenTemplate',workhours:'workhoursTemplate',dateadd:'dateaddTemplate',datasize:'datasizeTemplate',pace:'paceTemplate',contrast:'contrastTemplate',utm:'utmTemplate',duplicates:'duplicatesTemplate',wordfreq:'wordfreqTemplate',coin:'coinTemplate',dice:'diceTemplate',teams:'teamsTemplate',decide:'decideTemplate',
  password:'passwordTemplate',text:'textTemplate',percentage:'percentageTemplate',tip:'tipTemplate',discount:'discountTemplate',vat:'vatTemplate',timestamp:'timestampTemplate',url:'urlTemplate',hash:'hashTemplate',bmi:'bmiTemplate',
  date:'dateTemplate',qr:'qrTemplate',timer:'timerTemplate',random:'randomTemplate',case:'caseTemplate',color:'colorTemplate'
};

// Delegated clicks keep the interface working even if cards are re-rendered.
document.addEventListener('click',e=>{
  const tool=e.target.closest?.('.tool-card');
  if(tool){e.preventDefault();openTool(tool.dataset.tool);return;}
  const game=e.target.closest?.('.game-card');
  if(game){e.preventDefault();openGame(game.dataset.game);}
});

function openTool(name){
  const template = document.getElementById(toolTemplates[name]);
  if (!template) return;
  modalBody.replaceChildren(template.content.cloneNode(true));
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  bindTool(name);
  translateRoot(modalBody);
  setTimeout(() => $('.modal-close')?.focus(), 0);
}
function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = '';
  if(activeTimer){clearInterval(activeTimer);activeTimer=null;}
}
const modalClose=$('#modalClose');
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !modal.hidden) closeModal(); });

function bindTool(name){
  if(name==='calculator') bindCalculator();
  if(name==='json') bindJSON();
  if(name==='base64') bindBase64();
  if(name==='uuid') bindUUID();
  if(name==='lorem') bindLorem();
  if(name==='unit') bindUnit();
  if(name==='currency') bindCurrency();
  if(name==='age') bindAge();
  if(name==='password') bindPassword();
  if(name==='text') bindText();
  if(name==='percentage') bindPercentage();
  if(name==='tip') bindTip(); if(name==='discount') bindDiscount(); if(name==='vat') bindVAT(); if(name==='timestamp') bindTimestamp(); if(name==='url') bindURL(); if(name==='hash') bindHash();
  if(name==='bmi') bindBMI();
  if(name==='date') bindDate();
  if(name==='qr') bindQR();
  if(name==='timer') bindTimer();
  if(name==='random') bindRandom();
  if(name==='case') bindCase();
  if(name==='color') bindColor();
  if(name==='loan') bindLoan();
  if(name==='compound') bindCompound();
  if(name==='base') bindBase();
  if(name==='reverse') bindReverse();
  if(name==='timezone') bindTimezone(); if(name==='profit') bindProfit(); if(name==='breakeven') bindBreakEven(); if(name==='workhours') bindWorkHours(); if(name==='dateadd') bindDateAdd(); if(name==='datasize') bindDataSize(); if(name==='pace') bindPace(); if(name==='contrast') bindContrast(); if(name==='utm') bindUTM(); if(name==='duplicates') bindDuplicates(); if(name==='wordfreq') bindWordFreq(); if(name==='coin') bindCoin(); if(name==='dice') bindDice(); if(name==='teams') bindTeams(); if(name==='decide') bindDecide(); if(name==='fuel') bindFuel(); if(name==='salary') bindSalary(); if(name==='savings') bindSavings(); if(name==='ratio') bindRatio(); if(name==='speed') bindSpeed(); if(name==='slug') bindSlug(); if(name==='regex') bindRegex(); if(name==='randompick') bindRandomPick();
}



function bindFuel(){const c=()=>{const d=Math.max(0,Number($('#fuelDistance').value)||0),l=Math.max(0,Number($('#fuelConsumption').value)||0),p=Math.max(0,Number($('#fuelPrice').value)||0);$('#fuelLiters').textContent=(d*l/100).toFixed(2)+' L';$('#fuelCost').textContent=(d*l/100*p).toFixed(2);};['fuelDistance','fuelConsumption','fuelPrice'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindSalary(){const c=()=>{const m=Math.max(0,Number($('#salaryMonthly').value)||0),d=Math.max(1,Number($('#salaryDays').value)||1),h=Math.max(1,Number($('#salaryHours').value)||1);$('#salaryDaily').textContent=(m/d).toFixed(2);$('#salaryHourly').textContent=(m/d/h).toFixed(2);};['salaryMonthly','salaryDays','salaryHours'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindSavings(){const c=()=>{const t=Math.max(0,Number($('#saveTarget').value)||0),cur=Math.max(0,Number($('#saveCurrent').value)||0),m=Math.max(0,Number($('#saveMonthly').value)||0),rem=Math.max(0,t-cur);$('#saveRemaining').textContent=rem.toFixed(2);$('#saveMonths').textContent=rem===0?'0':m>0?String(Math.ceil(rem/m)):'—';};['saveTarget','saveCurrent','saveMonthly'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindRatio(){const c=()=>{const w=Math.max(0,Number($('#ratioWidth').value)||0),h=Math.max(0,Number($('#ratioHeight').value)||0),nw=Math.max(0,Number($('#ratioNewWidth').value)||0);if(!w||!h){$('#ratioValue').textContent='—';$('#ratioNewHeight').textContent='—';return;}const g=(a,b)=>b?g(b,a%b):a,d=g(Math.round(w),Math.round(h));$('#ratioValue').textContent=(w/d)+':'+(h/d);$('#ratioNewHeight').textContent=(nw*h/w).toFixed(2);};['ratioWidth','ratioHeight','ratioNewWidth'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindSpeed(){const c=()=>{const v=Number($('#speedValue').value)||0,f=$('#speedFrom').value,to=$('#speedTo').value,factor={kmh:1,mph:1.609344,ms:3.6};const kmh=v*factor[f],out=kmh/factor[to];$('#speedResult').textContent=out.toFixed(4)+' '+to;};['speedValue','speedFrom','speedTo'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindSlug(){const i=$('#slugInput'),o=$('#slugOutput');const c=()=>{o.value=i.value.toLowerCase().trim().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');};i?.addEventListener('input',c);c();}
function bindRegex(){const c=()=>{try{const r=new RegExp($('#regexPattern').value,$('#regexFlags').value);const m=$('#regexText').value.match(r);$('#regexResult').textContent=m?(m[0]||'Match found'):'No match';}catch(e){$('#regexResult').textContent='Invalid regex';}};['regexPattern','regexFlags','regexText'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindRandomPick(){const i=$('#pickInput'),o=$('#pickResult');$('#pickButton')?.addEventListener('click',()=>{const a=i.value.split(/\\r?\\n/).map(x=>x.trim()).filter(Boolean);o.textContent=a.length?a[Math.floor(Math.random()*a.length)]:t('Enter at least one item');});}
function bindProfit(){const c=()=>{const cost=Number($('#profitCost').value)||0,sale=Number($('#profitSale').value)||0,p=sale-cost;$('#profitValue').textContent=p.toFixed(2);$('#profitMargin').textContent=sale?((p/sale)*100).toFixed(2)+'%':'—';$('#profitMarkup').textContent=cost?((p/cost)*100).toFixed(2)+'%':'—';};['profitCost','profitSale'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindBreakEven(){const c=()=>{const f=Number($('#beFixed').value)||0,p=Number($('#bePrice').value)||0,v=Number($('#beVariable').value)||0,d=p-v,u=d>0?f/d:0;$('#beUnits').textContent=d>0?Math.ceil(u):'—';$('#beRevenue').textContent=d>0?(Math.ceil(u)*p).toFixed(2):'—';};['beFixed','bePrice','beVariable'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindWorkHours(){const c=()=>{const s=$('#whStart').value,e=$('#whEnd').value,b=Number($('#whBreak').value)||0;if(!s||!e)return;let a=s.split(':').map(Number),z=e.split(':').map(Number),m=(z[0]*60+z[1])-(a[0]*60+a[1]);if(m<0)m+=1440;m=Math.max(0,m-b);$('#whResult').textContent=Math.floor(m/60)+'h '+(m%60)+'m';};['whStart','whEnd','whBreak'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindDateAdd(){const c=()=>{const d=new Date($('#daDate').value+'T12:00:00'),n=Number($('#daAmount').value)||0,u=$('#daUnit').value;if(Number.isNaN(d.getTime()))return;if(u==='day')d.setDate(d.getDate()+n);if(u==='week')d.setDate(d.getDate()+n*7);if(u==='month')d.setMonth(d.getMonth()+n);$('#daResult').textContent=d.toLocaleDateString();};['daDate','daAmount','daUnit'].forEach(id=>$('#'+id)?.addEventListener('input',c));const x=new Date();$('#daDate').value=x.toISOString().slice(0,10);c();}
function bindDataSize(){const units={Byte:0,KB:1,MB:2,GB:3,TB:4};const c=()=>{const v=Number($('#dsValue').value)||0,a=units[$('#dsFrom').value],b=units[$('#dsTo').value];$('#dsResult').textContent=(v*Math.pow(1024,a-b)).toLocaleString(undefined,{maximumFractionDigits:6});};['dsValue','dsFrom','dsTo'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindPace(){const c=()=>{const d=Number($('#paceDistance').value)||0,t=Number($('#paceTime').value)||0;if(d<=0){$('#paceResult').textContent='—';$('#paceSpeed').textContent='—';return;}const pace=t/d,min=Math.floor(pace),sec=Math.round((pace-min)*60);$('#paceResult').textContent=min+':'+String(sec).padStart(2,'0')+' / km';$('#paceSpeed').textContent=(d/(t/60)).toFixed(2)+' km/h';};['paceDistance','paceTime'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindContrast(){const lum=h=>{const a=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4));return .2126*a[0]+.7152*a[1]+.0722*a[2]};const c=()=>{const a=lum($('#contrastText').value),b=lum($('#contrastBg').value),r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);$('#contrastResult').textContent=r.toFixed(2)+':1';};['contrastText','contrastBg'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindUTM(){const c=()=>{try{const u=new URL($('#utmUrl').value);[['utm_source','#utmSource'],['utm_medium','#utmMedium'],['utm_campaign','#utmCampaign']].forEach(([k,s])=>{const v=$(s).value.trim();if(v)u.searchParams.set(k,v)});$('#utmResult').textContent=u.toString();}catch{$('#utmResult').textContent='Invalid URL';}};['utmUrl','utmSource','utmMedium','utmCampaign'].forEach(id=>$('#'+id)?.addEventListener('input',c));c();}
function bindDuplicates(){$('#dupButton')?.addEventListener('click',()=>{const a=$('#dupInput').value.split(/\r?\n/),seen=new Set();$('#dupOutput').value=a.filter(x=>{const k=x.trim();if(!k||seen.has(k))return false;seen.add(k);return true}).join('\n');});}
function bindWordFreq(){$('#freqButton')?.addEventListener('click',()=>{const words=$('#freqInput').value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[],m={};words.forEach(w=>m[w]=(m[w]||0)+1);const top=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,20);$('#freqResult').textContent=top.length?top.map((x,i)=>(i+1)+'. '+x[0]+' — '+x[1]).join(' | '):'No words found';});}
function bindLoan(){
  const calc=()=>{
    const p=Number($('#loanAmount').value)||0,r=(Number($('#loanRate').value)||0)/100/12,n=Math.max(1,Math.round(Number($('#loanMonths').value)||1));
    const payment=r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=payment*n,interest=total-p;
    $('#loanPayment').textContent=payment.toLocaleString(undefined,{maximumFractionDigits:2});
    $('#loanTotal').textContent=total.toLocaleString(undefined,{maximumFractionDigits:2});
    $('#loanInterest').textContent=interest.toLocaleString(undefined,{maximumFractionDigits:2});
  };
  ['loanAmount','loanRate','loanMonths'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function bindCompound(){
  const calc=()=>{
    const p=Number($('#compoundPrincipal').value)||0,rate=(Number($('#compoundRate').value)||0)/100,years=Number($('#compoundYears').value)||0,n=Math.max(1,Math.round(Number($('#compoundPeriods').value)||12));
    const total=p*Math.pow(1+rate/n,n*years),gain=total-p;
    $('#compoundTotal').textContent=total.toLocaleString(undefined,{maximumFractionDigits:2});
    $('#compoundGain').textContent=gain.toLocaleString(undefined,{maximumFractionDigits:2});
  };
  ['compoundPrincipal','compoundRate','compoundYears','compoundPeriods'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function bindBase(){
  const input=$('#baseInput'),from=$('#baseFrom'),to=$('#baseTo'),out=$('#baseResult');
  const convert=()=>{try{const n=parseInt(input.value.trim(),Number(from.value));if(!Number.isFinite(n))throw 0;out.value=n.toString(Number(to.value)).toUpperCase();}catch{out.value='—';}};
  [input,from,to].forEach(el=>el.addEventListener('input',convert));convert();
}
function bindReverse(){
  const input=$('#reverseInput'),out=$('#reverseOutput');
  input.addEventListener('input',()=>out.value=[...input.value].reverse().join('')); 
}
function bindTimezone(){
  const date=$('#tzDate'),zone=$('#tzZone'),out=$('#tzResult');
  const update=()=>{const d=new Date(date.value);if(Number.isNaN(d.getTime())){out.textContent='—';return;}out.textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'long',timeZone:zone.value}).format(d);};
  [date,zone].forEach(el=>el.addEventListener('input',update));update();
}

function bindTip(){
  const calc=()=>{const b=Number($('#tipBill').value)||0,p=Number($('#tipPercent').value)||0,n=Math.max(1,Number($('#tipPeople').value)||1),tip=b*p/100,total=b+tip;$('#tipTotal').textContent=total.toFixed(2);$('#tipPerPerson').textContent=(total/n).toFixed(2)+' '+t('per person')+(n===1?'':' × '+n);};
  ['tipBill','tipPercent','tipPeople'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function bindDiscount(){
  const calc=()=>{const p=Number($('#discountPrice').value)||0,r=Number($('#discountRate').value)||0,s=p*r/100;$('#discountFinal').textContent=(p-s).toFixed(2);$('#discountSaved').textContent=t('You save')+' '+s.toFixed(2);};
  ['discountPrice','discountRate'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function bindVAT(){
  let mode='add';
  const calc=()=>{const p=Number($('#vatPrice').value)||0,r=Number($('#vatRate').value)||0;if(mode==='add'){const tax=p*r/100;$('#vatLabel').textContent=t('Total with VAT');$('#vatResult').textContent=(p+tax).toFixed(2);$('#vatTax').textContent='VAT: '+tax.toFixed(2);}else{const net=p/(1+r/100),tax=p-net;$('#vatLabel').textContent=t('Price without VAT');$('#vatResult').textContent=net.toFixed(2);$('#vatTax').textContent='VAT: '+tax.toFixed(2);}};
  $('[data-vat-mode]').forEach(b=>b.addEventListener('click',()=>{$('[data-vat-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.vatMode;calc();}));
  ['vatPrice','vatRate'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function bindTimestamp(){
  const now=()=>{const d=new Date(),ts=Math.floor(d.getTime()/1000);$('#tsCurrent').textContent=ts;$('#tsCurrentDate').textContent=d.toLocaleString();};
  $('[data-ts-mode]').forEach(b=>b.addEventListener('click',()=>{$('[data-ts-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#tsNow').hidden=b.dataset.tsMode!=='now';$('#tsToDate').hidden=b.dataset.tsMode!=='toDate';$('#tsToTs').hidden=b.dataset.tsMode!=='toTs';}));
  $('#tsInput').addEventListener('input',()=>{const n=Number($('#tsInput').value);$('#tsDateResult').textContent=Number.isFinite(n)?new Date(n*1000).toLocaleString():'—';});
  $('#dateTimeInput').addEventListener('input',()=>{const d=new Date($('#dateTimeInput').value);$('#tsResult').textContent=Number.isFinite(d.getTime())?Math.floor(d.getTime()/1000):'—';});
  now();
}
function bindURL(){
  const i=$('#urlInput'),o=$('#urlOutput');
  $('[data-url-action]').forEach(b=>b.addEventListener('click',()=>{try{if(b.dataset.urlAction==='encode')o.value=encodeURIComponent(i.value);else if(b.dataset.urlAction==='decode')o.value=decodeURIComponent(i.value);else{o.value='';i.value='';}}catch{o.value=t('Invalid text');}}));
  $('#copyURL').addEventListener('click',()=>copyText(o.value,t('Result copied')));
}
async function bindHash(){
  const i=$('#hashInput'),o=$('#hashResult');
  $('#generateHash').addEventListener('click',async()=>{const data=new TextEncoder().encode(i.value),buf=await crypto.subtle.digest($('#hashAlgorithm').value,data);o.textContent=Array.from(new Uint8Array(buf),b=>b.toString(16).padStart(2,'0')).join('');});
  $('#copyHash').addEventListener('click',()=>copyText(o.textContent,t('Result copied')));
}

function bindJSON(){
  const input=$('#jsonInput'),output=$('#jsonOutput'),status=$('#jsonStatus');
  const run=(action)=>{
    try{
      if(action==='clear'){input.value='';output.value='';status.textContent='—';return;}
      const data=JSON.parse(input.value);
      if(action==='format') output.value=JSON.stringify(data,null,2);
      if(action==='minify') output.value=JSON.stringify(data);
      if(action==='validate'){output.value=input.value;status.textContent=t('Valid JSON');return;}
      status.textContent=t('Valid JSON');
    }catch(e){output.value='';status.textContent=t('Invalid JSON')+' — '+(e.message||'');}
  };
  $('[data-json-action]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.jsonAction)));
  $('#copyJson').addEventListener('click',()=>copyText(output.value,t('Result copied')));
}

function bindBase64(){
  const input=$('#base64Input'),output=$('#base64Output');
  const encode=()=>{
    try{output.value=btoa(unescape(encodeURIComponent(input.value)));}catch{output.value='';}
  };
  const decode=()=>{
    try{output.value=decodeURIComponent(escape(atob(input.value.trim())));}catch{output.value='Invalid Base64';}
  };
  $('[data-base64-action]').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.base64Action==='encode') encode();
    else if(b.dataset.base64Action==='decode') decode();
    else {input.value='';output.value='';}
  }));
  $('#copyBase64').addEventListener('click',()=>copyText(output.value,t('Result copied')));
}

function makeUUID(){
  if(crypto.randomUUID) return crypto.randomUUID();
  const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  return [...bytes].map((b,i)=>[4,6,8,10].includes(i)?'-'+b.toString(16).padStart(2,'0'):b.toString(16).padStart(2,'0')).join('');
}
function bindUUID(){
  const out=$('#uuidResult');
  const generate=()=>{
    const n=Number($('#uuidCount').value)||1;
    out.textContent=Array.from({length:n},makeUUID).join('\n');
  };
  $('#generateUUID').addEventListener('click',generate);
  $('#copyUUID').addEventListener('click',()=>copyText(out.textContent,t('Result copied')));
  generate();
}

function bindLorem(){
  const output=$('#loremOutput');
  const words=('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat').split(' ');
  const sentence=()=>Array.from({length:12},()=>words[Math.floor(Math.random()*words.length)]).join(' ').replace(/^./,x=>x.toUpperCase())+'.';
  const generate=()=>{
    const type=$('#loremType').value,n=Math.min(50,Math.max(1,Number($('#loremCount').value)||1));
    if(type==='words') output.value=Array.from({length:n},()=>words[Math.floor(Math.random()*words.length)]).join(' ');
    else if(type==='sentences') output.value=Array.from({length:n},sentence).join(' ');
    else output.value=Array.from({length:n},()=>Array.from({length:4},sentence).join(' ')).join('\n\n');
  };
  $('#generateLorem').addEventListener('click',generate);
  $('#copyLorem').addEventListener('click',()=>copyText(output.value,t('Result copied')));
  generate();
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
    $('#unitResult').textContent = Number(out.toFixed(8)).toLocaleString()+' '+t(to.value[0].toUpperCase()+to.value.slice(1));
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
  const convert=async()=>{
    const n=Number(amount.value);
    if(!Number.isFinite(n)||n<0){result.textContent=t('Enter a valid amount');status.textContent='';return;}
    if(from.value===to.value){result.textContent=n.toLocaleString(undefined,{maximumFractionDigits:2})+' '+to.value;status.textContent=t('Same currency');return;}
    result.textContent='…';status.textContent=t('Loading rate…');
    try{
      const res=await fetch('https://api.frankfurter.app/latest?amount='+encodeURIComponent(n)+'&from='+encodeURIComponent(from.value)+'&to='+encodeURIComponent(to.value),{cache:'no-store'});
      if(!res.ok) throw new Error('rate');
      const data=await res.json();
      const rate=Number(data.rates?.[to.value]);
      if(!Number.isFinite(rate)) throw new Error('rate');
      result.textContent=rate.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:4})+' '+to.value;
      status.textContent=t('Rate supplied by Frankfurter.')+' • '+new Date(data.date).toLocaleDateString();
    }catch{
      result.textContent=t('Unable to load rate');
      status.textContent=t('Check your connection and try again.');
    }
  };
  $('#currencyConvert').addEventListener('click',convert);
  [from,to,amount].forEach(el=>el.addEventListener('change',()=>{if(amount.value) convert();}));
  amount.addEventListener('keydown',e=>{if(e.key==='Enter') convert();});
  convert();
}
function bindAge(){
  const input=$('#birthDate'),now=new Date();
  input.max=now.toISOString().slice(0,10);
  input.value='1990-01-01';
  $('#ageCalculate').addEventListener('click',()=>{
    const birth=new Date(input.value+'T00:00:00');
    if(!input.value||birth>now){$('#ageResult').textContent=t('Choose a valid date');return;}
    let y=now.getFullYear()-birth.getFullYear(),m=now.getMonth()-birth.getMonth(),d=now.getDate()-birth.getDate();
    if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
    if(m<0){y--;m+=12;}
    const days=Math.floor((now-birth)/86400000);
    $('#ageResult').textContent=y+' '+t('years')+', '+m+' '+t('months')+', '+d+' '+t('days');
    $('#ageDays').textContent=days.toLocaleString()+' '+t('days lived (approximately)');
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
    if(!sets.length){out.value=t('Select at least one option');return;}
    const all=sets.join('');
    const bytes=new Uint32Array(Number(length.value));crypto.getRandomValues(bytes);
    let result='';
    sets.forEach((set,i)=>result+=set[bytes[i]%set.length]);
    for(let i=result.length;i<Number(length.value);i++) result+=all[bytes[i]%all.length];
    out.value=result.split('').sort(()=>Math.random()-.5).join('');
  };
  length.addEventListener('input',()=>$('#passwordLengthOut').textContent=length.value);
  $('#generatePassword').addEventListener('click',generate);
  $('#copyPassword').addEventListener('click',()=>copyText(out.value,t('Password copied')));
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
    $('#readTime').textContent=(words?Math.max(1,Math.ceil(words/200)):0)+' '+t('min');
  };
  input.addEventListener('input',update);update();
}

function bindPercentage(){
  const updateOf=()=>{
    const a=Number($('#pctA').value),b=Number($('#pctB').value);
    const v=b*a/100;
    $('#pctResult').textContent=Number.isFinite(v)?v.toLocaleString():'—';
    $('#pctExplain').textContent=a+'% of '+b+' = '+(Number.isFinite(v)?v:'—');
  };
  const updateChange=()=>{
    const a=Number($('#pctC').value),b=Number($('#pctD').value);
    const v=a!==0?((b-a)/Math.abs(a))*100:0;
    $('#pctResult2').textContent=Number.isFinite(v)?v.toFixed(2)+'%':'—';
    $('#pctChangeExplain').textContent=v>=0?t('It increased by')+' '+Math.abs(v).toFixed(2)+'%.':t('It decreased by')+' '+Math.abs(v).toFixed(2)+'%.';
  };
  const updateDiscount=()=>{
    const p=Number($('#pctPrice').value),d=Number($('#pctDiscount').value),save=p*d/100;
    $('#pctDiscountResult').textContent=(p-save).toLocaleString();
    $('#pctSaveResult').textContent='You save '+save.toLocaleString();
  };
  $$('.percent-tabs [data-pct-mode]').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.percent-tabs [data-pct-mode]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    $('#pctOfPanel').hidden=btn.dataset.pctMode!=='of';$('#pctChangePanel').hidden=btn.dataset.pctMode!=='change';$('#pctDiscountPanel').hidden=btn.dataset.pctMode!=='discount';
  }));
  ['pctA','pctB'].forEach(id=>$('#'+id).addEventListener('input',updateOf));
  ['pctC','pctD'].forEach(id=>$('#'+id).addEventListener('input',updateChange));
  ['pctPrice','pctDiscount'].forEach(id=>$('#'+id).addEventListener('input',updateDiscount));
  updateOf();updateChange();updateDiscount();
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
    $('#dateResult').textContent=days.toLocaleString()+' '+t('days');
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


function openGame(name){
  const ids={memory:'memoryGameTemplate',reaction:'reactionGameTemplate',number:'numberGameTemplate',rps:'rpsGameTemplate',math:'mathGameTemplate',hangman:'hangmanGameTemplate',sudoku:'sudokuGameTemplate',sequence:'sequenceGameTemplate',sizeitup:'sizeitupGameTemplate'};
  const template=document.getElementById(ids[name]);
  if(!template)return;
  modalBody.replaceChildren(template.content.cloneNode(true));
  modal.hidden=false;document.body.style.overflow='hidden';
  if(name==='memory') bindMemoryGame();
  if(name==='reaction') bindReactionGame();
  if(name==='number') bindNumberGame();
  if(name==='rps') bindRPSGame();
  if(name==='math') bindMathGame();
  if(name==='hangman') bindHangmanGame();
  if(name==='sudoku') bindSudokuGame();
  if(name==='sequence') bindSequenceGame(); if(name==='sizeitup') bindSizeItUp();
  translateRoot(modalBody);
  setTimeout(()=>$('.modal-close')?.focus(),0);
}

function bindMemoryGame(){
  const symbols=['🍎','🚀','🎵','⭐','🐼','⚽'];
  let cards=[],open=[],matched=0,moves=0,locked=false;
  const board=$('#memoryBoard'),movesEl=$('#memoryMoves'),pairsEl=$('#memoryPairs'),msg=$('#memoryMessage');
  if(!board)return;
  const render=()=>{
    board.innerHTML='';
    cards.forEach((x,i)=>{
      const btn=document.createElement('button');
      btn.type='button'; btn.className='memory-card'; btn.dataset.i=String(i);
      btn.innerHTML='<span>'+x+'</span>';
      btn.onclick=()=>flip(i);
      board.appendChild(btn);
    });
    movesEl.textContent='0'; pairsEl.textContent='0/6';
    if(msg)msg.textContent='';
  };
  const reset=()=>{
    cards=[...symbols,...symbols].sort(()=>Math.random()-0.5);
    open=[];matched=0;moves=0;locked=false;render();
  };
  const flip=(i)=>{
    if(locked)return;
    const btn=board.querySelectorAll('.memory-card')[i];
    if(!btn||btn.classList.contains('matched')||btn.classList.contains('flipped'))return;
    btn.classList.add('flipped');
    open.push(i);
    if(open.length<2)return;
    moves++;movesEl.textContent=String(moves);
    const [a,b]=open;
    if(cards[a]===cards[b]){
      board.querySelectorAll('.memory-card')[a].classList.add('matched');
      board.querySelectorAll('.memory-card')[b].classList.add('matched');
      matched++;pairsEl.textContent=matched+'/6';open=[];
      if(matched===6&&msg){msg.textContent=t('Correct')+' 🎉';msg.classList.add('game-win');}
    }else{
      locked=true;
      setTimeout(()=>{
        board.querySelectorAll('.memory-card')[a]?.classList.remove('flipped');
        board.querySelectorAll('.memory-card')[b]?.classList.remove('flipped');
        open=[];locked=false;
      },650);
    }
  };
  $('#memoryReset').onclick=reset;
  reset();
}

function bindReactionGame(){
  let started=false,waiting=false,startTime=0,timer=null;
  const box=$('#reactionBox'),textEl=$('#reactionText'),bestKey='brainrush-reaction-best';
  const best=Number(localStorage.getItem(bestKey)||0);
  if(best)$('#reactionBest').textContent=best+' '+t('ms');
  const reset=()=>{
    started=false;waiting=true;box.classList.remove('ready','too-early');textEl.textContent=t('Waiting...');
    clearTimeout(timer);timer=setTimeout(()=>{box.classList.add('ready');textEl.textContent=t('Click now!');started=true;startTime=performance.now();},900+Math.random()*3000);
  };
  box.addEventListener('click',()=>{
    if(waiting&&!started){clearTimeout(timer);waiting=false;box.classList.add('too-early');textEl.textContent=t('Too early!');setTimeout(reset,900);return;}
    if(started){const ms=Math.round(performance.now()-startTime);started=false;waiting=false;box.classList.remove('ready');$('#reactionResult').textContent=ms+' '+t('ms');const old=Number(localStorage.getItem(bestKey)||Infinity);if(ms<old){localStorage.setItem(bestKey,ms);$('#reactionBest').textContent=ms+' '+t('ms');}setTimeout(reset,1000);}
  });
  reset();
}

function bindNumberGame(){
  let target=Math.floor(Math.random()*100)+1,attempts=0;
  const input=$('#numberGuess'),msg=$('#numberMessage');
  $('#numberCheck').addEventListener('click',()=>{
    const n=Number(input.value);if(!n||n<1||n>100)return;
    attempts++;$('#numberAttempts').textContent=attempts;
    if(n===target){msg.textContent=t('Correct')+' 🎉 '+t('You found it')+' '+target;input.disabled=true;return;}
    msg.textContent=n<target?t('Too low'):t('Too high');
  });
  input.addEventListener('keydown',e=>{if(e.key==='Enter')$('#numberCheck').click();});
}

function bindRPSGame(){
  let wins=0,losses=0,draws=0;
  const moves=['rock','paper','scissors'];
  const resultEl=$('#rpsResult'),choicesEl=$('#rpsChoices'),scoreEl=$('#rpsScore');
  const names={rock:t('Rock'),paper:t('Paper'),scissors:t('Scissors')};
  const buttons=document.querySelectorAll('.rps-actions button');
  const play=(player)=>{
    const computer=moves[Math.floor(Math.random()*3)];
    let result='Draw!';
    if(player!==computer){
      const win=(player==='rock'&&computer==='scissors')||(player==='paper'&&computer==='rock')||(player==='scissors'&&computer==='paper');
      if(win){wins++;result='You win!';}else{losses++;result='You lose!';}
    }else draws++;
    choicesEl.textContent=names[player]+' 🆚 '+names[computer];
    resultEl.textContent=t(result);
    scoreEl.textContent=wins+' - '+losses+' - '+draws;
    resultEl.classList.remove('game-pop'); void resultEl.offsetWidth; resultEl.classList.add('game-pop');
  };
  buttons.forEach(btn=>btn.onclick=()=>play(btn.dataset.rps));
}

function bindMathGame(){
  let score=0,time=30,answer=0,timer=null;
  const q=$('#mathQuestion'),input=$('#mathAnswer');
  const next=()=>{const a=Math.floor(Math.random()*20)+1,b=Math.floor(Math.random()*20)+1,ops=['+','−','×'],op=ops[Math.floor(Math.random()*ops.length)];answer=op==='+'?a+b:op==='−'?a-b:a*b;q.textContent=a+' '+op+' '+b;input.value='';input.focus();};
  const start=()=>{score=0;time=30;$('#mathScore').textContent=0;$('#mathTime').textContent=30;clearInterval(timer);next();timer=setInterval(()=>{time--;$('#mathTime').textContent=time;if(time<=0){clearInterval(timer);q.textContent='🏁 '+t('Game over');}},1000);};
  $('#mathCheck').addEventListener('click',()=>{if(time<=0)return; if(Number(input.value)===answer){score++;$('#mathScore').textContent=score;next();}else{input.value='';}});
  input.addEventListener('keydown',e=>{if(e.key==='Enter')$('#mathCheck').click();}); start();
}
function bindHangmanGame(){
  const words=['BRAIN','RUSH','PUZZLE','MEMORY','PLANET','CODING','GARDEN','SCHOOL','COMPUTER','KELIME'];
  let word=words[Math.floor(Math.random()*words.length)],guessed=[],lives=6,finished=false;
  const input=$('#hangmanInput'),button=$('#hangmanGuess');
  const render=()=>{$('#hangmanWord').textContent=word.split('').map(c=>guessed.includes(c)?c:'_').join(' ');$('#hangmanLives').textContent=lives;};
  const guess=()=>{
    if(finished)return;
    const c=input.value.trim().toUpperCase();input.value='';
    if(!/^[A-ZÇĞİÖŞÜ]$/.test(c)||guessed.includes(c))return;
    guessed.push(c);if(!word.includes(c))lives--;render();
    if(word.split('').every(x=>guessed.includes(x))){finished=true;$('#hangmanMessage').textContent=t('Correct')+' 🎉';button.disabled=true;input.disabled=true;}
    else if(lives<=0){finished=true;$('#hangmanMessage').textContent=t('Game over')+' — '+word;button.disabled=true;input.disabled=true;}
  };
  button.onclick=guess;input.onkeydown=e=>{if(e.key==='Enter')guess();};render();
}
function bindSudokuGame(){
  const solution=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
  const puzzle=[[1,0,3,0],[0,4,0,2],[2,0,4,0],[0,3,0,1]];
  const grid=$('#sudokuGrid'),message=$('#sudokuMessage'),check=$('#sudokuCheck');
  if(!grid||!check)return;
  grid.innerHTML='';
  puzzle.forEach((row,r)=>row.forEach((v,c)=>{
    const input=document.createElement('input');
    input.type='number';input.min='1';input.max='4';input.inputMode='numeric';
    input.dataset.r=r;input.dataset.c=c;
    if(v){input.value=v;input.disabled=true;}
    else input.oninput=()=>{if(input.value && !['1','2','3','4'].includes(input.value))input.value='';};
    grid.appendChild(input);
  }));
  check.onclick=()=>{
    let complete=true,correct=true;
    grid.querySelectorAll('input').forEach(input=>{
      const value=Number(input.value);
      if(!value){complete=false;return;}
      if(value!==solution[Number(input.dataset.r)][Number(input.dataset.c)])correct=false;
    });
    message.textContent=!complete?t('Fill all cells'):correct?t('Correct')+' 🎉':t('Try again');
    message.classList.toggle('game-win',complete&&correct);
  };
}
function bindSequenceGame(){
  let sequence=[],user=[],level=0,accepting=false,timer=null;
  const colors=['1','2','3','4'],display=$('#sequenceDisplay'),buttons=$('#sequenceButtons'),message=$('#sequenceMessage'),startBtn=$('#sequenceStart');
  if(!display||!buttons||!startBtn)return;
  const add=()=>{
    sequence.push(colors[Math.floor(Math.random()*colors.length)]);
    user=[];accepting=false;
    display.textContent=sequence.join(' • ');
    clearTimeout(timer);
    timer=setTimeout(()=>{display.textContent='?';accepting=true;},Math.max(700,1100-sequence.length*30));
  };
  const start=()=>{
    clearTimeout(timer);sequence=[];user=[];level=0;accepting=false;message.textContent='';
    buttons.innerHTML=colors.map(c=>'<button type="button" class="sequence-btn" data-v="'+c+'">'+c+'</button>').join('');
    buttons.querySelectorAll('.sequence-btn').forEach(btn=>btn.onclick=()=>{
      if(!accepting)return;
      user.push(btn.dataset.v);
      const i=user.length-1;
      if(user[i]!==sequence[i]){
        accepting=false;message.textContent=t('Game over')+' — '+t('Level')+' '+level;message.classList.remove('game-win');return;
      }
      if(user.length===sequence.length){
        accepting=false;level++;message.textContent=t('Correct')+'! '+t('Level')+' '+level;message.classList.add('game-win');
        timer=setTimeout(add,650);
      }
    });
    add();
  };
  startBtn.onclick=start;
  start();
}

$('.category-pill').forEach(p=>p.addEventListener('click',()=>{
  $('.category-pill').forEach(x=>x.classList.remove('active'));p.classList.add('active');
  const cat=p.dataset.category;
  $('.tool-card').forEach(card=>card.hidden=cat!=='all'&&card.dataset.category!==cat);
  $('#noResults').hidden=true;
}));

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

function bindCoin(){const o=$('#coinResult');$('#coinFlip')?.addEventListener('click',()=>o.textContent=Math.random()<.5?t('Heads'):t('Tails'));}
function bindDice(){const o=$('#diceResult'),c=$('#diceCount'),s=$('#diceSides');$('#rollDice')?.addEventListener('click',()=>{const n=Math.min(10,Math.max(1,Number(c.value)||1)),f=Math.min(100,Math.max(2,Number(s.value)||6)),a=Array.from({length:n},()=>1+Math.floor(Math.random()*f));o.textContent=a.join(' + ')+' = '+a.reduce((x,y)=>x+y,0);});}
function bindTeams(){const i=$('#teamInput'),n=$('#teamCount'),o=$('#teamResult');$('#makeTeams')?.addEventListener('click',()=>{const a=i.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).sort(()=>Math.random()-.5),k=Math.min(20,Math.max(2,Number(n.value)||2));if(!a.length){o.textContent=t('Enter at least one item');return;}const z=Array.from({length:k},()=>[]);a.forEach((x,j)=>z[j%k].push(x));o.innerHTML=z.map((x,j)=>'<div><b>'+t('Team')+' '+(j+1)+'</b>: '+x.join(', ')+'</div>').join('');});}
function bindDecide(){const i=$('#decisionInput'),o=$('#decisionResult');$('#makeDecision')?.addEventListener('click',()=>{const a=i.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);o.textContent=a.length?a[Math.floor(Math.random()*a.length)]:t('Enter at least one item');});}

function bindImageSize(){
  const input=$('#imageSizeInput'), zone=$('#imageSizeDropzone'), choose=$('#imageChooseBtn'), scan=$('#imageScan'), result=$('#imageSizeResult'), preview=$('#imageSizePreview'), name=$('#imageSizeName'), dims=$('#imageDimensions'), ratio=$('#imageRatio'), mega=$('#imageMegapixels'), fileSize=$('#imageFileSize'), format=$('#imageFormat'), orient=$('#imageOrientation'), dpi=$('#imageDpi'), dpiInput=$('#imageDpiInput'), p300=$('#print300'), p150=$('#print150'), p72=$('#print72'), pc=$('#printCustom'), copy=$('#copyImageSummary'), reset=$('#imageReset');
  let currentFile=null, currentMeta={};
  const fmtBytes=n=>n<1024? n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';
  const gcd=(a,b)=>{a=Math.round(a);b=Math.round(b);while(b){const t=a%b;a=b;b=t;}return a||1;};
  const ratioText=(w,h)=>{const g=gcd(w,h);return Math.round(w/g)+':'+Math.round(h/g);};
  const printText=(w,h,d)=> d>0 ? ((w/d*2.54).toFixed(2)+' × '+(h/d*2.54).toFixed(2)+' cm') : '—';
  const readDpi=async file=>{
    try{
      const buf=await file.arrayBuffer(), b=new Uint8Array(buf);
      if(file.type==='image/png' && b.length>40){
        const view=new DataView(buf);
        for(let i=8;i+12<b.length;){
          const len=view.getUint32(i); const type=String.fromCharCode(b[i+4],b[i+5],b[i+6],b[i+7]);
          if(type==='pHYs' && len>=9){const x=view.getUint32(i+8), y=view.getUint32(i+12), unit=b[i+16]; if(unit===1) return Math.round((x/39.3701+y/39.3701)/2);}
          i+=12+len;
        }
      }
      if(file.type==='image/jpeg' && b.length>20){
        let i=2;
        while(i+4<b.length && b[i]===0xFF){
          const marker=b[i+1]; if(marker===0xDA||marker===0xD9) break;
          const len=(b[i+2]<<8)|b[i+3];
          if(marker===0xE0 && len>=14 && String.fromCharCode(b[i+4],b[i+5],b[i+6],b[i+7],b[i+8])==='JFIF'){
            const units=b[i+11], x=(b[i+12]<<8)|b[i+13], y=(b[i+14]<<8)|b[i+15];
            if(units===1) return Math.round((x+y)/2); if(units===2) return Math.round(((x+y)/2)*2.54);
          }
          i+=2+len;
        }
      }
    }catch(e){}
    return null;
  };
  const updatePrint=()=>{if(!currentMeta.w)return; const d=Math.max(1,Number(dpiInput.value)||300); p300.textContent=printText(currentMeta.w,currentMeta.h,300); p150.textContent=printText(currentMeta.w,currentMeta.h,150); p72.textContent=printText(currentMeta.w,currentMeta.h,72); pc.textContent=printText(currentMeta.w,currentMeta.h,d);};
  const analyze=async file=>{
    if(!file || !file.type.startsWith('image/')) return;
    currentFile=file; scan.hidden=false; result.hidden=true; zone.classList.add('is-scanning');
    await new Promise(r=>setTimeout(r,650));
    const url=URL.createObjectURL(file);
    preview.onload=async ()=>{
      const w=preview.naturalWidth,h=preview.naturalHeight, d=await readDpi(file);
      currentMeta={w,h,dpi:d};
      name.textContent=file.name; dims.textContent=w+' × '+h; ratio.textContent=ratioText(w,h); mega.textContent=(w*h/1000000).toFixed(2)+' MP'; fileSize.textContent=fmtBytes(file.size); format.textContent=(file.type.split('/')[1]||file.name.split('.').pop()||'—').toUpperCase(); orient.textContent=w>h?t('Landscape'):w<h?t('Portrait'):t('Square'); dpi.textContent=d?d+' DPI':t('Not saved');
      updatePrint(); scan.hidden=true; result.hidden=false; zone.classList.remove('is-scanning'); result.classList.add('image-result-show'); setTimeout(()=>result.classList.remove('image-result-show'),600); URL.revokeObjectURL(url);
    };
    preview.src=url;
  };
  choose?.addEventListener('click',e=>{e.stopPropagation();input?.click();});
  zone?.addEventListener('click',e=>{if(e.target!==choose) input?.click();});
  input?.addEventListener('change',e=>analyze(e.target.files?.[0]));
  ['dragenter','dragover'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('is-dragover');}));
  ['dragleave','drop'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('is-dragover');}));
  zone?.addEventListener('drop',e=>analyze(e.dataTransfer.files?.[0]));
  zone?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input?.click();}});
  dpiInput?.addEventListener('input',updatePrint);
  copy?.addEventListener('click',async()=>{if(!currentFile)return;const text=currentFile.name+' | '+currentMeta.w+' × '+currentMeta.h+' px | '+ratio.textContent+' | '+mega.textContent+' | '+fileSize.textContent+' | '+format.textContent+' | '+(currentMeta.dpi?currentMeta.dpi+' DPI':t('DPI not saved'));try{await navigator.clipboard.writeText(text);copy.textContent=t('Copied!');setTimeout(()=>copy.textContent=t('Copy summary'),1400);}catch(e){}});
  reset?.addEventListener('click',()=>{currentFile=null;input.value='';result.hidden=true;scan.hidden=true;zone.classList.remove('is-scanning');});
}

function bindSizeItUp(){
  const roundEl=$('#sizeRound'), scoreEl=$('#sizeScore'), refName=$('#sizeReferenceName'), refLen=$('#sizeReferenceLength'), targetName=$('#sizeTargetName'), refObj=$('#sizeReferenceObject'), targetObj=$('#sizeTargetObject'), handle=$('#sizeHandle'), stage=$('#sizeStage'), slider=$('#sizeSlider'), estimate=$('#sizeEstimate'), errorEl=$('#sizeError'), lock=$('#sizeLock'), result=$('#sizeResult'), resultIcon=$('#sizeResultIcon'), resultTitle=$('#sizeResultTitle'), resultText=$('#sizeResultText'), next=$('#sizeNext'), restart=$('#sizeRestart'), zoomIn=$('#sizeZoomIn'), zoomOut=$('#sizeZoomOut'), scaleLabel=$('#sizeScaleLabel');
  const objects={
    door:{name:'Kapı',len:2.00,svg:'<svg viewBox="0 0 200 420"><rect x="15" y="10" width="170" height="400" rx="5"/><rect x="35" y="35" width="105" height="145" rx="2" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="157" cy="220" r="7" fill="currentColor"/><path d="M35 200h105v180H35z" fill="none" stroke="currentColor" stroke-width="7"/></svg>'},
    table:{name:'Masa',len:1.60,svg:'<svg viewBox="0 0 320 180"><rect x="18" y="35" width="284" height="48" rx="12"/><path d="M42 83l18 82h28L82 83M238 83l-6 82h28l18-82" fill="currentColor"/></svg>'},
    car:{name:'Otomobil',len:4.50,svg:'<svg viewBox="0 0 420 150"><path d="M35 103l35-51c9-13 23-21 39-23l124-14c23-3 45 5 61 22l49 52h35v37H35z"/><circle cx="105" cy="139" r="27" fill="#0b1020"/><circle cx="105" cy="139" r="12"/><circle cx="315" cy="139" r="27" fill="#0b1020"/><circle cx="315" cy="139" r="12"/><path d="M108 49h119l40 43H77z" fill="#0b1020" opacity=".25"/></svg>'},
    bus:{name:'Otobüs',len:12.00,svg:'<svg viewBox="0 0 560 180"><rect x="18" y="18" width="524" height="145" rx="28"/><rect x="42" y="42" width="476" height="62" rx="10" fill="#0b1020" opacity=".22"/><path d="M75 118h54v25H75zM190 118h54v25h-54zM305 118h54v25h-54zM420 118h54v25h-54z" fill="#0b1020"/></svg>'},
    person:{name:'İnsan',len:1.75,svg:'<svg viewBox="0 0 120 320"><circle cx="60" cy="38" r="30"/><path d="M32 82h56l16 108-26 6-7-67-4 67 38 99H72l-12-70-12 70H12l38-99-4-67-7 67-26-6z"/></svg>'},
    hoop:{name:'Basketbol Potası',len:3.05,svg:'<svg viewBox="0 0 260 360"><rect x="35" y="20" width="190" height="115" rx="6"/><rect x="92" y="116" width="76" height="10" fill="currentColor"/><circle cx="130" cy="156" r="33" fill="none" stroke="currentColor" stroke-width="9"/><path d="M35 135v205h18V135M207 135v205h18V135M35 330h190" fill="none" stroke="currentColor" stroke-width="12"/></svg>'},
    fridge:{name:'Buzdolabı',len:1.80,svg:'<svg viewBox="0 0 180 330"><rect x="12" y="8" width="156" height="314" rx="15"/><path d="M12 158h156" stroke="currentColor" stroke-width="8"/><rect x="35" y="55" width="8" height="65" rx="4" fill="#0b1020"/><rect x="35" y="190" width="8" height="75" rx="4" fill="#0b1020"/></svg>'},
    sofa:{name:'Kanepe',len:2.10,svg:'<svg viewBox="0 0 360 180"><path d="M35 75c0-30 24-55 55-55h180c31 0 55 25 55 55v25h-28v45H63v-45H35z"/><rect x="55" y="100" width="250" height="50" rx="12"/><path d="M28 100v58h32v-58M300 100v58h32v-58"/></svg>'},
    bicycle:{name:'Bisiklet',len:1.80,svg:'<svg viewBox="0 0 360 180"><circle cx="70" cy="130" r="42" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="290" cy="130" r="42" fill="none" stroke="currentColor" stroke-width="8"/><path d="M70 130l70-60 45 60H70l60-90 35 90M140 70h48l35-35M180 130l50-50M230 80l28 50M240 55l30-18" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'},
    container:{name:'Konteyner',len:6.06,svg:'<svg viewBox="0 0 480 180"><rect x="12" y="12" width="456" height="156" rx="5"/><path d="M48 18v144M84 18v144M120 18v144M156 18v144M192 18v144M228 18v144M264 18v144M300 18v144M336 18v144M372 18v144M408 18v144M444 18v144" fill="none" stroke="currentColor" stroke-width="5"/></svg>'},
    shark:{name:'Köpekbalığı',len:4.50,svg:'<svg viewBox="0 0 520 180"><path d="M25 95c45-38 100-55 166-49 52 5 96 20 140 31l55-48 17 66 88 16-88 17-17 65-55-48c-45 11-88 27-140 32-66 6-121-11-166-49z"/><path d="M170 75l35-55 28 65M170 115l35 55 28-65" fill="currentColor"/><circle cx="423" cy="101" r="6" fill="#0b1020"/></svg>'},
    laptop:{name:'Dizüstü Bilgisayar',len:0.35,svg:'<svg viewBox="0 0 300 190"><rect x="32" y="15" width="236" height="145" rx="9"/><rect x="50" y="32" width="200" height="110" fill="#0b1020" opacity=".25"/><path d="M8 160h284l-20 22H28z"/></svg>'},
    keyboard:{name:'Klavye',len:0.44,svg:'<svg viewBox="0 0 360 120"><rect x="10" y="15" width="340" height="90" rx="12"/><path d="M30 38h18v14H30zm28 0h18v14H58zm28 0h18v14H86zm28 0h18v14h-18zm28 0h18v14h-18zm28 0h18v14h-18zm28 0h18v14h-18zm28 0h18v14h-18zm28 0h18v14h-18zM30 62h25v14H30zm35 0h25v14H65zm35 0h25v14h-25zm35 0h95v14h-95zm105 0h25v14h-25z" fill="currentColor"/></svg>'},
    ruler:{name:'Cetvel',len:0.30,svg:'<svg viewBox="0 0 360 80"><rect x="8" y="8" width="344" height="64" rx="6"/><path d="M25 8v22M48 8v14M71 8v22M94 8v14M117 8v22M140 8v14M163 8v22M186 8v14M209 8v22M232 8v14M255 8v22M278 8v14M301 8v22M324 8v14" stroke="#0b1020" stroke-width="5"/></svg>'},
    guitar:{name:'Gitar',len:1.00,svg:'<svg viewBox="0 0 150 420"><path d="M70 35c20 0 35 15 35 35v80c0 22 26 28 30 62 4 32-17 54-42 54s-46-22-42-54c4-34 30-40 30-62V70c0-20 9-35 29-35z"/><rect x="62" y="10" width="16" height="90" rx="5"/><circle cx="76" cy="182" r="14" fill="#0b1020"/><path d="M76 98v175" stroke="#0b1020" stroke-width="4"/></svg>'}
  };
  const rounds=[
    ['door','table'],['car','bus'],['hoop','person'],['fridge','sofa'],['container','shark'],['laptop','keyboard'],['ruler','guitar']
  ];
  let round=0, score=0, zoom=1, drag=false, startX=0, startRatio=1, current=null;
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const svgFor=o=>o.svg;
  const setup=()=>{
    current=rounds[round%rounds.length];
    const r=objects[current[0]], target=objects[current[1]];
    const basePx=Math.min(360/Math.max(r.len,target.len*.72),120);
    refObj.innerHTML=svgFor(r); targetObj.innerHTML=svgFor(target)+'<button class="size-handle" id="sizeHandle" aria-label="Resize object">↗</button>';
    refObj.style.setProperty('--object-color','#2f8cff'); targetObj.style.setProperty('--object-color','#ff4d55');
    refObj.style.width=(r.len*basePx*zoom)+'px'; targetObj.style.width=(target.len*basePx*zoom)+'px';
    refObj.style.height='auto'; targetObj.style.height='auto';
    targetObj.dataset.trueWidth=(target.len*basePx*zoom);
    targetObj.dataset.ratio='1';
    slider.value='1'; estimate.textContent=target.len.toFixed(2)+' m'; errorEl.textContent=t('Adjust the red object to estimate its real length.');
    roundEl.textContent=(round+1)+' / 5'; scoreEl.textContent=score;
    refName.textContent=r.name; refLen.textContent=t('Real length: ')+r.len.toFixed(2)+' m'; targetName.textContent=target.name;
    result.hidden=true; lock.disabled=false; next.hidden=true; stage.classList.remove('size-locked');
    bindHandle();
  };
  const bindHandle=()=>{
    const h=$('#sizeHandle'); if(!h)return;
    h.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();drag=true;startX=e.clientX;startRatio=Number(targetObj.dataset.ratio)||1;h.setPointerCapture?.(e.pointerId);});
    h.addEventListener('pointermove',e=>{if(!drag)return; const delta=(e.clientX-startX)/260; const ratio=Math.max(.35,Math.min(1.65,startRatio+delta)); targetObj.dataset.ratio=ratio; slider.value=ratio; renderTarget();});
    h.addEventListener('pointerup',()=>{drag=false;});
    h.addEventListener('pointercancel',()=>{drag=false;});
  };
  const renderTarget=()=>{
    const r=objects[current[0]], target=objects[current[1]], basePx=Math.min(360/Math.max(r.len,target.len*.72),120)*zoom, ratio=Number(targetObj.dataset.ratio)||1;
    targetObj.style.width=(target.len*basePx*ratio)+'px';
    estimate.textContent=(target.len*ratio).toFixed(2)+' m';
    const pct=Math.abs(ratio-1)*100;
    errorEl.textContent=(pct<0.05?'±'+pct.toFixed(1):pct.toFixed(1))+'% '+t('from the real size');
  };
  const updateZoom=()=>{const ratio=Number(targetObj.dataset.ratio)||1; stage.style.setProperty('--size-zoom',zoom); setup(); targetObj.dataset.ratio=String(ratio); slider.value=String(ratio); renderTarget();};
  slider.addEventListener('input',()=>{targetObj.dataset.ratio=slider.value;renderTarget();});
  zoomIn.addEventListener('click',()=>{zoom=Math.min(1.35,zoom+.1);updateZoom();});
  zoomOut.addEventListener('click',()=>{zoom=Math.max(.75,zoom-.1);updateZoom();});
  lock.addEventListener('click',()=>{
    const ratio=Number(targetObj.dataset.ratio)||1, err=Math.abs(ratio-1), points=err<=.03?1000:err<=.07?850:err<=.12?700:err<=.2?500:err<=.3?300:100;
    score+=points; scoreEl.textContent=score; lock.disabled=true; stage.classList.add('size-locked');
    result.hidden=false; resultIcon.textContent=err<=.1?'✓':'↗'; resultTitle.textContent=err<=.1?t('Great estimate!'):t('Nice try!'); resultText.textContent=t('Real size')+': '+objects[current[1]].len.toFixed(2)+' m • '+t('Your estimate')+': '+(objects[current[1]].len*ratio).toFixed(2)+' m • '+t('Error')+': '+(err*100).toFixed(1)+'% • '+points+' '+t('points');
    next.hidden=false;
  });
  next.addEventListener('click',()=>{if(round>=4){round=0;score=0;next.textContent=t('Next Round');setup();}else{round++;setup();}});
  restart.addEventListener('click',()=>{round=0;score=0;setup();});
  setup();
}


/* =========================
   HOW MANY? ESTIMATION GAME
   ========================= */
(function initHowManyGame(){
  const $q = s => document.querySelector(s);
  const categoryColors = {
    food:'#f59e0b', nature:'#22c55e', home:'#8b5cf6', vehicles:'#ef4444',
    world:'#0ea5e9', animals:'#14b8a6', sport:'#16a34a', tech:'#6366f1',
    human:'#ec4899', science:'#06b6d4'
  };
  const profiles = [
    ['food','☕','Bir bardağı yaklaşık kaç kahve çekirdeği doldurur?',1800,'adet'],
    ['food','🍚','Bir su bardağı pirinçte yaklaşık kaç pirinç tanesi vardır?',3500,'tane'],
    ['food','🍬','Bir avuç dolusu küçük şeker yaklaşık kaç gram gelir?',45,'gram'],
    ['food','🍿','Bir orta boy sinema kovasında yaklaşık kaç patlamış mısır tanesi vardır?',900,'tane'],
    ['food','🍝','Bir tabak pişmiş makarnada yaklaşık kaç makarna parçası bulunur?',120,'parça'],
    ['food','🍓','Bir kilogram çilekte yaklaşık kaç çilek vardır?',35,'adet'],
    ['food','🥜','Bir avuç yer fıstığında yaklaşık kaç fıstık içi vardır?',45,'adet'],
    ['food','🍇','Bir kilogram üzümde yaklaşık kaç üzüm tanesi vardır?',300,'tane'],
    ['food','🍒','Bir kâse kirazda yaklaşık kaç kiraz bulunur?',35,'adet'],
    ['food','🥚','Bir düzine yumurtanın toplam ağırlığı yaklaşık kaç gramdır?',720,'gram'],
    ['food','🍞','Bir somun ekmekte yaklaşık kaç dilim çıkar?',20,'dilim'],
    ['food','🧂','Bir çay kaşığı tuz yaklaşık kaç gramdır?',6,'gram'],
    ['food','🍯','Bir yemek kaşığı bal yaklaşık kaç gramdır?',21,'gram'],
    ['food','🍫','100 gramlık bir çikolata tablette yaklaşık kaç kare vardır?',24,'kare'],
    ['food','🍋','Bir kilogram limonda yaklaşık kaç limon vardır?',7,'adet'],
    ['food','🍊','Bir kilogram mandalinada yaklaşık kaç mandalina vardır?',9,'adet'],
    ['food','🥔','Bir kilogram patateste yaklaşık kaç orta boy patates vardır?',6,'adet'],
    ['food','🍌','Bir kilogram muzda yaklaşık kaç muz vardır?',6,'adet'],
    ['food','🥕','Bir kilogram havuçta yaklaşık kaç havuç vardır?',10,'adet'],
    ['food','🍪','Bir paket 200 gramlık bisküvide yaklaşık kaç bisküvi vardır?',24,'adet'],

    ['nature','🌳','Ortalama bir ağacın gövdesinde yaklaşık kaç litre su bulunabilir?',400,'litre'],
    ['nature','🌿','Bir avuç çimde yaklaşık kaç yaprak bulunabilir?',300,'yaprak'],
    ['nature','🍂','Orta büyüklükte bir ağaç bir sonbaharda yaklaşık kaç yaprak dökebilir?',20000,'yaprak'],
    ['nature','🌻','Bir ayçiçeğinde yaklaşık kaç çekirdek bulunur?',1200,'çekirdek'],
    ['nature','🌲','10 metre yüksekliğinde bir çam ağacının yaklaşık kaç iğne yaprağı olabilir?',50000,'iğne'],
    ['nature','🌱','Bir avuç toprağın içinde yaklaşık kaç bakteri bulunabilir?',100000000,'bakteri'],
    ['nature','🐝','Bir arının bir günde yaklaşık kaç çiçeği ziyaret ettiği tahmin edilir?',1500,'çiçek'],
    ['nature','🌧️','Bir milimetre yağış bir metrekareye yaklaşık kaç litre su bırakır?',1,'litre'],
    ['nature','🌊','Bir küvetteki suyun yaklaşık kaç litre olduğunu tahmin et.',150,'litre'],
    ['nature','🪨','Bir avuç küçük çakıl taşında yaklaşık kaç taş vardır?',30,'taş'],
    ['nature','🌰','Bir kilogram meşe palamudunda yaklaşık kaç palamut bulunur?',60,'adet'],
    ['nature','🍃','Bir orta boy yaprakta yaklaşık kaç damar bulunabilir?',50,'damar'],
    ['nature','🌵','Küçük bir kaktüsün bir yılda yaklaşık kaç santimetre büyümesi beklenir?',8,'cm'],
    ['nature','🌾','Bir avuç buğday tanesinde yaklaşık kaç tane bulunur?',700,'tane'],
    ['nature','🌷','Bir bukette 10 lale varsa toplam yaklaşık kaç taç yaprak vardır?',60,'taç yaprak'],
    ['nature','🌳','Bir metrekare orman zemininde yaklaşık kaç yaprak parçası bulunabilir?',1000,'parça'],
    ['nature','☀️','Güneş ışığının Dünya’ya ulaşması yaklaşık kaç dakika sürer?',8.3,'dakika'],
    ['nature','🌙','Ay’ın Dünya etrafında bir turu yaklaşık kaç gün sürer?',27.3,'gün'],
    ['nature','🌍','Dünya’nın çevresi yaklaşık kaç kilometredir?',40075,'km'],
    ['nature','🌡️','Normal bir insanın yaşadığı bir odanın sıcaklığı yaklaşık kaç °C olur?',22,'°C'],

    ['home','🪑','Standart bir yemek sandalyesinin yüksekliği yaklaşık kaç cm olur?',90,'cm'],
    ['home','🚪','Standart bir iç kapının genişliği yaklaşık kaç cm olur?',80,'cm'],
    ['home','🛏️','Tek kişilik bir yatağın genişliği yaklaşık kaç cm olur?',90,'cm'],
    ['home','🛋️','Üç kişilik bir koltuğun uzunluğu yaklaşık kaç cm olur?',210,'cm'],
    ['home','📚','Bir raf dolusu 2 cm kalınlığında kitapta yaklaşık kaç kitap olur?',40,'kitap'],
    ['home','🪥','Bir diş fırçası yaklaşık kaç cm uzunluğundadır?',18,'cm'],
    ['home','🥄','Bir yemek kaşığının hacmi yaklaşık kaç ml’dir?',15,'ml'],
    ['home','🥤','Orta boy bir su bardağı yaklaşık kaç ml su alır?',250,'ml'],
    ['home','🧴','Bir şampuan şişesi yaklaşık kaç ml olur?',400,'ml'],
    ['home','🧻','Bir tuvalet kâğıdı rulosunda yaklaşık kaç metre kâğıt vardır?',30,'metre'],
    ['home','💡','Ev tipi bir LED ampul yaklaşık kaç watt elektrik tüketir?',10,'watt'],
    ['home','🧊','Ev tipi bir buz kalıbındaki tek küp yaklaşık kaç gramdır?',20,'gram'],
    ['home','🪣','Orta boy bir kova yaklaşık kaç litre su alır?',10,'litre'],
    ['home','🧹','Standart bir süpürgenin sapı yaklaşık kaç cm uzunluğundadır?',120,'cm'],
    ['home','🖼️','Orta boy bir tablo yaklaşık kaç cm genişliğindedir?',60,'cm'],
    ['home','🕯️','Küçük bir mum yaklaşık kaç saat yanabilir?',8,'saat'],
    ['home','🔑','Bir ev anahtarının uzunluğu yaklaşık kaç cm’dir?',6,'cm'],
    ['home','🧺','Orta boy bir çamaşır sepeti yaklaşık kaç litre hacmindedir?',45,'litre'],
    ['home','🧯','Ev tipi yangın tüpü yaklaşık kaç kg gelir?',4,'kg'],
    ['home','🪟','Standart bir pencerenin genişliği yaklaşık kaç cm olabilir?',120,'cm'],

    ['vehicles','🚗','Ortalama bir otomobilin uzunluğu yaklaşık kaç metredir?',4.5,'metre'],
    ['vehicles','🛞','Bir otomobil lastiğinin çevresi yaklaşık kaç cm’dir?',200,'cm'],
    ['vehicles','⛽','Bir otomobil yakıt deposu yaklaşık kaç litre yakıt alır?',50,'litre'],
    ['vehicles','🚲','Şehir bisikletinin tekerlek çapı yaklaşık kaç cm’dir?',70,'cm'],
    ['vehicles','🚌','Standart şehir otobüsü yaklaşık kaç metre uzunluğundadır?',12,'metre'],
    ['vehicles','🚛','Büyük bir kamyonun uzunluğu yaklaşık kaç metredir?',12,'metre'],
    ['vehicles','🏍️','Bir motosikletin ağırlığı yaklaşık kaç kg’dır?',180,'kg'],
    ['vehicles','🚕','Bir taksinin şehir içinde ortalama günlük yaptığı yol yaklaşık kaç km olabilir?',200,'km'],
    ['vehicles','🚆','Bir yolcu treninin bir vagonunda yaklaşık kaç koltuk bulunur?',60,'koltuk'],
    ['vehicles','✈️','Bir yolcu uçağının kanat açıklığı yaklaşık kaç metredir?',35,'metre'],
    ['vehicles','🚢','Orta büyüklükte bir yolcu gemisinin uzunluğu yaklaşık kaç metredir?',200,'metre'],
    ['vehicles','🛴','Elektrikli scooterın ortalama ağırlığı yaklaşık kaç kg’dır?',15,'kg'],
    ['vehicles','🚙','Bir SUV aracın yerden yüksekliği yaklaşık kaç cm’dir?',20,'cm'],
    ['vehicles','🚗','Bir otomobilde yaklaşık kaç adet elektronik kontrol ünitesi bulunabilir?',70,'adet'],
    ['vehicles','🚦','Bir trafik ışığının direği yaklaşık kaç metre yüksek olabilir?',3,'metre'],
    ['vehicles','🛣️','Bir otomobil 100 km/s hızla 1 dakikada yaklaşık kaç km gider?',1.67,'km'],
    ['vehicles','⛽','Bir otomobil 100 km’de ortalama kaç litre yakıt tüketebilir?',7,'litre'],
    ['vehicles','🚲','Bir bisiklet pedalının bir tam turu yaklaşık kaç derece döner?',360,'derece'],
    ['vehicles','🛞','Bir otomobilde genellikle kaç tekerlek bulunur?',4,'adet'],
    ['vehicles','🚁','Küçük bir helikopterin yaklaşık ağırlığı kaç kg olabilir?',1000,'kg'],

    ['world','🌍','Dünya’da yaklaşık kaç ülke vardır?',195,'ülke'],
    ['world','🏙️','Dünyanın en büyük şehirlerinde yaklaşık kaç milyon insan yaşayabilir?',20,'milyon kişi'],
    ['world','🗺️','Dünya haritasındaki kıtaların sayısı kaçtır?',7,'kıta'],
    ['world','🌊','Okyanusların sayısı yaklaşık kaçtır?',5,'okyanus'],
    ['world','🏔️','Everest’in yüksekliği yaklaşık kaç metredir?',8849,'metre'],
    ['world','🏜️','Sahra Çölü yaklaşık kaç milyon km² alana yayılır?',9.2,'milyon km²'],
    ['world','🇹🇷','Türkiye’nin yüzölçümü yaklaşık kaç bin km²’dir?',784,'bin km²'],
    ['world','🗼','Eyfel Kulesi yaklaşık kaç metre yüksekliğindedir?',330,'metre'],
    ['world','🗽','Özgürlük Heykeli kaidesiyle birlikte yaklaşık kaç metre yüksekliğindedir?',93,'metre'],
    ['world','🌉','Golden Gate Köprüsü’nün ana açıklığı yaklaşık kaç metredir?',1280,'metre'],
    ['world','🏝️','Dünya’nın en büyük adası Grönland yaklaşık kaç milyon km²’dir?',2.16,'milyon km²'],
    ['world','🚶','Bir insanın Dünya çevresini ekvator boyunca yürüyerek dolaşması yaklaşık kaç km sürer?',40075,'km'],
    ['world','⏰','Dünya’da kaç saat dilimi vardır?',24,'saat dilimi'],
    ['world','📅','Bir artık yılda kaç gün vardır?',366,'gün'],
    ['world','🌐','İnternette yaklaşık kaç milyar insanın kullanıcı olduğu tahmin edilir?',5500,'milyon kişi'],
    ['world','✈️','Türkiye’den Avrupa’ya kısa bir uçuş yaklaşık kaç saat sürebilir?',3,'saat'],
    ['world','🏛️','Roma’daki Kolezyum’un yaşı yaklaşık kaç yıldır?',1950,'yıl'],
    ['world','🌋','Everest’in deniz seviyesinden yüksekliği yaklaşık kaç km’dir?',8.85,'km'],
    ['world','🧭','Dünya’nın kendi ekseni etrafındaki dönüşü yaklaşık kaç saattir?',24,'saat'],
    ['world','🌎','Dünya’nın Güneş etrafındaki bir turu yaklaşık kaç gündür?',365.25,'gün'],

    ['animals','🐘','Yetişkin bir filin ağırlığı yaklaşık kaç kg olabilir?',5000,'kg'],
    ['animals','🐋','Mavi balinanın uzunluğu yaklaşık kaç metredir?',25,'metre'],
    ['animals','🐜','Bir karıncanın ağırlığı yaklaşık kaç miligramdır?',5,'mg'],
    ['animals','🐈','Evcil bir kedinin ağırlığı yaklaşık kaç kg’dır?',4,'kg'],
    ['animals','🐕','Orta boy bir köpeğin ağırlığı yaklaşık kaç kg’dır?',20,'kg'],
    ['animals','🦒','Zürafanın boyu yaklaşık kaç metredir?',5,'metre'],
    ['animals','🐢','Dev bir kara kaplumbağası yaklaşık kaç kg olabilir?',150,'kg'],
    ['animals','🐇','Bir tavşan saatte yaklaşık kaç km hızla koşabilir?',40,'km/s'],
    ['animals','🐔','Bir tavuk yılda yaklaşık kaç yumurta verebilir?',250,'yumurta'],
    ['animals','🐄','Bir süt ineği günde yaklaşık kaç litre süt verebilir?',25,'litre'],
    ['animals','🐎','Bir atın kalbi dakikada yaklaşık kaç kez atabilir?',40,'atım'],
    ['animals','🦁','Bir aslanın kükremesi yaklaşık kaç km uzaktan duyulabilir?',8,'km'],
    ['animals','🐝','Bir bal arısının ömrü yaklaşık kaç gün olabilir?',40,'gün'],
    ['animals','🦋','Bir kelebeğin kanat açıklığı yaklaşık kaç cm olabilir?',8,'cm'],
    ['animals','🐧','Bir imparator pengueninin boyu yaklaşık kaç cm’dir?',115,'cm'],
    ['animals','🦘','Bir kanguru tek sıçrayışta yaklaşık kaç metre ilerleyebilir?',9,'metre'],
    ['animals','🐊','Bir timsahın ısırma kuvveti yaklaşık kaç newton olabilir?',16000,'N'],
    ['animals','🐙','Bir ahtapotun yaklaşık kaç kolu vardır?',8,'kol'],
    ['animals','🦉','Bir baykuş başını yaklaşık kaç derece çevirebilir?',270,'derece'],
    ['animals','🐬','Bir yunus yaklaşık kaç metre derine dalabilir?',300,'metre'],

    ['sport','⚽','Bir futbol sahasının uzunluğu yaklaşık kaç metredir?',105,'metre'],
    ['sport','🏀','Basketbol potasının yerden yüksekliği kaç metredir?',3.05,'metre'],
    ['sport','🎾','Bir tenis kortunun uzunluğu yaklaşık kaç metredir?',23.77,'metre'],
    ['sport','🏐','Voleybol filesinin erkeklerde yüksekliği kaç metredir?',2.43,'metre'],
    ['sport','🏊','Olimpik yüzme havuzunun uzunluğu kaç metredir?',50,'metre'],
    ['sport','🏃','Bir maratonun uzunluğu kaç kilometredir?',42.195,'km'],
    ['sport','🚴','Bir bisiklet yarışında 1 saatte yaklaşık kaç km yol alınabilir?',35,'km'],
    ['sport','⚾','Beyzbol topunun çevresi yaklaşık kaç cm’dir?',23,'cm'],
    ['sport','🏓','Masa tenisinde masanın uzunluğu yaklaşık kaç cm’dir?',274,'cm'],
    ['sport','🥊','Bir boks raundu profesyonel maçlarda kaç dakika sürer?',3,'dakika'],
    ['sport','⛳','Golf sahasında standart bir turda kaç çukur vardır?',18,'çukur'],
    ['sport','🏋️','Olimpik halter barının ağırlığı kaç kg’dır?',20,'kg'],
    ['sport','⚽','Bir futbol maçının normal süresi kaç dakikadır?',90,'dakika'],
    ['sport','🏀','NBA üçlük çizgisinin en uzak noktası yaklaşık kaç metredir?',7.24,'metre'],
    ['sport','🏹','Olimpik okçulukta hedefe atış mesafesi kaç metredir?',70,'metre'],
    ['sport','🥋','Judo müsabakasında yetişkinler için normal süre yaklaşık kaç dakikadır?',4,'dakika'],
    ['sport','🏎️','Formula 1 yarışında bir turun uzunluğu yaklaşık kaç km olabilir?',5,'km'],
    ['sport','🏆','Bir futbol takımının sahada aynı anda kaç oyuncusu bulunur?',11,'oyuncu'],
    ['sport','🏊','Olimpik havuzda bir kulvarın genişliği yaklaşık kaç metredir?',2.5,'metre'],
    ['sport','🎯','Standart dart tahtasının merkezden dış halkaya çapı yaklaşık kaç cm’dir?',45,'cm'],

    ['tech','💻','Ortalama bir dizüstü bilgisayar ekranı kaç inç olabilir?',15.6,'inç'],
    ['tech','📱','Modern bir akıllı telefonun ağırlığı yaklaşık kaç gramdır?',200,'gram'],
    ['tech','⌨️','Standart bir bilgisayar klavyesinde yaklaşık kaç tuş bulunur?',105,'tuş'],
    ['tech','🖱️','Bir bilgisayar faresinin ağırlığı yaklaşık kaç gramdır?',100,'gram'],
    ['tech','💾','1 GB yaklaşık kaç MB olarak kabul edilir?',1024,'MB'],
    ['tech','📷','12 megapiksellik bir fotoğrafta yaklaşık kaç milyon piksel vardır?',12,'milyon piksel'],
    ['tech','🔋','Bir telefon bataryası yaklaşık kaç mAh kapasiteye sahip olabilir?',5000,'mAh'],
    ['tech','💡','Bir LED ekran pikselinde kaç temel renk kanalı bulunur?',3,'kanal'],
    ['tech','🖨️','Ev tipi bir yazıcı dakikada yaklaşık kaç sayfa basabilir?',15,'sayfa'],
    ['tech','🎧','Kablosuz kulaklığın ağırlığı tek kulakta yaklaşık kaç gramdır?',5,'gram'],
    ['tech','📺','55 inç bir televizyonun köşegen uzunluğu yaklaşık kaç cm’dir?',140,'cm'],
    ['tech','⌚','Akıllı saat ekranı yaklaşık kaç cm çapındadır?',4,'cm'],
    ['tech','🔌','USB-A bağlantısının genişliği yaklaşık kaç mm’dir?',12,'mm'],
    ['tech','🧮','Basit bir hesap makinesinde yaklaşık kaç tuş bulunur?',30,'tuş'],
    ['tech','💿','Bir CD’nin kapasitesi yaklaşık kaç MB’dir?',700,'MB'],
    ['tech','📀','Bir DVD’nin tek katman kapasitesi yaklaşık kaç GB’dir?',4.7,'GB'],
    ['tech','📡','Wi-Fi yönlendiricinin ev içinde kullanılabilir menzili yaklaşık kaç metredir?',30,'metre'],
    ['tech','🛰️','GPS konumlandırması için en az kaç uyduya ihtiyaç duyulur?',4,'uydu'],
    ['tech','📱','Bir akıllı telefon ekranında saniyede 60 Hz yenileme varsa bir saniyede kaç kare yenilenir?',60,'kare'],
    ['tech','🧠','1 byte kaç bit içerir?',8,'bit'],

    ['human','👣','Bir insan günde ortalama kaç adım atabilir?',7000,'adım'],
    ['human','❤️','Yetişkin bir insanın kalbi dakikada yaklaşık kaç kez atar?',70,'atım'],
    ['human','🫁','İnsan akciğerlerinin toplam kapasitesi yaklaşık kaç litredir?',6,'litre'],
    ['human','🦷','Yetişkin bir insanın normalde kaç dişi vardır?',32,'diş'],
    ['human','💧','Bir insanın vücudunda yaklaşık kaç litre su bulunur?',40,'litre'],
    ['human','🩸','Yetişkin bir insanın vücudunda yaklaşık kaç litre kan vardır?',5,'litre'],
    ['human','👀','İnsan gözünün yaklaşık kaç megapiksel eşdeğerinde algı sunduğu tahmin edilir?',576,'MP'],
    ['human','🧠','İnsan beyninin ağırlığı yaklaşık kaç gramdır?',1300,'gram'],
    ['human','💇','İnsan saçı ayda yaklaşık kaç cm uzar?',1,'cm'],
    ['human','🖐️','Bir insanın iki elinde toplam kaç parmak vardır?',10,'parmak'],
    ['human','🦴','Yetişkin insan vücudunda yaklaşık kaç kemik vardır?',206,'kemik'],
    ['human','👂','İnsan kulağı yaklaşık kaç farklı frekans aralığını duyabilir?',20000,'Hz'],
    ['human','🌡️','Normal insan vücut sıcaklığı yaklaşık kaç °C’dir?',37,'°C'],
    ['human','😴','Bir yetişkinin gecede ortalama uyku süresi yaklaşık kaç saattir?',8,'saat'],
    ['human','🚶','İnsan saatte ortalama kaç km yürür?',5,'km'],
    ['human','🏃','Orta tempoda bir insan saatte yaklaşık kaç km koşabilir?',10,'km'],
    ['human','💨','İnsan normalde dakikada yaklaşık kaç nefes alır?',15,'nefes'],
    ['human','👅','İnsan dilinde yaklaşık kaç tat tomurcuğu bulunabilir?',10000,'tomurcuk'],
    ['human','🧴','Bir yetişkinin günde yaklaşık kaç litre su içmesi önerilebilir?',2,'litre'],
    ['human','🧬','İnsan vücudundaki toplam DNA uzunluğu yaklaşık kaç metre olabilir?',20000000000,'metre'],

    ['science','⚛️','Bir saniyede ışık yaklaşık kaç kilometre yol alır?',300000,'km'],
    ['science','🌡️','Suyun kaynama noktası deniz seviyesinde kaç °C’dir?',100,'°C'],
    ['science','🧊','Suyun donma noktası kaç °C’dir?',0,'°C'],
    ['science','🔬','Bir insan saçının kalınlığı yaklaşık kaç mikrometredir?',70,'µm'],
    ['science','🧪','Bir litre suda yaklaşık kaç gram su bulunur?',1000,'gram'],
    ['science','🌌','Işığın Ay’dan Dünya’ya gelmesi yaklaşık kaç saniye sürer?',1.3,'saniye'],
    ['science','☀️','Güneş’in yüzey sıcaklığı yaklaşık kaç °C’dir?',5500,'°C'],
    ['science','🌋','Lavın sıcaklığı yaklaşık kaç °C olabilir?',1100,'°C'],
    ['science','⚡','Şimşek kanalı yaklaşık kaç °C sıcaklığa ulaşabilir?',30000,'°C'],
    ['science','🧲','Dünya’nın yerçekimi ivmesi yaklaşık kaç m/s²’dir?',9.81,'m/s²'],
    ['science','🔭','Ay’ın Dünya’ya ortalama uzaklığı yaklaşık kaç km’dir?',384400,'km'],
    ['science','🪐','Jüpiter’in çapı yaklaşık kaç km’dir?',140000,'km'],
    ['science','🌙','Ay’ın çapı yaklaşık kaç km’dir?',3474,'km'],
    ['science','🌍','Dünya’nın çapı yaklaşık kaç km’dir?',12742,'km'],
    ['science','💨','Ses havada saniyede yaklaşık kaç metre ilerler?',343,'m/s'],
    ['science','🔋','AA alkalin pilin gerilimi yaklaşık kaç volttur?',1.5,'V'],
    ['science','💡','Güneş ışığının boşluktaki hızı yaklaşık kaç km/s’dir?',300000,'km/s'],
    ['science','🧊','Bir litre buzun sıvı suya göre hacmi yaklaşık yüzde kaç daha büyüktür?',9,'%'],
    ['science','🧫','Bir milimetrede kaç mikrometre vardır?',1000,'µm'],
    ['science','🔬','Bir nanometre kaç metrenin milyarda biridir?',1,'milyarda biri']
  ];

  let current = null, score = Number(localStorage.getItem('br_guess_score')||0);
  let streak = Number(localStorage.getItem('br_guess_streak')||0);
  let best = Number(localStorage.getItem('br_guess_best')||0);
  let asked = 0, locked = false, pool = [];

  const card=$q('#guessCard'), cat=$q('#guessCategory'), emoji=$q('#guessEmoji'), question=$q('#guessQuestion');
  const hint=$q('#guessHint'), input=$q('#guessInput'), unit=$q('#guessUnit'), submit=$q('#guessSubmit');
  const feedback=$q('#guessFeedback'), next=$q('#guessNext'), scoreEl=$q('#guessScore'), streakEl=$q('#guessStreak'), bestEl=$q('#guessBest'), bar=$q('#guessProgressBar');

  if(!card || !input) return;

  const shuffle = a => a.slice().sort(()=>Math.random()-.5);
  const normalize = n => Number.isFinite(n) ? n : 0;
  const renderStats=()=>{
    scoreEl.textContent=Math.round(score).toLocaleString('tr-TR');
    streakEl.textContent=streak;
    bestEl.textContent=Math.round(best).toLocaleString('tr-TR');
  };
  const setTheme = key => {
    const color=categoryColors[key]||'#6c63ff';
    card.style.setProperty('--guess-color',color);
    card.style.setProperty('--guess-soft',color+'22');
    card.style.setProperty('--guess-glow',color+'55');
  };
  const newQuestion=()=>{
    if(!pool.length) pool=shuffle(profiles);
    current=pool.pop(); asked++;
    locked=false; input.disabled=false; submit.disabled=false; next.hidden=true;
    cat.textContent=current[1]+'  '+({
      food:'Yiyecek & İçecek',nature:'Doğa',home:'Ev & Günlük Hayat',vehicles:'Araçlar',
      world:'Dünya',animals:'Hayvanlar',sport:'Spor',tech:'Teknoloji',human:'İnsan',science:'Bilim'
    }[current[0]]||'Karışık');
    emoji.textContent=current[1];
    question.textContent=current[2];
    unit.textContent=current[4];
    hint.textContent='Yaklaşık bir tahmin yap. Ne kadar yakınsan o kadar çok puan!';
    feedback.textContent='';
    input.value='';
    input.placeholder='Tahminini yaz';
    setTheme(current[0]);
    bar.style.width=((asked%10||10)*10)+'%';
    setTimeout(()=>input.focus(),40);
  };
  const submitGuess=()=>{
    if(locked) return;
    const value=normalize(Number(input.value));
    if(!Number.isFinite(value) || value<0 || input.value===''){
      feedback.textContent='⚠️ Önce geçerli bir tahmin yaz.';
      feedback.className='guess-feedback error';
      input.focus(); return;
    }
    locked=true; input.disabled=true; submit.disabled=true;
    const target=current[3], error=Math.abs(value-target)/Math.max(Math.abs(target),1);
    const closeness=Math.max(0,1-error);
    let gained=Math.round(1000*Math.pow(closeness,1.35));
    if(gained>900 && error<=0.03) gained+=100;
    gained=Math.min(1100,gained);
    score+=gained;
    if(error<=0.12) streak++; else streak=0;
    best=Math.max(best,score);
    localStorage.setItem('br_guess_score',score);
    localStorage.setItem('br_guess_streak',streak);
    localStorage.setItem('br_guess_best',best);
    renderStats();
    const diff=value-target, abs=Math.abs(diff);
    let verdict=error<=0.03?'🔥 MÜKEMMEL!':error<=0.10?'🎯 Çok yakın!':error<=0.25?'👏 İyi tahmin!':error<=0.5?'🙂 Fena değil!':'😄 Bu biraz uzaktı!';
    feedback.className='guess-feedback success';
    feedback.innerHTML='<strong>'+verdict+'</strong><span>Gerçek hedef: <b>'+target.toLocaleString('tr-TR')+' '+current[4]+'</b></span><span>Tahminin: <b>'+value.toLocaleString('tr-TR')+' '+current[4]+'</b> • Fark: <b>'+abs.toLocaleString('tr-TR')+' '+current[4]+'</b></span><em>+'+gained+' puan</em>';
    next.hidden=false; next.focus();
    card.classList.remove('guess-pop'); void card.offsetWidth; card.classList.add('guess-pop');
  };
  submit.addEventListener('click',submitGuess);
  input.addEventListener('keydown',e=>{if(e.key==='Enter') submitGuess();});
  next.addEventListener('click',newQuestion);
  renderStats(); newQuestion();
})();
