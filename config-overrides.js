const { override, useBabelRc } = require('customize-cra');

module.exports = {
    webpack: override(useBabelRc()),
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);

            config.headers = {
                'Access-Control-Allow-Origin': '*',
            };

            config.allowedHosts = [
                '.a.run.app', // Cho phép domain của Google Cloud Run
                '.your-custom-domain.com', // Cho phép domain tùy chỉnh của bạn nếu có
            ];

            return config;
        };
    },
};
