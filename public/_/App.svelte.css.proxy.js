// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "main.svelte-1fm77nk.svelte-1fm77nk{text-align:center;padding:1em;max-width:240px;margin:0 auto}h1.svelte-1fm77nk.svelte-1fm77nk{color:#ff3e00;font-size:2.2em;font-weight:100;margin-top:2em}.pkg.svelte-1fm77nk.svelte-1fm77nk{font-size:1.2em;margin-top:2em}.note.svelte-1fm77nk.svelte-1fm77nk{color:#7e7e7e;font-size:0.8em;margin-top:1em}input.main.svelte-1fm77nk.svelte-1fm77nk{outline:none;border:none;border-bottom:solid 2px #ff6d3f;width:12em;padding-left:0}button.svelte-1fm77nk.svelte-1fm77nk{cursor:pointer;border:solid 1px #ff6d3f;border-radius:4px;width:2em;height:2em;color:#e94512}button.svelte-1fm77nk.svelte-1fm77nk:hover{background:#ff6d3f;border-color:#ff6d3f;color:white}.examples.svelte-1fm77nk.svelte-1fm77nk{left:50%;margin-left:-12em;text-align:left;position:absolute;bottom:1em;line-height:1.5em;font-size:1em}.examples.svelte-1fm77nk a.svelte-1fm77nk{color:#2d3748}@media(min-width: 640px){main.svelte-1fm77nk.svelte-1fm77nk{max-width:none}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}