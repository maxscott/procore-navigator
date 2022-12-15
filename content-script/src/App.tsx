/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl
} from "kbar";

import links from './links.json';

import './styles.css';


const actions_new = links.map(link => {
	return {
		...link,
		shortcut: link.shortcut.split(" "),
		perform: () => (window.location.pathname = link.perform)
	}
});

const options = {
  toggleShortcut: "/"
}

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
    <KBarProvider actions={actions_new} options={options}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className="animator">
            <KBarSearch className="search"/>
						<RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
}

export default App;
