
let appId = null;

// Initialize Teams SDK v2 (works on v2 and gracefully no-op elsewhere)
microsoftTeams.app.initialize().then(() => {
  return microsoftTeams.app.getContext();
}).then(ctx => {
  appId = (ctx && ctx.app && ctx.app.appId) ? ctx.app.appId : (ctx && ctx.appId ? ctx.appId : null);
}).catch(() => {});

function go(entityId) {
  // Prefer deep link to the tab with that entityId
  if (appId) {
    const link = `https://teams.microsoft.com/l/entity/${appId}/${entityId}`;
    microsoftTeams.app.openLink(link);
  } else {
    // Fallback: navigate to relay page if context not available
    window.location.href = `relay.html?name=${encodeURIComponent(entityId)}&target=#`;
  }
}
