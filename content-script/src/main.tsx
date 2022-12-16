import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css'
import App from './App'

const body = document.querySelector('main')

const app = document.createElement('div')

app.id = 'root'

let companyId = null;

const queryResult = document.querySelector("a[data-header='company-home-button']");
if (queryResult) {

  const href = queryResult.getAttribute("href");
  if (href) {
    companyId = href.split('set_company/')[1];
  }
}

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time
if (body) {
  body.prepend(app)
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App companyId={companyId}/>
  </React.StrictMode>
)
