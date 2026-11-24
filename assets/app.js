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
    "Result copied":"Result copied","HEX copied":"HEX copied","Add VAT":"Add VAT","Remove VAT":"Remove VAT","Total with VAT":"Total with VAT","Price without VAT":"Price without VAT","Bill amount":"Bill amount","Tip %":"Tip %","People":"People","Total":"Total","You pay":"You pay","Original price":"Original price","Discount %":"Discount %","You save":"You save","Current time":"Current time","Timestamp → Date":"Timestamp → Date","Date → Timestamp":"Date → Timestamp","Unix timestamp":"Unix timestamp","Date and time":"Date and time","SHA-256":"SHA-256","SHA-1":"SHA-1","Algorithm":"Algorithm","Invalid text":"Invalid text","RGB copied":"RGB copied","Meter":"Meter","Kilometer":"Kilometer","Centimeter":"Centimeter","Millimeter":"Millimeter","Mile":"Mile","Yard":"Yard","Foot":"Foot","Inch":"Inch","Kilogram":"Kilogram","Gram":"Gram","Milligram":"Milligram","Pound":"Pound","Ounce":"Ounce","Celsius":"Celsius","Fahrenheit":"Fahrenheit","Kelvin":"Kelvin","Enter a valid amount":"Enter a valid amount","Same currency":"Same currency","Rate supplied by Frankfurter.":"Rate supplied by Frankfurter.","Loading rate…":"Loading rate…","Unable to load rate":"Unable to load rate","Check your connection and try again.":"Check your connection and try again.","Loan Calculator":"Loan Calculator","Compound Interest":"Compound Interest","Number Base Converter":"Number Base Converter","Text Reverser":"Text Reverser","Time Zone Converter":"Time Zone Converter","Monthly payment":"Monthly payment","Total payment":"Total payment","Total interest":"Total interest","Principal":"Principal","Annual rate":"Annual rate","Months":"Months","Interest earned":"Interest earned","Years":"Years","Compounds per year":"Compounds per year","Input number":"Input number","From base":"From base","To base":"To base","Reversed text":"Reversed text","Date and time":"Date and time","Time zone":"Time zone"
  },
  tr: {
"Loan Calculator":"Kredi Hesaplama","Compound Interest":"Bileşik Faiz Hesaplama","Number Base Converter":"Sayı Tabanı Dönüştürücü","Text Reverser":"Metin Ters Çevirici","Time Zone Converter":"Saat Dilimi Dönüştürücü","Monthly payment":"Aylık ödeme","Total payment":"Toplam ödeme","Total interest":"Toplam faiz","Principal":"Ana para","Annual rate":"Yıllık faiz","Months":"Ay","Interest earned":"Kazanç","Years":"Yıl","Compounds per year":"Yıllık bileşik dönem","Input number":"Sayı","From base":"Kaynak taban","To base":"Hedef taban","Reversed text":"Ters metin","Date and time":"Tarih ve saat","Time zone":"Saat dilimi",    "Tools":"Araçlar","About":"Hakkında","Privacy":"Gizlilik","Search tools...":"Araçlarda ara...",
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
  calculator:'calculatorTemplate',unit:'unitTemplate',currency:'currencyTemplate',age:'ageTemplate',json:'jsonTemplate',base64:'base64Template',uuid:'uuidTemplate',lorem:'loremTemplate',
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
  if(name==='timezone') bindTimezone();
}


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
  const ids={memory:'memoryGameTemplate',reaction:'reactionGameTemplate',number:'numberGameTemplate',rps:'rpsGameTemplate',math:'mathGameTemplate',hangman:'hangmanGameTemplate',sudoku:'sudokuGameTemplate',sequence:'sequenceGameTemplate'};
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
  if(name==='sequence') bindSequenceGame();
  translateRoot(modalBody);
  setTimeout(()=>$('.modal-close')?.focus(),0);
}

function bindMemoryGame(){
  const symbols=['🍎','🚀','🎵','⭐','🐼','⚽'];
  let cards=[...symbols,...symbols].sort(()=>Math.random()-0.5),open=[],matched=0,moves=0,locked=false;
  const board=$('#memoryBoard'),movesEl=$('#memoryMoves'),pairsEl=$('#memoryPairs');
  const render=()=>{
    board.innerHTML=cards.map((x,i)=>'<button type="button" class="memory-card" data-i="'+i+'"><span>'+x+'</span></button>').join('');
    $('.memory-card',board).forEach(btn=>btn.addEventListener('click',()=>flip(Number(btn.dataset.i))));
    movesEl.textContent='0';pairsEl.textContent='0/6';
  };
  const reset=()=>{cards=[...symbols,...symbols].sort(()=>Math.random()-0.5);open=[];matched=0;moves=0;locked=false;render();};
  const flip=(i)=>{
    if(locked)return;
    const btn=$('.memory-card',board)[i];
    if(!btn||btn.classList.contains('matched')||btn.classList.contains('flipped'))return;
    btn.classList.add('flipped');open.push(i);
    if(open.length!==2)return;
    moves++;movesEl.textContent=String(moves);
    const [a,b]=open;
    if(cards[a]===cards[b]){
      $('.memory-card',board)[a].classList.add('matched');$('.memory-card',board)[b].classList.add('matched');
      matched++;pairsEl.textContent=matched+'/6';open=[];
      if(matched===6)$('#memoryMessage')?.replaceChildren(document.createTextNode(t('Correct')+' 🎉'));
    }else{
      locked=true;
      setTimeout(()=>{$('.memory-card',board)[a]?.classList.remove('flipped');$('.memory-card',board)[b]?.classList.remove('flipped');open=[];locked=false;},650);
    }
  };
  $('#memoryReset').addEventListener('click',reset);
  render();
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
  };
  $('.rps-actions button').forEach(btn=>btn.addEventListener('click',()=>play(btn.dataset.rps)));
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
  button.addEventListener('click',guess);input.addEventListener('keydown',e=>{if(e.key==='Enter')guess();});render();
}
function bindSudokuGame(){
  const solution=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
  const puzzle=[[1,0,3,0],[0,4,0,2],[2,0,4,0],[0,3,0,1]];
  const grid=$('#sudokuGrid'),message=$('#sudokuMessage');
  grid.innerHTML='';
  puzzle.forEach((row,r)=>row.forEach((v,col)=>{
    const input=document.createElement('input');input.type='number';input.min='1';input.max='4';input.inputMode='numeric';input.dataset.r=r;input.dataset.c=col;
    if(v){input.value=v;input.disabled=true;} grid.appendChild(input);
  }));
  $('#sudokuCheck').addEventListener('click',()=>{
    let complete=true,correct=true;
    $('#sudokuGrid input').forEach(input=>{
      const value=Number(input.value);
      if(!value){complete=false;return;}
      if(value!==solution[Number(input.dataset.r)][Number(input.dataset.c)])correct=false;
    });
    message.textContent=!complete?t('Fill all cells'):correct?t('Correct')+' 🎉':t('Try again');
  });
}
function bindSequenceGame(){
  let sequence=[],user=[],level=0,accepting=false;
  const colors=['1','2','3','4'],display=$('#sequenceDisplay'),buttons=$('#sequenceButtons'),message=$('#sequenceMessage');
  const add=()=>{
    sequence.push(colors[Math.floor(Math.random()*colors.length)]);user=[];accepting=false;
    display.textContent=sequence.join(' • ');
    setTimeout(()=>{display.textContent='?';accepting=true;},Math.max(700,900-sequence.length*20));
  };
  const start=()=>{sequence=[];user=[];level=0;message.textContent='';buttons.innerHTML=colors.map(c=>'<button type="button" class="sequence-btn" data-v="'+c+'">'+c+'</button>').join('');add();};
  $('#sequenceStart').addEventListener('click',start);
  buttons.addEventListener('click',e=>{
    const btn=e.target.closest('.sequence-btn');if(!btn||!accepting)return;
    user.push(btn.dataset.v);const i=user.length-1;
    if(user[i]!==sequence[i]){accepting=false;message.textContent=t('Game over')+' — '+t('Level')+' '+level;return;}
    if(user.length===sequence.length){accepting=false;level++;message.textContent=t('Correct')+'! '+t('Level')+' '+level;setTimeout(add,650);}
  });
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
