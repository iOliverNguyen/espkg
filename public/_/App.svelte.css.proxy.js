// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "main.svelte-zytmjl.svelte-zytmjl{text-align:center;padding:1em;max-width:240px;margin:0 auto}h1.svelte-zytmjl.svelte-zytmjl{color:#ff3e00;font-size:2.2em;font-weight:100;margin-top:2em}.pkg.svelte-zytmjl.svelte-zytmjl{font-size:1.2em;margin-top:2em}.note.svelte-zytmjl.svelte-zytmjl{color:#7e7e7e;font-size:0.8em}input.main.svelte-zytmjl.svelte-zytmjl{outline:none;border:none;border-bottom:solid 2px #ff6d3f;width:12em;padding-left:0}button.svelte-zytmjl.svelte-zytmjl{cursor:pointer;border:solid 1px #ff6d3f;border-radius:4px;width:2em;height:2em;color:#e94512}button.svelte-zytmjl.svelte-zytmjl:hover{background:#ff6d3f;border-color:#ff6d3f;color:white}.examples.svelte-zytmjl.svelte-zytmjl{left:50%;margin-left:-10em;text-align:left;position:absolute;bottom:2em;line-height:1.5em;font-size:1em}.examples.svelte-zytmjl a.svelte-zytmjl{color:#2d3748}@media(min-width: 640px){main.svelte-zytmjl.svelte-zytmjl{max-width:none}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}