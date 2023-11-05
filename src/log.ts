import { blue, bold, cyan, gray, green, magenta, red, rgb24, yellow } from 'std/fmt/colors.ts';
import * as colors from 'std/fmt/colors.ts';
import { isObject } from 'https://deno.land/x/fonction@v2.1.0-beta.4/deps.ts';

export { blue, bold, cyan, green, magenta, red, yellow };

type FormatFn = (msg: string) => string;
type FormatOpt = FormatFn | 'blue' | 'bold' | 'cyan' | 'green' | 'magenta' | 'red' | 'yellow';

const inspect = (obj: unknown) => isObject(obj) ? Deno.inspect(obj, { depth: 5, colors: true }) : obj;

const sym = '•';

export const logFn = (name: string, colorFn: FormatFn = cyan) => (...msg: unknown[]) => {
  console.log(cyan(sym), colorFn(name), ...msg.map(inspect));
}

export const debugFn = (name: string, colorFn: FormatFn = gray) => (...msg: unknown[]) => {
  console.log(gray(sym), colorFn(name), ...msg.map(inspect));
}

export const errorFn = (name: string, colorFn: FormatFn = red) => (...msg: unknown[]) => {
  console.error(red(sym), colorFn(name), ...msg.map(inspect));
}

const logFns = (modName: string, fmt?: FormatFn) => ({
  info: logFn(modName, fmt),
  log: logFn(modName, fmt),
  debug: debugFn(modName, fmt),
  error: errorFn(modName, fmt)
})

export const getLogger = (modName: string, fmt?: FormatOpt): ReturnType<typeof logFns> => {
  switch(typeof fmt) {
    case "function":
      return logFns(modName, fmt);
    case "string":
      return logFns(modName, colors[fmt]);
    default:
      return logFns(modName);
  }
}
export default getLogger;

// test rgb
// console.log(rgb24("Hello, World!", { r: 174, g: 129, b: 255 }));


