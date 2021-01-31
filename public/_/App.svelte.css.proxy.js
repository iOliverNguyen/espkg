// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "main.svelte-1saj8cy{text-align:center;padding:1em;max-width:240px;margin:0 auto}h1.svelte-1saj8cy{color:#ff3e00;font-size:4em;font-weight:100}@media(min-width: 640px){main.svelte-1saj8cy{max-width:none}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}