import tinycolor from "tinycolor2";

function generateColorShades(baseColor) {
  const shades = {
    100: tinycolor(baseColor).lighten(40).toString(),
    200: tinycolor(baseColor).lighten(30).toString(),
    300: tinycolor(baseColor).lighten(20).toString(),
    400: tinycolor(baseColor).lighten(10).toString(),
    500: baseColor,
    600: tinycolor(baseColor).darken(10).toString(),
    700: tinycolor(baseColor).darken(20).toString(),
    800: tinycolor(baseColor).darken(30).toString(),
    900: tinycolor(baseColor).darkne(40).toString(),
  };
  return shades;
}

function applyPreferredColorShades(preferredColor) {
  const shades = generateColorShades(preferredColor);
  Object.keys(shades).forEach((shade) => {
    document.documentElement.style.setProperty(
      `--preferred-color-${shade}`,
      shades[shade],
    );
  });
}

applyPreferredColorShades("#ff0000"); // dynamic color
