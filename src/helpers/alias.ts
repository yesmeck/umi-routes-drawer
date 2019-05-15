export default function alias(...aliases: string[]) {
  return (target: any, name: string, ) => {
    aliases.map(a => {
      target[a] = target[name];
    });
  };
}
