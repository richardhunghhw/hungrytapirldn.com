const { withEsbuildOverride } = require('remix-esbuild-override');
const { replace } = require('esbuild-plugin-replace');
const { config } = require('dotenv');

config();

withEsbuildOverride((option) => {
    option.plugins.unshift(
        replace({
            values: {
                __basicCredentials__: Buffer.from(
                    `${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`
                ).toString('base64'),
                __sentryDebug__: process.env.SENTRY_DEBUG,
                __sentryDsn__: process.env.SENTRY_DSN,
                __sentryEnv__: process.env.SENTRY_ENV,
                __sentryTracesSampleRate__:
                    process.env.SENTRY_TRACES_SAMPLE_RATE,
            },
            include: /(\.jsx?|\.tsx?)$/,
        })
    );

    return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
    devServerBroadcastDelay: 1000,
    ignoredRouteFiles: ['**/.*'],
    server: './server.ts',
    serverBuildPath: 'functions/[[path]].js',
    serverConditions: ['worker'],
    serverDependenciesToBundle: 'all',
    serverMainFields: ['browser', 'module', 'main'],
    serverMinify: true,
    serverModuleFormat: 'esm',
    serverPlatform: 'neutral',
    tailwind: true,
    future: {
        v2_errorBoundary: true,
        v2_meta: true,
        v2_normalizeFormMethod: true,
        v2_routeConvention: true,
    },
};
