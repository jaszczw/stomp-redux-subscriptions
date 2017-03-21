const getNewModule = () => {
  const moduleToChange = Math.floor(Math.random() * 5);
  const issues = Math.round(Math.random() * 20);
  const types = ['alarm', 'warning', 'positive', 'ok'];
  const type = types[Math.floor(Math.random() * 4)];

  return {moduleToChange, newModule: { issues, type}};
};

const getMockedModules = () => {
  const newModules = modulesList.slice();
  const {moduleToChange, newModule} = getNewModule();

  newModules[moduleToChange] = Object.assign({}, newModules[moduleToChange], newModule);

  return newModules;
};

const modulesList = [
  {
    name: 'the Showcase',
    path: '/module',
    icon: 'storage',
    issues: 55,
    colors: {icon: 'white', module: '#0066CC'},
    type: 'alarm',
  },
  {
    name: 'Processes ',
    path: 'en/processes',
    icon: 'storage',
    issues: null,
    colors: {icon: 'black', module: 'white'},
    type: '',
  },
  {
    name: 'the Showcase 3',
    path: 'en/create',
    icon: 'storage',
    issues: 2,
    colors: {icon: 'white', module: '#0066CC'},
    type: 'alarm',
  },
  {
    name: 'the Showcase 4',
    path: 'en/module',
    icon: 'storage',
    issues: 131,
    colors: {icon: 'black', module: 'white'},
    type: 'alarm',
  },
  {
    name: 'the Showcase 5',
    path: 'en/module',
    icon: 'storage',
    issues: 1,
    colors: {icon: 'white', module: '#0066CC'},
    type: 'alarm',
  },
];

module.exports = getMockedModules;