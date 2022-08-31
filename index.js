// Generated by MS2Porter
let version = '2.3.0';

let blocking = {
  'compat': '2.1.0',

  'science': true,
  'sentry': true,
  'crash': true
};

let originals = {
  'analytics1': undefined,
  'analytics2': undefined,
  'analytics3': undefined,
  'crash': undefined
};

const setAnalytics = (val) => {
  if (!val) enableAnalytics();
    else disableAnalytics();
};

const enableAnalytics = () => {
  const analyticsMod1 = goosemodScope.webpackModules.findByProps('analyticsTrackingStoreMaker');
  const analyticsMod2 = goosemodScope.webpackModules.findByProps('getSuperPropertiesBase64');

  analyticsMod1.AnalyticsActionHandlers.handleTrack = originals.analytics1;
  analyticsMod2.track = originals.analytics2;
};

const disableAnalytics = () => {
  const analyticsMod1 = goosemodScope.webpackModules.findByProps('analyticsTrackingStoreMaker');
  const analyticsMod2 = goosemodScope.webpackModules.findByProps('getSuperPropertiesBase64');
  const analyticsMod3 = goosemodScope.webpackModules.findByProps('getRegisterStatus');

  originals.analytics1 = analyticsMod1.AnalyticsActionHandlers.handleTrack;
  analyticsMod1.AnalyticsActionHandlers.handleTrack = () => {};

  originals.analytics2 = analyticsMod2.track;
  analyticsMod2.track = () => {};
  
  originals.analytics3 = analyticsMod3.getAnalyticsToken;
  analyticsMod3.getAnalyticsToken = () => {};
};

const setCrash = (val) => {
  if (!val) enableCrash();
    else disableCrash();
};

const enableCrash = () => {
  const crashMod = goosemodScope.webpackModules.findByProps('submitLiveCrashReport');

  crashMod.submitLiveCrashReport = originals.crash;
};

const disableCrash = () => {
  const crashMod = goosemodScope.webpackModules.findByProps('submitLiveCrashReport');

  originals.crash = crashMod.submitLiveCrashReport;
  crashMod.submitLiveCrashReport = () => {};
};

const setSentry = (val) => {
  if (!val) enableSentry();
    else disableSentry();
};

const enableSentry = () => {
  window.__SENTRY__.hub.getClient().getOptions().enabled = true;
};

const disableSentry = () => {
  window.__SENTRY__.hub.getClient().getOptions().enabled = false;
};

export default {
goosemodHandlers: {
  onImport: async function() {
    setAnalytics(blocking.science);
    setSentry(blocking.sentry);
    setCrash(blocking.crash);
  },

  onLoadingFinished: async function() {
    goosemodScope.settings.createItem('Fucklytics', [
      `(v${version})`,

      {
        type: 'header',
        text: 'What to block'
      },

      {
        type: 'toggle',
        text: 'Science (Discord API)',
        subtext: 'Discord\'s own analytics, most used.',
        onToggle: (c) => {
          blocking.science = c;
          setAnalytics(c);
        },
        isToggled: () => blocking.science
      },

      {
        type: 'toggle',
        text: 'Crash Reports',
        subtext: 'Automatically sends Discord a crash report on crash (without your consent).',
        onToggle: (c) => {
          blocking.crash = c;
          setCrash(c);
        },
        isToggled: () => blocking.crash
      },

      {
        type: 'toggle',
        text: 'Sentry',
        subtext: 'Used to track console / JS errors.',
        onToggle: (c) => {
          blocking.sentry = c;
          setSentry(c);
        },
        isToggled: () => blocking.sentry
      }
    ]);
  },

  onRemove: async function() {
    try {
      enableAnalytics();
      enableSentry();
      enableCrash();
    } catch (e) {}

    let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Fucklytics');
    goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(settingItem), 1);
  },

  getSettings: () => [blocking],
  loadSettings: ([_blocking]) => {
    if (_blocking.compat !== version) return;

    blocking = _blocking;

    setAnalytics(blocking.science);
    setSentry(blocking.sentry);
    setCrash(blocking.crash);
  },



}
};
