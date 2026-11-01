# Alma Relay LazyCat community package

Upstream https://github.com/yetone/alma-relay (MIT). Package `community.lazycat.app.almarelay`, min OS 1.5.0, amd64, mirror delivery, community (喵喵) store only.

Alma Relay is a stateless Node relay for Alma Remote Access, not a web chat client. The desktop dials out over WSS; the phone reaches it over HTTPS/WSS at `/c/<routing-token>/...`. Image `ghcr.io/yetone/alma-relay:sha-287107d` is pinned to the digest of upstream `main` commit 287107dd2b2a09398d9789c8e6c772a4663e6cd1; that image declares version 1.0.0 in `shared.mjs`, so the package starts at classic SemVer 1.0.0. Upstream publishes no GitHub Releases and only mutable image tags (`latest`, `sha-*`), so the workflow bumps the patch version only after a proven target-digest change and never invents an upstream SemVer tag.

No database and no persistent volume: the relay stores nothing on disk. A minimal `content/start.mjs` wrapper refuses to start unless `RELAY_REGISTRATION_KEY` is a single-line, at-least-32-character value, because upstream treats an unset key as an open relay. It performs no network probing, health checking or startup gating, then imports the unmodified upstream entrypoint.

The whole relay host is reachable without the platform web login, since native desktop and phone clients cannot complete one. That is the relay's intended trust boundary: registration requires the deployment key, tunnels require the desktop's 256-bit connect code, and desktop Alma >= 0.4.329 with E2E refuses plaintext requests from the relay. The setup guide at `/guide/` stays behind the platform login and never renders the key.

Not included: APNs credentials, so official iOS background notifications do not work; and any TURN service, so the phone's live WebRTC browser view reports `TURN not configured`. Exposing paths does not guarantee public reachability of the app address.

Verified on GitHub: build, mirror delivery digest, LPK download and independent SHA256/license/config assertions. Runtime, registration, pairing, HTTP/SSE/WebSocket tunnels, long connections, TURN and APNs are NOT device-tested.
