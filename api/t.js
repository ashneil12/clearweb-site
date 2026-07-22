// Minimal first-party engagement beacon for clearweb.one/demo.
//
// Deliberately privacy-clean so it needs no cookie banner and stores nothing
// personal: no cookies, no IP logged, no raw user-agent, no third party.
// Events appear in the Vercel dashboard under the project's Logs tab.
// Filter the logs for "CLEARWEB" to see only these.
//
// Query params:
//   e = event name        (page_view, video_play, video_50, book_click, ...)
//   r = who               (from ?r= on the link, so you can tag each prospect)
//   p = percent watched
module.exports = (req, res) => {
  const q = req.query || {};
  const clean = (v, n) =>
    String(v == null ? "" : v)
      .replace(/[^\w .:%@-]/g, "")
      .slice(0, n);

  const ua = String(req.headers["user-agent"] || "");
  const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";

  console.log(
    "CLEARWEB " +
      JSON.stringify({
        ev: clean(q.e, 24) || "unknown",
        who: clean(q.r, 40) || "direct",
        pct: clean(q.p, 3),
        device: device,
        country: clean(req.headers["x-vercel-ip-country"], 4),
        at: new Date().toISOString()
      })
  );

  res.setHeader("Cache-Control", "no-store");
  res.status(204).end();
};
