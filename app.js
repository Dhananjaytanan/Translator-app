const LANGS = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Filipino', code: 'tl' },
  { name: 'Indonesian', code: 'id' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Chinese (Simplified)', code: 'zh' },
  { name: 'French', code: 'fr' },
  { name: 'Korean', code: 'ko' },
  { name: 'German', code: 'de' }
];

const fromEl = document.getElementById('fromLang');
const toEl = document.getElementById('toLang');
const inputEl = document.getElementById('inputText');
const outputEl = document.getElementById('outputText');
const translateBtn = document.getElementById('translateBtn');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const themeToggle = document.getElementById('themeToggle');

function populate(){
  LANGS.forEach(l=>{
    const o1 = document.createElement('option'); o1.value = l.code; o1.textContent = l.name; fromEl.appendChild(o1);
    const o2 = document.createElement('option'); o2.value = l.code; o2.textContent = l.name; toEl.appendChild(o2);
  });
  fromEl.value = 'en';
  toEl.value = 'hi';
}
populate();

swapBtn.addEventListener('click', ()=>{
  const a = fromEl.value; fromEl.value = toEl.value; toEl.value = a;
  const tmp = inputEl.value; inputEl.value = outputEl.value; outputEl.value = tmp;
});

copyBtn.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText(outputEl.value || '');
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy',1200);
  }catch(e){
    alert('Clipboard not available.');
  }
});

themeToggle.addEventListener('click', ()=>{
  const root = document.body;
  const current = root.getAttribute('data-theme') || 'dark';
  root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

async function translateText(text, source, target){
  if(!text.trim()) return '';
  try{
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target })
    });
    if(!res.ok) {
      const err = await res.text();
      throw new Error('Server error: ' + err);
    }
    const data = await res.json();
    return data.translatedText || '';
  }catch(err){
    console.error(err);
    alert('Translation failed.');
    return '';
  }
}

translateBtn.addEventListener('click', async ()=>{
  translateBtn.disabled = true; translateBtn.textContent = 'Translating...';
  const text = inputEl.value;
  const src = fromEl.value; const tgt = toEl.value;
  try{
    const translated = await translateText(text, src, tgt);
    outputEl.value = translated;
  }catch(e){
    console.error(e);
  }finally{
    translateBtn.disabled = false; translateBtn.textContent = 'Translate';
  }
});
