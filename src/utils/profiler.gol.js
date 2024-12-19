import * as dat from "dat.gui";

const genCounter = (setTimeStamps) => {
    //Profile perfomance of GOL engine
    setTimeStamps((timeStamps) =>
    {
        if (timeStamps?.length % 100 === 0)
            console.log(`Time taken for 100 Gens: ${
                timeStamps[timeStamps?.length - 1] -
                timeStamps[timeStamps?.length - 100]
              }ms`);
       return [...timeStamps, Date.now()]
    }
         
);
    
    }

function addSettingsPane(settings, setSettings, excludeKeys = []) {
  const gui = new dat.GUI();
  Object.keys(settings).forEach(key => {
    if (excludeKeys.includes(key)) return; // Skip excluded keys
    const value = settings[key];
    if (typeof value === 'number') {
      gui.add(settings, key, 0, value * 2).onChange(value =>
        setSettings(prev => ({ ...prev, [key]: value }))
      );
    } else {
      gui.add(settings, key).onChange(value =>
        setSettings(prev => ({ ...prev, [key]: value }))
      );
    }
  });
}

const devModeMonitor = () => {
    const url = new URL(window.location.href);
    return url.searchParams.has("dev");
}

  const showControlPanel= (stats) => {
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    return () => document.body.removeChild(stats.dom);
  }

export {
    genCounter,
    addSettingsPane,
    devModeMonitor,
    showControlPanel
}