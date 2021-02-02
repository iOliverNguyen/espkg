<main>
  <h1>espkg: transpile packages to ES Module</h1>
  <form on:submit|preventDefault={loadPackage}>
    <div class="pkg">https://espkg.vercel.app/ <input class="main" type="text" bind:value={pkgName}
                                                      placeholder={defText}/>
      <button>→</button>
      <br>
    </div>
    <div class="note">(please wait a little bit for transpiling, then the result will be cached by Vercel)</div>
  </form>
  <div class="examples">
    <a target="_blank" href="/uuid">https://espkg.vercel.app/uuid</a><br>
    <a target="_blank" href="/left-pad">https://espkg.vercel.app/left-pad</a><br>
    <a target="_blank" href="/react@16">https://espkg.vercel.app/react@16</a><br>
    <a target="_blank" href="/moment@2.20">https://espkg.vercel.app/moment@2.20</a><br>
    <a target="_blank" href="/minimatch@3.0.4">https://espkg.vercel.app/minimatch@3.0.4</a><br>
    <div class="note">Powered by <a href="https://github.com/snowpackjs/snowpack/tree/main/esinstall" target="_blank">esinstall</a>
      from <a href="https://snowpack.dev" target="_blank">Snowpack</a>. Site created by <a href="https://twitter.com/olvrng" target="_blank">olvrng</a>.</div>
  </div>
</main>

<script lang="ts">
  export let pkgName = '';
  export const defText = 'lodash@4';

  function loadPackage() {
    const url = 'https://espkg.vercel.app/' + (pkgName || defText);
    window.open(url, '_blank');
  }
</script>

<style lang="less">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 2.2em;
    font-weight: 100;
    margin-top: 2em;
  }

  .pkg {
    font-size: 1.2em;
    margin-top: 2em;
  }

  .note {
    color: #7e7e7e;
    font-size: 0.8em;
    margin-top: 1em;
  }

  input.main {
    outline: none;
    border: none;
    border-bottom: solid 2px #ff6d3f;
    width: 12em;
    padding-left: 0;
  }

  button {
    cursor: pointer;
    border: solid 1px #ff6d3f;
    border-radius: 4px;
    width: 2em;
    height: 2em;
    color: #e94512;

    &:hover {
      background: #ff6d3f;
      border-color: #ff6d3f;
      color: white;
    }
  }

  .examples {
    left: 50%;
    margin-left: -12em;
    text-align: left;
    position: absolute;
    bottom: 1em;
    line-height: 1.5em;
    font-size: 1em;

    a {
      color: #2d3748;
    }
  }


  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
