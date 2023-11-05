import { denoPlugins, esbuild, dejs } from "./deps.server.ts";

const decoder = new TextDecoder('utf-8');

const output = await esbuild.build({
  plugins: [ ...denoPlugins() ],
  entryPoints: [ 'src/app/index.tsx' ],
  write: false,
  bundle: true,
  format: 'esm',
  sourcemap: true,
  absWorkingDir: Deno.cwd(),
});

const indexJs = decoder.decode(output.outputFiles[0].contents);

const defaultParams = {
  title: 'Deno WebView Test'
};

const template = (scriptContent: string, params = defaultParams) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
<!--  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">-->
  <link rel="stylesheet" href="https://unpkg.com/bulmaswatch/slate/bulmaswatch.min.css">
  <style>
    html, body {
      background-color: #272b30;
    }
</style>
</head>
<body>
  <section id="app" />
  <script>${scriptContent}</script>
</body>
</html>`


const html = () => {
  return template(indexJs);
}

export default html
