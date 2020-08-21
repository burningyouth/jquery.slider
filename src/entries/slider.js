const files = [];

function importAll(r) {
  r.keys().forEach((s, i) => {
    files[i] = r(s);
  });
}

importAll(require.context('../blocks/js-slider/', true, /(\.less)$/));

import '../plugin/slider/slider.ts';
