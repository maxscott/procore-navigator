/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl,
	ActionId,
} from "kbar";

import links from './links.json';

import './styles.css';

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};

type Link = {
  id: string,
  name: string,
  shortcut?: string,
  keywords: string,
  perform: string,
  area: string,
  scope: string
}

function currentLocation(objectType: string, path: string) {
  const objectFirst = new RegExp("([0-9]+)\/" + objectType);
  const objectLast = new RegExp(objectType + "\/([0-9]+)");

  const match1 = path.match(objectFirst);
  const match2 = path.match(objectLast);

  if (match1) return match1[1];
  if (match2) return match2[1];
  return null;
}

function processLinks(companyId: string | null) {
  let contextualLinks: Array<Link> = links;

  if (companyId === null) {
    companyId =
      currentLocation("company", window.location.pathname) ||
      currentLocation("companies", window.location.pathname);
  }

  const projectId = currentLocation("project", window.location.pathname);

  // if there's no company id, include only the paths which do not require company id
  if (!companyId) {
    contextualLinks = links.filter(a => a.perform.indexOf('{cid}') === -1);
  }
  // if there's no project id, include only the paths which do not require project id
  if (!projectId) {
    contextualLinks = links.filter(a => a.perform.indexOf('{pid}') === -1);
  }

  return contextualLinks.map(link => {
    return {
      ...link,
      shortcut: link.shortcut?.split(" "),
      perform: () => {
        let tmpLink = link.perform;

        if (companyId) {
          tmpLink = tmpLink.replaceAll("{cid}", companyId);
        }

        if (projectId) {
          tmpLink = tmpLink.replaceAll("{pid}", projectId);
        }

        window.location.href = "/" + tmpLink;
      },
    }
  });
}

const options = {
  toggleShortcut: "/"
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "var(--a1)" : "transparent",
          borderLeft: `2px solid ${
            active ? "var(--foreground)" : "transparent"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc: string) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId || ""}
          />
        )
      }
    />
  );
}

function App({ companyId }: { companyId: string | null }) {

  const actions = processLinks(companyId);

  return (
    <KBarProvider actions={actions} options={options}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch style={searchStyle} />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
}

export default App;
