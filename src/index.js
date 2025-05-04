/**
 * Extension for Textile synatx highlight with Shiki Js.
 *
 * @param {import("@shikijs/types").HighlighterGeneric<any,any>} highlighter
 * @param {{light:light;dark?:any}} [themes]
 * @returns {import("lwe8-textile-types").TextileExtension}
 */
export function textileShiki(highlighter, themes) {
  const themeOptions =
    themes && themes.dark
      ? { themes: { light: themes.light, dark: themes.dark } }
      : themes && !themes.dark
      ? { theme: themes.light }
      : { theme: "light-plus" };
  const high = (code, lang) => {
    return highlighter.codeToHast(code, {
      lang: lang,
      ...themeOptions,
    });
  };
  return {
    walk(node, index, parent) {
      if (node.tagName === "pre") {
        let lang = "";
        let code = "";
        if (node.properties && node.properties.className) {
          const lan = node.properties.className.find((i) =>
            i.startsWith("language-")
          );
          if (lan) {
            lang = lan.split("-")[1];
          }
        }
        if (node.children) {
          const c = node.children.find((i) => i.tagName === "code");
          if (c && c.children) {
            const v = c.children.find((i) => i.type === "text");
            if (v) {
              code = v.value;
            }
          }
        } //
        if (lang !== "" && code !== "") {
          const newNode = high(code, lang);
          parent.children.splice(index, 1, newNode);
        }
      }
    },
  };
}
