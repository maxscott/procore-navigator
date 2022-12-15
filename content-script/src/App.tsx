/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// import './App.css'

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP,
	KBarResults
} from "kbar";

import links from './links.json';

const actions_new = links.map(link => {
	return {
		...link,
		shortcut: link.shortcut.split(" "),
		perform: () => (window.location.pathname = link.perform)
	}
});

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div>{item}</div>
        ) : (
          <div
            style={{
              background: active ? "#eee" : "transparent",
            }}
          >
            {item.name}
          </div>
        )
      }
    />
  );
}

function App() {
  return (
    <KBarProvider actions={actions_new}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator>
            <KBarSearch />
						<RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
}

export default App


