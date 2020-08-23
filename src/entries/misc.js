const files = [];

function importAll(r) {
  r.keys().forEach((s, i) => {
    files[i] = r(s);
  });
}

importAll(require.context('../assets/', true, /\.css|\.less|\.js$/));
importAll(require.context('../blocks/body/', true, /(\.less)$/));
importAll(require.context('../blocks/content/', true, /(\.less)$/));
importAll(require.context('../blocks/checkbox/', true, /(\.less)$/));
importAll(require.context('../blocks/dropdown/', true, /(\.less)$/));
importAll(require.context('../blocks/slider/', true, /(\.less)$/));
importAll(require.context('../blocks/link/', true, /(\.less)$/));
importAll(require.context('../blocks/title/', true, /(\.less)$/));
importAll(require.context('../blocks/toggle/', true, /(\.less)$/));
importAll(require.context('../blocks/tooltip/', true, /(\.less)$/));
importAll(require.context('../blocks/footer/', true, /(\.less)$/));
