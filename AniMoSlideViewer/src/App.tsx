import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { play, arrowDroprightCircle } from 'ionicons/icons';
import { RouteDefinition } from './types';
import { PresentatinPage } from './components/pages/Presentation';
import { Menu } from './components/standalones/Menu';
import { ThemeProvider } from 'styled-components';
import { SlideShowPage } from './components/pages/SlideShow';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme.css';

const routes: RouteDefinition[] = [
  {
    url: 'presentations',
    title: 'プレゼンテーション',
    icon: arrowDroprightCircle,
  },
  {
    url: '/slideshow/sample',
    title: 'スライドショーデモ',
    icon: play,
  },
];

const App: React.FC = () => (
  <ThemeProvider theme={{}}>
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Route path='/home'>
            <IonSplitPane when='xs' contentId='main'>
              <Menu routes={routes} />
              <IonRouterOutlet id='main'>
                <Route path='/home/presentations' component={PresentatinPage} exact={true} />
                <Route exact path='/home' render={() => <Redirect to='/home/presentations' />} />
              </IonRouterOutlet>
            </IonSplitPane>
          </Route>
          <Route path='/slideshow/:id' exact>
            <SlideShowPage />
          </Route>
          <Route exact path='/' render={() => <Redirect to='/home' />} />
          <Route path='*'>
            <div>404 not found</div>
          </Route>
        </Switch>
      </IonReactRouter>
    </IonApp>
  </ThemeProvider>
);

export default App;
