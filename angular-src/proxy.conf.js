const PROXY_CONFIG = [
    {
        context: [
            "/share",
        ],
        target: "http://127.0.0.1:8088",
        secure: false
    }
]

module.exports = PROXY_CONFIG;